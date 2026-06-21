import { aggregatorEvents } from "./websocket.js"
import prisma from "../prismaClient.js"

const flushInterval = 5 * 60 * 1000
const reloadDevInterval = 5 * 60 * 1000
const sensorData = [
    'solarV', 'solarA', 'solarW',
    'gridV', 'gridA', 'gridW',
    'battV', 'battA', 'battW', 'battTemp',
    'battSoc',
    'internalV', 'internalA', 'internalW',
    'externalV', 'externalA', 'externalW'
]

const staticData = ['battState', 'relay1', 'relay2', 'relay3', 'relay4']

const tempData = new Map()
let allDeviceIds = []




async function loadDevicesFromDB() {
    const devices = await prisma.device.findMany({ select: { deviceId: true } })
    allDeviceIds = devices.map(device => device.deviceId)
    console.log(`[Aggregator] Loaded ${allDeviceIds.length} devices from DB`)
}





function processTelemetry(deviceId, data) {
    if (!tempData.has(deviceId)) {
        tempData.set(deviceId, {})
    }

    const deviceData = tempData.get(deviceId)

    for (const field of sensorData) {
        if (data[field] !== undefined && data[field] !== null) {
            const value = parseFloat(data[field])
            if (isNaN(value)) continue

            if (!deviceData[field]) {
                deviceData[field] = { sum: value, count: 1, min: value, max: value }
            } else {
                deviceData[field].sum += value
                deviceData[field].count++

                if (value < deviceData[field].min) {
                    deviceData[field].min = value
                }
                if (value > deviceData[field].max) {
                    deviceData[field].max = value
                }
            }
        }
    }


    for (const field of staticData) {
        if (data[field] !== undefined) {
            deviceData[field] = data[field]
        }
    }
}


async function sendToDB() {
    try {
        const readings = []

        for (const deviceId of allDeviceIds) {
            const deviceData = tempData.get(deviceId) || {}
            const reading = {
                deviceId,
                timestamp: new Date(Math.floor(Date.now() / 300000) * 300000)
            }

            for (const field of sensorData) {
                const sensor = deviceData[field]
                if (sensor && sensor.count > 0) {
                    reading[field] = sensor.sum / sensor.count
                    reading.readingCount = (reading.readingCount || 0) + sensor.count
                    reading[`${field}Min`] = sensor.min
                    reading[`${field}Max`] = sensor.max
                } else {
                    reading[field] = 0
                    reading[`${field}Min`] = 0
                    reading[`${field}Max`] = 0
                }
            }

            if (!reading.readingCount) {
                reading.readingCount = 0
            }

            for (const field of staticData) {
                reading[field] = deviceData[field] !== undefined ? deviceData[field] : null
            }

            readings.push(reading)
        }

        const result = await prisma.sensorReading.createMany({ data: readings })
        console.log(`[Aggregator] Sent ${allDeviceIds.length} devices with ${tempData.size} size to DB`)

        tempData.clear()

    } catch (err) {
        console.error('[Aggregator] Error sending to DB:', err.message)
    }
}

aggregatorEvents.on('telemetry', ({ deviceId, data }) => {
    processTelemetry(deviceId, data)
})

    ; (async () => {
        await loadDevicesFromDB()
        setInterval(sendToDB, flushInterval)
        setInterval(loadDevicesFromDB, reloadDevInterval)
        console.log(`[Aggregator] Started. Flush interval: ${flushInterval / 1000}s, Reload devices interval: ${reloadDevInterval / 1000}s`)
    })()
