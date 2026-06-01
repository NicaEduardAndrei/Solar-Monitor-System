import express from 'express'
import prisma from '../prismaClient.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

router.get("/", async (req, res) => {

    const user = await prisma.user.findUnique({
        where: {
            id: req.userId
        },
        include: {
            devices: true
        }
    })

    res.json({ user })
})


router.post("/pair-device", async (req, res) => {
    const { deviceId, claimSecret } = req.body

    if (!deviceId || !claimSecret) {
        return res.status(400).json({ message: "deviceId and password are required" })
    }

    const device = await prisma.device.findUnique({
        where: {
            deviceId: deviceId
        }
    })



    if (!device) {
        return res.status(404).json({ message: "Device not found" })
    }
    if (device.userId) {
        return res.status(400).json({ message: "Device already claimed by another user" })
    }
    if (device.claimSecret !== claimSecret) {
        return res.status(401).json({ message: "Invalid password" })
    }


    const updatedDevice = await prisma.device.update({
        where: {
            deviceId: deviceId
        },
        data: {
            userId: req.userId
        }
    })

    res.json({ message: "Device paired successfully" })

})


router.get("/charts/:category", async (req, res) => {
    try {
        const { category } = req.params
        const { range = "24h" } = req.query

        const devices = await prisma.device.findMany({
            where: { userId: req.userId }
        })
        if (!devices.length) return res.status(404).json({ message: "No device linked" })
        const deviceId = devices[0].deviceId

        const tableMap = {
            "24h": { table: "sensorReading" },
            "7d": { table: "sensorReading" },
            "30d": { table: "sensorReadingHourly" },
            "1y": { table: "sensorReadingDaily" },
            "all": { table: "sensorReadingWeekly" }
        }

        const config = tableMap[range] || tableMap["24h"]
        const rangeMs = { "24h": 86400000, "7d": 604800000, "30d": 2592000000, "1y": 31536000000, "all": null }
        const startDate = rangeMs[range] ? new Date(Date.now() - rangeMs[range]) : undefined

        const fieldMap = {
            solar: { solarV: true, solarVMin: true, solarVMax: true, solarA: true, solarAMin: true, solarAMax: true, solarW: true, solarWMin: true, solarWMax: true },
            grid: { gridV: true, gridVMin: true, gridVMax: true, gridA: true, gridAMin: true, gridAMax: true, gridW: true, gridWMin: true, gridWMax: true },
            battery: { battV: true, battVMin: true, battVMax: true, battA: true, battAMin: true, battAMax: true, battW: true, battWMin: true, battWMax: true, battTemp: true, battTempMin: true, battTempMax: true, battSoc: true, battSocMin: true, battSocMax: true },
            internal: { internalV: true, internalVMin: true, internalVMax: true, internalA: true, internalAMin: true, internalAMax: true, internalW: true, internalWMin: true, internalWMax: true },
            external: { externalV: true, externalVMin: true, externalVMax: true, externalA: true, externalAMin: true, externalAMax: true, externalW: true, externalWMin: true, externalWMax: true }
        }

        const readings = await prisma[config.table].findMany({
            where: { deviceId, timestamp: startDate ? { gte: startDate } : undefined },
            select: { timestamp: true, ...fieldMap[category] },
            orderBy: { timestamp: "asc" }
        })

        res.json({ data: readings })
    } catch (err) {
        console.error("Error fetching chart data:", err)
        res.status(500).json({ message: "Failed to fetch chart data" })
    }
})


router.get("/energy-summary", async (req, res) => {

    const { range = "24h" } = req.query
    const devices = await prisma.device.findMany({
        where: { userId: req.userId }
    })

    const tableMap = {
        "24h": { table: "SensorReading", hours: 24 },
        "7d": { table: "SensorReading", hours: 168 },
        "30d": { table: "SensorReadingHourly", hours: 720 },
        "1y": { table: "SensorReadingDaily", hours: 8760 },
        "all": { table: "SensorReadingWeekly", hours: null }
    }

    const deviceId = devices[0].deviceId

    const config = tableMap[range] || tableMap["24h"]
    const rangeMs = { "24h": 86400000, "7d": 604800000, "30d": 2592000000, "1y": 31536000000 }
    let hours = config.hours

    if (range === "all") {
        const first = await prisma[config.table].findFirst({
            where: { deviceId, readingCount: { gte: 0 } },
            orderBy: { timestamp: "asc" },
            select: { timestamp: true }
        })
        if (!first) return res.json({ solarW: 0, gridW: 0, consumedW: 0 })
        hours = (Date.now() - first.timestamp.getTime()) / 3600000
    }


    const startDate = rangeMs[range] ? new Date(Date.now() - rangeMs[range]) : undefined

    const result = await prisma.$queryRawUnsafe(`
    SELECT
        AVG("solarW") as "avgSolar",
        AVG("gridW") as "avgGrid",
        AVG("internalW") as "avgInternal",
        AVG("externalW") as "avgExternal"
    FROM "${config.table}"
    WHERE "deviceId"='${deviceId}'
      AND "readingCount" >= 0
      ${startDate ? `AND "timestamp" >= '${startDate.toISOString()}'` : ''}
`)


    console.log('range:', range, 'startDate:', startDate?.toISOString(), 'hours:', hours)
    console.log('query result:', result)


    const row = result[0]
    const avgSolar = parseFloat(row.avgSolar) || 0
    const avgGrid = parseFloat(row.avgGrid) || 0
    const avgInternal = parseFloat(row.avgInternal) || 0
    const avgExternal = parseFloat(row.avgExternal) || 0

    res.json({
        solarW: +(avgSolar * hours).toFixed(2),
        gridW: +(avgGrid * hours).toFixed(2),
        consumedW: +((avgInternal + avgExternal) * hours).toFixed(2)
    })
})


router.put("/username", async (req, res) => {
    const { username } = req.body
    const usernameRegex = /^(?![0-9]+$)[a-zA-Z0-9_. ]{3,20}$/

    if (!username || !usernameRegex.test(username)) {
        return res.status(400).json({ message: "Invalid username format" })
    }

    await prisma.user.update({
        where: { id: req.userId },
        data: { username }
    })

    res.json({ message: "Username updated successfully" })
})


router.put("/email", async (req, res) => {
    const { email } = req.body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" })
    }

    const existingEmail = await prisma.user.findUnique({
        where: { email }
    })

    if (existingEmail) {
        return res.status(409).json({ message: "Email already in use" })
    }

    await prisma.user.update({
        where: { id: req.userId },
        data: { email }
    })

    res.json({ message: "Email updated successfully" })
})


router.put("/password", async (req, res) => {
    const { currentPassword, newPassword } = req.body

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

    if (!newPassword || !passwordRegex.test(newPassword)) {
        res.status(400).json({ message: "Password must be at least 8 characters and include a number" })
    }

    const user = await prisma.user.findUnique({
        where: { id: req.userId }
    })

    if (!bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(401).json({ message: "Current password is incorrect" })
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 8)

    await prisma.user.update({
        where: { id: req.userId },
        data: { password: hashedPassword }
    })

    res.json({ message: "Password updated successfully" })
})



router.delete("/delete-paired-device", async (req, res) => {
    await prisma.device.updateMany({
        where: { userId: req.userId },
        data: { userId: null }
    })
    res.json({ message: "Device unpaired successfully" })
})
export default router
