import prisma from "../prismaClient.js"

const SENSOR_FIELDS = [
  'solarV', 'solarA', 'solarW',
  'gridV', 'gridA', 'gridW',
  'battV', 'battA', 'battW', 'battTemp',
  'battSoc',
  'internalV', 'internalA', 'internalW',
  'externalV', 'externalA', 'externalW'
]

const LATEST_FIELDS = ['battState', 'relay1', 'relay2', 'relay3', 'relay4']


const floor = {
  hour: d => new Date(new Date(d).setUTCMinutes(0, 0, 0)),
  day: d => new Date(new Date(d).setUTCHours(0, 0, 0, 0)),
  week: d => {
    const x = new Date(new Date(d).setUTCHours(0, 0, 0, 0))
    const dow = x.getUTCDay() || 7
    x.setUTCDate(x.getUTCDate() - dow + 1)
    return x
  }
}

const floor5 = d => new Date(Math.floor(new Date(d).getTime() / 300000) * 300000)

const sqlTs = d => d.toISOString().replace('T', ' ').replace('Z', '')

function avgFields() {
  return SENSOR_FIELDS.map(f => `AVG("${f}") as "${f}"`).join(",")
}

function minFields() {
  return SENSOR_FIELDS.map(f => `MIN("${f}Min") as "${f}Min"`).join(",")
}

function maxFields() {
  return SENSOR_FIELDS.map(f => `MAX("${f}Max") as "${f}Max"`).join(",")
}

function latestFields() {
  return LATEST_FIELDS.map(f =>
    `(ARRAY_AGG("${f}" ORDER BY "timestamp" DESC))[1] as "${f}"`
  ).join(",")
}


async function aggregate(deviceId, { source, dest, unit, intervalMs }) {
  const last = await prisma[dest].findFirst({
    where: { deviceId, readingCount: { gte: 0 } },
    orderBy: { timestamp: 'desc' }
  })

  const from = last
    ? new Date(last.timestamp.getTime() + intervalMs)
    : new Date(0)

  const to = floor[unit](new Date())

  if (from >= to) return

  const trunc =
    unit === 'hour' ? "date_trunc('hour', \"timestamp\")" :
      unit === 'day' ? "date_trunc('day', \"timestamp\")" :
        "date_trunc('week', \"timestamp\")"

  const rows = await prisma.$queryRawUnsafe(`
    SELECT
      ${trunc} as ts,
      COUNT(*) as "readingCount",
      ${avgFields()},
      ${minFields()},
      ${maxFields()},
      ${latestFields()}
    FROM "${source}"
    WHERE "deviceId"='${deviceId}'
      AND "readingCount" >= 0
      AND "timestamp" >= '${from.toISOString()}'
      AND "timestamp" < '${to.toISOString()}'
    GROUP BY ts
    ORDER BY ts
  `)

  if (!rows.length) return

  await prisma[dest].createMany({
    data: rows.map(r => ({
      deviceId,
      timestamp: r.ts,
      readingCount: Number(r.readingCount),
      ...Object.fromEntries(SENSOR_FIELDS.map(f => [f, r[f]])),
      ...Object.fromEntries(SENSOR_FIELDS.map(f => [`${f}Min`, r[`${f}Min`]])),
      ...Object.fromEntries(SENSOR_FIELDS.map(f => [`${f}Max`, r[`${f}Max`]])),
      ...Object.fromEntries(LATEST_FIELDS.map(f => [f, r[f]]))
    })),
    skipDuplicates: true
  })
}


async function fillGaps(deviceId, table, interval, until) {
  await prisma.$executeRawUnsafe(`
    INSERT INTO "${table}" ("deviceId","timestamp","readingCount")
    SELECT '${deviceId}', slot, -1
    FROM generate_series(
      (SELECT MIN("timestamp") FROM "${table}" WHERE "deviceId"='${deviceId}'),
      '${sqlTs(until)}'::timestamp,
      '${interval}'::interval
    ) slot
    WHERE NOT EXISTS (
      SELECT 1 FROM "${table}"
      WHERE "deviceId"='${deviceId}'
        AND "timestamp" = slot
    )
  `)
}



async function purge(deviceId, table, days) {
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
  const deviceIds = await loadDevices()
  if (!deviceIds.length) {
    console.log("[Refactor] No devices found, skipping")
    return
  }

  console.log(`=== REFACTOR START (${deviceIds.length} device(s)) ===`)

  const now = new Date()

  for (const deviceId of deviceIds) {
    console.log(`[Refactor] Processing ${deviceId}`)

    // 5min → hourly
    await aggregate(deviceId, {
      source: "SensorReading",
      dest: "sensorReadingHourly",
      unit: "hour",
      intervalMs: 3600000
    })

    await fillGaps(deviceId, "SensorReadingHourly", "1 hour",
      new Date(floor.hour(now).getTime() - 3600000))

    // hourly → daily
    await aggregate(deviceId, {
      source: "SensorReadingHourly",
      dest: "sensorReadingDaily",
      unit: "day",
      intervalMs: 86400000
    })

    await fillGaps(deviceId, "SensorReadingDaily", "1 day",
      new Date(floor.day(now).getTime() - 86400000))

    // daily → weekly
    await aggregate(deviceId, {
      source: "SensorReadingDaily",
      dest: "sensorReadingWeekly",
      unit: "week",
      intervalMs: 7 * 86400000
    })

    await fillGaps(deviceId, "SensorReadingWeekly", "1 week",
      new Date(floor.week(now).getTime() - 7 * 86400000))

    // raw gaps
    await fillGaps(deviceId, "SensorReading", "5 minutes",
      new Date(floor5(now).getTime() - 300000))

    // retention
    await purge(deviceId, "sensorReading", 7)
    await purge(deviceId, "sensorReadingHourly", 30)
    await purge(deviceId, "sensorReadingDaily", 365)
  }

  console.log("=== DONE ===")
}

const INTERVAL = 5 * 60 * 1000

main().catch(console.error)
setInterval(() => main().catch(console.error), INTERVAL)
