import prisma from "./src/prismaClient.js"

const DEVICE_ID = "TEST-01"
const DAYS = 730
const INTERVAL_MINUTES = 5
const DOWNTIME_START_DAY = 365
const DOWNTIME_DURATION_HOURS = 24

const BATCH_SIZE = 500

function generateReading(timestamp) {
    const hour = timestamp.getUTCHours() + timestamp.getUTCMinutes() / 60

    const solarFactor = hour >= 6 && hour <= 18
        ? Math.sin(((hour - 6) / 12) * Math.PI)
        : 0

    const noise = (base, pct) => base * (1 + (Math.random() - 0.5) * pct * 2)

    const solarV = solarFactor > 0 ? noise(22, 0.05) * solarFactor : 0
    const solarA = solarFactor > 0 ? noise(1.0, 0.1) * solarFactor : 0
    const solarW = solarV * solarA

    const gridActive = solarFactor < 0.3
    const gridV = gridActive ? noise(15, 0.03) : noise(15, 0.03) * (1 - solarFactor * 0.5)
    const gridA = gridActive ? noise(1.8, 0.1) * (1 - solarFactor * 0.6) : noise(1.8, 0.1) * 0.1
    const gridW = gridV * gridA

    const battCharging = solarFactor > 0.2
    const battV = 7.4 + (battCharging ? 0.3 : -0.2) + (Math.random() - 0.5) * 0.2
    const battA = battCharging ? noise(2.0, 0.15) * solarFactor : -noise(1.5, 0.1)
    const battW = battV * battA

    const internalV = noise(5.0, 0.02)
    const internalA = noise(0.5, 0.2)
    const internalW = internalV * internalA

    const externalV = noise(5.0, 0.02)
    const externalA = noise(2.5, 0.25)
    const externalW = externalV * externalA

    const battTemp = 25 + (battCharging ? 3 : 0) + (Math.random() - 0.5) * 2
    const espTemp = 35 + (Math.random() - 0.5) * 5

    const jitter = (val, pct) => {
        const j = val * pct * 0.02
        return +(val + (Math.random() - 0.5) * j * 2).toFixed(2)
    }

    return {
        deviceId: DEVICE_ID,
        timestamp,
        readingCount: 1,

        solarV: +solarV.toFixed(2),
        solarVMin: jitter(solarV, 1),
        solarVMax: jitter(solarV, 1),
        solarA: +solarA.toFixed(2),
        solarAMin: jitter(solarA, 2),
        solarAMax: jitter(solarA, 2),
        solarW: +solarW.toFixed(2),
        solarWMin: jitter(solarW, 2),
        solarWMax: jitter(solarW, 2),

        gridV: +gridV.toFixed(2),
        gridVMin: jitter(gridV, 1),
        gridVMax: jitter(gridV, 1),
        gridA: +gridA.toFixed(2),
        gridAMin: jitter(gridA, 2),
        gridAMax: jitter(gridA, 2),
        gridW: +gridW.toFixed(2),
        gridWMin: jitter(gridW, 2),
        gridWMax: jitter(gridW, 2),

        battV: +battV.toFixed(2),
        battVMin: jitter(battV, 0.5),
        battVMax: jitter(battV, 0.5),
        battA: +battA.toFixed(2),
        battAMin: jitter(battA, 2),
        battAMax: jitter(battA, 2),
        battW: +battW.toFixed(2),
        battWMin: jitter(battW, 2),
        battWMax: jitter(battW, 2),
        battTemp: +battTemp.toFixed(2),
        battTempMin: jitter(battTemp, 1),
        battTempMax: jitter(battTemp, 1),
        battState: battCharging ? "charging" : "discharging",

        espTemp: +espTemp.toFixed(2),
        espTempMin: jitter(espTemp, 1),
        espTempMax: jitter(espTemp, 1),

        internalV: +internalV.toFixed(2),
        internalVMin: jitter(internalV, 0.5),
        internalVMax: jitter(internalV, 0.5),
        internalA: +internalA.toFixed(2),
        internalAMin: jitter(internalA, 3),
        internalAMax: jitter(internalA, 3),
        internalW: +internalW.toFixed(2),
        internalWMin: jitter(internalW, 3),
        internalWMax: jitter(internalW, 3),

        externalV: +externalV.toFixed(2),
        externalVMin: jitter(externalV, 0.5),
        externalVMax: jitter(externalV, 0.5),
        externalA: +externalA.toFixed(2),
        externalAMin: jitter(externalA, 3),
        externalAMax: jitter(externalA, 3),
        externalW: +externalW.toFixed(2),
        externalWMin: jitter(externalW, 3),
        externalWMax: jitter(externalW, 3),

        relay1: hour >= 7 && hour <= 22,
        relay2: hour >= 8 && hour <= 20,
        relay3: externalA > 2,
        relay4: internalA > 0.3,
    }
}

function generateZeroReading(timestamp) {
    return {
        deviceId: DEVICE_ID,
        timestamp,
        readingCount: 0,

        solarV: 0, solarVMin: 0, solarVMax: 0,
        solarA: 0, solarAMin: 0, solarAMax: 0,
        solarW: 0, solarWMin: 0, solarWMax: 0,

        gridV: 0, gridVMin: 0, gridVMax: 0,
        gridA: 0, gridAMin: 0, gridAMax: 0,
        gridW: 0, gridWMin: 0, gridWMax: 0,

        battV: 0, battVMin: 0, battVMax: 0,
        battA: 0, battAMin: 0, battAMax: 0,
        battW: 0, battWMin: 0, battWMax: 0,
        battTemp: 0, battTempMin: 0, battTempMax: 0,
        battState: "idle",

        espTemp: 0, espTempMin: 0, espTempMax: 0,

        internalV: 0, internalVMin: 0, internalVMax: 0,
        internalA: 0, internalAMin: 0, internalAMax: 0,
        internalW: 0, internalWMin: 0, internalWMax: 0,

        externalV: 0, externalVMin: 0, externalVMax: 0,
        externalA: 0, externalAMin: 0, externalAMax: 0,
        externalW: 0, externalWMin: 0, externalWMax: 0,

        relay1: false,
        relay2: false,
        relay3: false,
        relay4: false,
    }
}

async function main() {
    const deleted = await prisma.sensorReading.deleteMany({ where: { deviceId: DEVICE_ID } })
    console.log(`Deleted ${deleted.count} existing readings for ${DEVICE_ID}`)

    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - DAYS * 24 * 60 * 60 * 1000)
    const downtimeStart = new Date(startDate.getTime() + DOWNTIME_START_DAY * 24 * 60 * 60 * 1000)
    const downtimeEnd = new Date(downtimeStart.getTime() + DOWNTIME_DURATION_HOURS * 60 * 60 * 1000)

    const readings = []
    let current = new Date(startDate)

    while (current <= endDate) {
        const isDowntime = current >= downtimeStart && current < downtimeEnd
        readings.push(isDowntime ? generateZeroReading(new Date(current)) : generateReading(new Date(current)))
        current = new Date(current.getTime() + INTERVAL_MINUTES * 60 * 1000)
    }

    console.log(`Generated ${readings.length} readings for ${DEVICE_ID}`)
    console.log(`From: ${startDate.toISOString()}`)
    console.log(`To:   ${endDate.toISOString()}`)
    console.log(`Downtime: ${downtimeStart.toISOString()} → ${downtimeEnd.toISOString()} (${DOWNTIME_DURATION_HOURS}h)`)

    let inserted = 0
    for (let i = 0; i < readings.length; i += BATCH_SIZE) {
        const batch = readings.slice(i, i + BATCH_SIZE)
        await prisma.sensorReading.createMany({ data: batch })
        inserted += batch.length
        console.log(`Inserted ${inserted}/${readings.length}`)
    }

    console.log("Done!")
    await prisma.$disconnect()
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
