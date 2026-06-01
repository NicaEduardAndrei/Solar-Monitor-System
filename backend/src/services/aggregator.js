import broker from "./mqttBroker.js"
import prisma from "../prismaClient.js"

const FLUSH_INTERVAL = 5 * 60 * 1000
const RELOAD_DEVICES_INTERVAL = 5 * 60 * 1000
const SENSOR_FIELDS = [
    'solarV', 'solarA', 'solarW',
    'gridV', 'gridA', 'gridW',
    'battV', 'battA', 'battW', 'battTemp',
    'battSoc',
    'internalV', 'internalA', 'internalW',
    'externalV', 'externalA', 'externalW'
]

const LATEST_FIELDS = ['battState', 'relay1', 'relay2', 'relay3', 'relay4']

const state = new Map()
let allDeviceIds = []

async function loadDevicesFromDB() {
    try {
        const devices = await prisma.device.findMany({ select: { deviceId: true } })
        allDeviceIds = devices.map(d => d.deviceId)
        console.log(`[Aggregator] Loaded ${allDeviceIds.length} device(s) from DB`)
    } catch (err) {
        console.error('[Aggregator] Error loading devices from DB:', err.message)
    }
}


function processTelemetry(deviceId, data) {
    if (!state.has(deviceId)) {
        state.set(deviceId, {})
    }

    const deviceData = state.get(deviceId)

    for (const field of SENSOR_FIELDS) {
        if (data[field] !== undefined && data[field] !== null) {
            const value = parseFloat(data[field])
            if (isNaN(value)) continue

            if (!deviceData[field]) {
                deviceData[field] = { sum: value, count: 1, min: value, max: value }
            } else {
                deviceData[field].sum += value
                deviceData[field].count++
                if (value < deviceData[field].min) deviceData[field].min = value
                if (value > deviceData[field].max) deviceData[field].max = value
            }
        }
    }

    for (const field of LATEST_FIELDS) {
        if (data[field] !== undefined) {
            deviceData[field] = data[field]
        }
    }
}


async function flushToDB() {
    console.log(`[DEBUG] flushToDB called. allDeviceIds.length = ${allDeviceIds.length}, state.size = ${state.size}`)
    if (allDeviceIds.length === 0) return

    console.log(`Inserting ${allDeviceIds.length} ${allDeviceIds.length > 1 ? "devices" : "device"} to DB...`)

    try {
        const readings = []

        for (const deviceId of allDeviceIds) {
            const deviceData = state.get(deviceId) || {}
            const reading = {
                deviceId,
                timestamp: new Date(Math.floor(Date.now() / 300000) * 300000)
            }

            for (const field of SENSOR_FIELDS) {
                const s = deviceData[field]
                if (s && s.count > 0) {
                    reading[field] = s.sum / s.count
                    reading.readingCount = (reading.readingCount || 0) + s.count
                    reading[`${field}Min`] = s.min
                    reading[`${field}Max`] = s.max
                } else {
                    reading[field] = 0
                    reading[`${field}Min`] = 0
                    reading[`${field}Max`] = 0
                }
            }

            if (!reading.readingCount) {
                reading.readingCount = 0
            }

            for (const field of LATEST_FIELDS) {
                reading[field] = deviceData[field] !== undefined ? deviceData[field] : null
            }

            readings.push(reading)
        }

        const result = await prisma.sensorReading.createMany({ data: readings })
        console.log(`[Aggregator] Saved ${result.count} reading(s) to DB`)

        state.clear()

    } catch (err) {
        console.error('[Aggregator] Error flushing to DB:', err.message)
    }
}

broker.on('telemetry', ({ deviceId, data }) => {
    processTelemetry(deviceId, data)
})

    ; (async () => {
        await loadDevicesFromDB()
        setInterval(flushToDB, FLUSH_INTERVAL)
        setInterval(loadDevicesFromDB, RELOAD_DEVICES_INTERVAL)
        console.log(`[Aggregator] Started. Flush interval: ${FLUSH_INTERVAL / 1000}s, Reload devices interval: ${RELOAD_DEVICES_INTERVAL / 1000}s`)
    })()
