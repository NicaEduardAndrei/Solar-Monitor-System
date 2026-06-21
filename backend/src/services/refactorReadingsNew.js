import prisma from "../prismaClient.js"

const sensorData = [
    'solarV', 'solarA', 'solarW',
    'gridV', 'gridA', 'gridW',
    'battV', 'battA', 'battW', 'battTemp',
    'battSoc',
    'internalV', 'internalA', 'internalW',
    'externalV', 'externalA', 'externalW'
]

const staticData = ['battState', 'relay1', 'relay2', 'relay3', 'relay4']


const roundTimestampsForDB = {
    hour: d => new Date(new Date(d).setUTCMinutes(0, 0, 0)),
    day: d => new Date(new Date(d).setUTCHours(0, 0, 0, 0)),
    week: d => {
        const dayStart = new Date(new Date(d).setUTCHours(0, 0, 0, 0))
        const dayOfWeek = dayStart.getUTCDay() || 7
        dayStart.setUTCDate(dayStart.getUTCDate() - dayOfWeek + 1)
        return dayStart
    },
    fiveMinute: d => new Date(Math.floor(new Date(d).getTime() / 300000) * 300000)
}

const unitToMS = {
    hour: 3600000,
    day: 86400000,
    week: 604800000
}

const convertTimestampForDB = d => d.toISOString().replace('T', ' ').replace('Z', '')

function avgSensorValue() {
    return sensorData.map(f => `AVG("${f}") as "${f}"`).join(",")
}

function minSensorValue() {
    return sensorData.map(f => `MIN("${f}Min") as "${f}Min"`).join(",")
}

function maxSensorValue() {
    return sensorData.map(f => `MAX("${f}Max") as "${f}Max"`).join(",")
}

function lastStaticValue() {
    return staticData.map(f =>
        `(ARRAY_AGG("${f}" ORDER BY "timestamp" DESC))[1] as "${f}"`
    ).join(",")
}


async function refactor(deviceId, { source, dest, unit }) {
    const last = await prisma[dest].findFirst({
        where: { deviceId, readingCount: { gte: 0 } },
        orderBy: { timestamp: 'desc' }
    })

    let from
    if (last) {
        from = new Date(last.timestamp.getTime() + unitToMS[unit])
    } else {
        from = new Date(0)
    }

    const to = roundTimestampsForDB[unit](new Date())

    if (from >= to) return

    let trunc
    if (unit === 'hour') {
        trunc = "date_trunc('hour', \"timestamp\")"
    } else if (unit === 'day') {
        trunc = "date_trunc('day', \"timestamp\")"
    } else {
        trunc = "date_trunc('week', \"timestamp\")"
    }

    const rows = await prisma.$queryRawUnsafe(`
    SELECT
      ${trunc} as ts,
      COUNT(*) as "readingCount",
      ${avgSensorValue()},
      ${minSensorValue()},
      ${maxSensorValue()},
      ${lastStaticValue()}
    FROM "${source}"
    WHERE "deviceId"='${deviceId}'
      AND "readingCount" >= 0
      AND "timestamp" >= '${from.toISOString()}'
      AND "timestamp" < '${to.toISOString()}'
    GROUP BY ts
    ORDER BY ts
  `)

    if (!rows.length) return



    const readings = []

    for (const r of rows) {
        const reading = {
            deviceId,
            timestamp: r.ts,
            readingCount: Number(r.readingCount)
        }
        for (const senzor of sensorData) {
            reading[senzor] = r[senzor]
            reading[senzor + 'Min'] = r[senzor + 'Min']
            reading[senzor + 'Max'] = r[senzor + 'Max']
        }
        for (const staticSenzor of staticData) {
            reading[staticSenzor] = r[staticSenzor]
        }
        readings.push(reading)
    }
    await prisma[dest].createMany({
        data: readings,
        skipDuplicates: true
    })

}


async function fillGaps(deviceId, table, interval, until) {
    await prisma.$executeRawUnsafe(`
    INSERT INTO "${table}" ("deviceId","timestamp","readingCount")
    SELECT '${deviceId}', slot, -1
    FROM generate_series(
      (SELECT MIN("timestamp") FROM "${table}" WHERE "deviceId"='${deviceId}'),
      '${convertTimestampForDB(until)}'::timestamp,
      '${interval}'::interval
    ) slot
    WHERE NOT EXISTS (
      SELECT 1 FROM "${table}"
      WHERE "deviceId"='${deviceId}'
        AND "timestamp" = slot
    )
  `)
}



async function deleteExtraData(deviceId, table, days) {
    await prisma[table].deleteMany({
        where: {
            deviceId,
            timestamp: {
                lt: new Date(Date.now() - days * 86400000)
            }
        }
    })
}



async function loadDevices() {
    const devices = await prisma.device.findMany({ select: { deviceId: true } })
    return devices.map(d => d.deviceId)
}


async function main() {
    const totalStart = Date.now()
    const deviceIds = await loadDevices()
    if (!deviceIds.length) {
        return
    }

    console.log(`=== REFACTOR START (${deviceIds.length} device(s)) ===`)

    const now = new Date()

    for (const deviceId of deviceIds) {
        console.log(`[Refactor] Processing ${deviceId}`)
        const deviceStart = Date.now()

        
        await refactor(deviceId, {
            source: "SensorReading",
            dest: "sensorReadingHourly",
            unit: "hour"
        })

        await fillGaps(deviceId, "SensorReadingHourly", "1 hour",
            new Date(roundTimestampsForDB.hour(now).getTime() - 3600000))

        
        await refactor(deviceId, {
            source: "SensorReadingHourly",
            dest: "sensorReadingDaily",
            unit: "day"
        })

        await fillGaps(deviceId, "SensorReadingDaily", "1 day",
            new Date(roundTimestampsForDB.day(now).getTime() - 86400000))

        
        await refactor(deviceId, {
            source: "SensorReadingDaily",
            dest: "sensorReadingWeekly",
            unit: "week"
        })

        await fillGaps(deviceId, "SensorReadingWeekly", "1 week",
            new Date(roundTimestampsForDB.week(now).getTime() - 7 * 86400000))

        
        await fillGaps(deviceId, "SensorReading", "5 minutes",
            new Date(roundTimestampsForDB.fiveMinute(now).getTime() - 300000))

        
        await deleteExtraData(deviceId, "sensorReading", 7)
        await deleteExtraData(deviceId, "sensorReadingHourly", 30)
        await deleteExtraData(deviceId, "sensorReadingDaily", 365)


        const deviceDuration = ((Date.now() - deviceStart) / 1000).toFixed(2)
        console.log(`[Refactor] Done processing ${deviceId} in ${deviceDuration}s`)
    }

    const totalDuration = ((Date.now() - totalStart) / 1000).toFixed(2)
    console.log(`=== DONE in ${totalDuration}s ===`)
}

const flushInterval = 60 * 60 * 1000

main().catch(console.error)
setInterval(() => main().catch(console.error), flushInterval)