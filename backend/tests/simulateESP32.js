import WebSocket from 'ws'
import crypto from 'crypto'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const DEVICE_ID = process.env.DEVICE_ID || 'TEST-01'
const DEVICE_SECRET = process.env.DEVICE_SECRET

const hmac = crypto
    .createHmac('sha256', DEVICE_SECRET)
    .update(DEVICE_ID)
    .digest('hex')

const ws = new WebSocket(process.env.WS_URL || 'ws://localhost:3000/esp')

const state = {
    manual: false,
    relay1: false,
    relay2: false,
    relay3: false,
    relay4: false,
    battSoc: 75.0,
    lat: 45.054940,
    long: 26.028631,
    servoAz: 0,
    servoEl: 0,
}

function fluctuate(base, range) {
    return +(base + (Math.random() - 0.5) * range).toFixed(3)
}

function generateTelemetry() {
    const rawSolarV = fluctuate(24.5, 2)
    const rawSolarA = fluctuate(3.2, 1)
    const solarV = state.relay2 ? 0 : rawSolarV
    const solarA = state.relay2 ? 0 : rawSolarA
    const solarW = +(solarV * solarA).toFixed(3)

    const rawGridV = fluctuate(230, 10)
    const rawGridA = fluctuate(1.5, 0.5)
    const gridV = state.relay1 ? 0 : rawGridV
    const gridA = state.relay1 ? 0 : rawGridA
    const gridW = +(gridV * gridA).toFixed(3)

    const totalIn = solarW + gridW
    const totalOut = 6 + 12
    if (totalIn > totalOut) {
        state.battSoc = Math.min(100, state.battSoc + 0.05)
    } else {
        state.battSoc = Math.max(0, state.battSoc - 0.05)
    }

    const rawBattV = fluctuate(12.8, 0.5)
    const battV = state.relay3 ? 0 : rawBattV
    const battA = state.relay3 ? 0 : +((totalIn - totalOut) / (battV || 12.8)).toFixed(3)
    const battW = +(battV * battA).toFixed(3)

    const battState = battA > 0.02 ? 'charging' : battA < -0.02 ? 'discharging' : 'idle'

    const internalV = fluctuate(12.0, 0.5)
    const internalA = fluctuate(0.5, 0.2)
    const internalW = +(internalV * internalA).toFixed(3)

    const rawExternalV = fluctuate(12.0, 0.5)
    const rawExternalA = fluctuate(1.0, 0.3)
    const externalV = state.relay4 ? 0 : rawExternalV
    const externalA = state.relay4 ? 0 : rawExternalA
    const externalW = +(externalV * externalA).toFixed(3)

    state.lat += (Math.random() - 0.5) * 0.00001
    state.long += (Math.random() - 0.5) * 0.00001

    if (!state.manual) {
        const time = Date.now() / 10000
        const targetAz = (Math.sin(time) * 0.5 + 0.5) * 180
        const targetEl = (Math.sin(time * 0.7) * 0.5 + 0.5) * 90
        
        state.servoAz += (targetAz - state.servoAz) * 0.05
        state.servoEl += (targetEl - state.servoEl) * 0.05
    }

    return {
        solarV, solarA, solarW,
        gridV, gridA, gridW,
        battV, battA, battW,
        battTemp: fluctuate(35, 3),
        battSoc: +state.battSoc.toFixed(1),
        battState,
        espTemp: fluctuate(42, 5),
        internalV, internalA, internalW,
        externalV, externalA, externalW,
        relay1: state.relay1,
        relay2: state.relay2,
        relay3: state.relay3,
        relay4: state.relay4,
        manual: state.manual,
        lat: +state.lat.toFixed(6),
        long: +state.long.toFixed(6),
        servoAz: state.servoAz,
        servoEl: state.servoEl,
    }
}

ws.on('open', () => {
    console.log('[SIMULATOR] WebSocket connected')
    ws.send(JSON.stringify({ type: 'auth', deviceId: DEVICE_ID, hmac }))

    console.log(`[SIMULATOR] Auth sent for ${DEVICE_ID}`)
    console.log(`[SIMULATOR] Initial state: manual=${state.manual}, relays=[${state.relay1},${state.relay2},${state.relay3},${state.relay4}]`)
    console.log('')

    setInterval(() => {
        const data = generateTelemetry()
        ws.send(JSON.stringify({ type: 'telemetry', data }))
        console.log('--- SENT TELEMETRY ---')
        console.log(JSON.stringify(data, null, 2))
        console.log('')
    }, 1000)

    function autoRelayLoop() {
        setTimeout(() => {
            if (!state.manual) {
                const relayKeys = ['relay1', 'relay2', 'relay3', 'relay4']
                const randomRelay = relayKeys[Math.floor(Math.random() * relayKeys.length)]
                state[randomRelay] = !state[randomRelay]
                console.log(`[SIMULATOR] AUTO relay toggle: ${randomRelay} = ${state[randomRelay]}`)
            }
            autoRelayLoop()
        }, 2000 + Math.random() * 1000)
    }
    autoRelayLoop()
})

ws.on('message', (raw) => {
    try {
        const msg = JSON.parse(raw.toString())

        if (msg.type === 'command') {
            const cmd = msg.payload
            console.log('--- RECEIVED COMMAND ---')
            console.log(JSON.stringify(cmd, null, 2))

            if (cmd.manual !== undefined) {
                state.manual = cmd.manual
                console.log(`[SIMULATOR] Mode: ${state.manual ? 'MANUAL' : 'AUTO'}`)
            }
            if (cmd.relay1 !== undefined) state.relay1 = cmd.relay1
            if (cmd.relay2 !== undefined) state.relay2 = cmd.relay2
            if (cmd.relay3 !== undefined) state.relay3 = cmd.relay3
            if (cmd.relay4 !== undefined) state.relay4 = cmd.relay4
            if (cmd.servoAz !== undefined) state.servoAz = cmd.servoAz
            if (cmd.servoEl !== undefined) state.servoEl = cmd.servoEl

            console.log(`[SIMULATOR] State: manual=${state.manual}, relays=[${state.relay1},${state.relay2},${state.relay3},${state.relay4}], servoAz=${state.servoAz}, servoEl=${state.servoEl}`)
            console.log('')
        }
    } catch (e) {
        console.log('[SIMULATOR] Parse error:', e.message)
    }
})

ws.on('error', (err) => {
    console.error('[SIMULATOR] Error:', err.message)
})

ws.on('close', () => {
    console.log('[SIMULATOR] Disconnected')
})
