import mqtt from 'mqtt'
import crypto from 'crypto'

const DEVICE_ID = 'TEST-01'
const DEVICE_SECRET = 'NicaEduardAndreiDeviceINFO'

const password = crypto
    .createHmac('sha256', DEVICE_SECRET)
    .update(DEVICE_ID)
    .digest('hex')

const client = mqtt.connect('mqtt://localhost:1883', {
    clientId: 'esp32-simulator',
    username: DEVICE_ID,
    password: password
})

// Internal state - mirrors what ESP32 maintains
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

// Random fluctuation helper
function fluctuate(base, range) {
    return +(base + (Math.random() - 0.5) * range).toFixed(3)
}

// Generate realistic telemetry with relay-aware values
function generateTelemetry() {
    // Solar: varies naturally (simulating sun/clouds)
    const rawSolarV = fluctuate(24.5, 2)
    const rawSolarA = fluctuate(3.2, 1)
    const solarV = state.relay2 ? 0 : rawSolarV
    const solarA = state.relay2 ? 0 : rawSolarA
    const solarW = +(solarV * solarA).toFixed(3)

    // Grid: stable with small fluctuations
    const rawGridV = fluctuate(230, 10)
    const rawGridA = fluctuate(1.5, 0.5)
    const gridV = state.relay1 ? 0 : rawGridV
    const gridA = state.relay1 ? 0 : rawGridA
    const gridW = +(gridV * gridA).toFixed(3)

    // Battery SOC: changes based on power balance
    const totalIn = solarW + gridW
    const totalOut = 6 + 12 // internal + external base loads
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

    // Internal load: always connected
    const internalV = fluctuate(12.0, 0.5)
    const internalA = fluctuate(0.5, 0.2)
    const internalW = +(internalV * internalA).toFixed(3)

    // External load: affected by relay4
    const rawExternalV = fluctuate(12.0, 0.5)
    const rawExternalA = fluctuate(1.0, 0.3)
    const externalV = state.relay4 ? 0 : rawExternalV
    const externalA = state.relay4 ? 0 : rawExternalA
    const externalW = +(externalV * externalA).toFixed(3)

    // GPS: slow random drift
    state.lat += (Math.random() - 0.5) * 0.00001
    state.long += (Math.random() - 0.5) * 0.00001

    // Servo sun tracking simulation (auto mode)
    if (!state.manual) {
        // Simulate sun moving across sky: azimuth 0→180→0, elevation 0→90→0
        const time = Date.now() / 10000 // slow cycle
        const targetAz = (Math.sin(time) * 0.5 + 0.5) * 180 // 0-180 degrees
        const targetEl = (Math.sin(time * 0.7) * 0.5 + 0.5) * 90 // 0-90 degrees
        
        // Smooth movement towards target (slow servo)
        state.servoAz += (targetAz - state.servoAz) * 0.05
        state.servoEl += (targetEl - state.servoEl) * 0.05
    }
    // In manual mode, servoAz/servoEl stay at whatever value was commanded

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

client.on('connect', () => {
    console.log('[SIMULATOR] Connected to MQTT')
    
    client.subscribe(`devices/${DEVICE_ID}/commands/#`, (err) => {
        if (!err) {
            console.log(`[SIMULATOR] Subscribed to devices/${DEVICE_ID}/commands/#`)
        }
    })
    
    console.log('[SIMULATOR] Sending telemetry every 1s...')
    console.log(`[SIMULATOR] Initial state: manual=${state.manual}, relays=[${state.relay1},${state.relay2},${state.relay3},${state.relay4}]`)
    console.log('')
    
    // Telemetry loop
    setInterval(() => {
        const data = generateTelemetry()
        client.publish(`devices/${DEVICE_ID}/telemetry`, JSON.stringify(data))
        console.log('--- SENT TELEMETRY ---')
        console.log(JSON.stringify(data, null, 2))
        console.log('')
    }, 1000)

    // Auto relay simulation - toggle one random relay every 2-3 seconds
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

client.on('message', (topic, message) => {
    const payload = message.toString()
    console.log('--- RECEIVED COMMAND ---')
    console.log(`Topic: ${topic}`)
    
    try {
        const cmd = JSON.parse(payload)
        
        if (cmd.manual !== undefined) {
            state.manual = cmd.manual
            console.log(`[SIMULATOR] Mode changed: ${state.manual ? 'MANUAL' : 'AUTO'}`)
        }
        if (cmd.relay1 !== undefined) state.relay1 = cmd.relay1
        if (cmd.relay2 !== undefined) state.relay2 = cmd.relay2
        if (cmd.relay3 !== undefined) state.relay3 = cmd.relay3
        if (cmd.relay4 !== undefined) state.relay4 = cmd.relay4
        if (cmd.servoAz !== undefined) state.servoAz = cmd.servoAz
        if (cmd.servoEl !== undefined) state.servoEl = cmd.servoEl
        
        console.log(`[SIMULATOR] State updated: manual=${state.manual}, relays=[${state.relay1},${state.relay2},${state.relay3},${state.relay4}], servoAz=${state.servoAz}, servoEl=${state.servoEl}`)
    } catch (e) {
        console.log(`[SIMULATOR] Raw payload: ${payload}`)
    }
    console.log('')
})

client.on('error', (err) => {
    console.error('[SIMULATOR] MQTT Error:', err.message)
})