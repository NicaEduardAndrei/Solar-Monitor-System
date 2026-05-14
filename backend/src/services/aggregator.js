import broker from "./mqttBroker.js"
import prisma from "../prismaClient.js"

const FLUSH_INTERVAL = 0.5 * 60 * 1000
const SENSOR_FIELDS = [
    'solarV', 'solarA', 'solarW',
    'gridV', 'gridA', 'gridW',
    'battV', 'battA', 'battW', 'battTemp',
    'espTemp',
    'internalV', 'internalA', 'internalW',
    'externalV', 'externalA', 'externalW'
]

const LATEST_FIELDS = ['battState', 'relay1', 'relay2', 'relay3', 'relay4']

const state = new Map()


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
    console.log(`[DEBUG] flushToDB called. state.size = ${state.size}`)
    if (state.size === 0) return

    console.log(`Inserting ${state.size} ${state.size > 1 ? "devices" : "device"} to DB...`)

    try {
        const readings = []

        for (const [deviceId, deviceData] of state) {
            const reading = { deviceId }

            for (const field of SENSOR_FIELDS) {
                const s = deviceData[field]
                if (s && s.count > 0) {
                    reading[field] = s.sum / s.count
                    reading.readingCount = s.count
                    reading[`${field}Min`] = s.min
                    reading[`${field}Max`] = s.max
                }
            }

            for (const field of LATEST_FIELDS) {
                if (deviceData[field] !== undefined) {
                    reading[field] = deviceData[field]
                }
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

setInterval(flushToDB, FLUSH_INTERVAL)

console.log(`[Aggregator] Started. Flush interval: ${FLUSH_INTERVAL / 1000}s`)
