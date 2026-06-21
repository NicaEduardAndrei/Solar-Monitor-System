import express from 'express'
import prisma from '../prismaClient.js'
import { Prisma } from '@prisma/client'
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

        const sensorMap = {
            solar: { solarV: true, solarVMin: true, solarVMax: true, solarA: true, solarAMin: true, solarAMax: true, solarW: true, solarWMin: true, solarWMax: true },
            grid: { gridV: true, gridVMin: true, gridVMax: true, gridA: true, gridAMin: true, gridAMax: true, gridW: true, gridWMin: true, gridWMax: true },
            battery: { battV: true, battVMin: true, battVMax: true, battA: true, battAMin: true, battAMax: true, battW: true, battWMin: true, battWMax: true, battTemp: true, battTempMin: true, battTempMax: true, battSoc: true, battSocMin: true, battSocMax: true },
            internal: { internalV: true, internalVMin: true, internalVMax: true, internalA: true, internalAMin: true, internalAMax: true, internalW: true, internalWMin: true, internalWMax: true },
            external: { externalV: true, externalVMin: true, externalVMax: true, externalA: true, externalAMin: true, externalAMax: true, externalW: true, externalWMin: true, externalWMax: true }
        }

        const readings = await prisma[config.table].findMany({
            where: { deviceId, timestamp: startDate ? { gte: startDate } : undefined },
            select: { timestamp: true, ...sensorMap[category] },
            orderBy: { timestamp: "asc" }
        })

        res.json({ data: readings })
    } catch (err) {
        console.error("Error serving chart data:", err)
        res.status(500).json({ message: "Failed to serv chart data" })
    }
})


router.get("/energy-summary", async (req, res) => {

    const { range = "24h" } = req.query
    const devices = await prisma.device.findMany({
        where: { userId: req.userId }
    })

    const tableMap = {
        "24h": { table: "SensorReading", intervalHours: 5 / 60 },
        "7d": { table: "SensorReading", intervalHours: 5 / 60 },
        "30d": { table: "SensorReadingHourly", intervalHours: 1 },
        "1y": { table: "SensorReadingDaily", intervalHours: 24 },
        "all": { table: "SensorReadingWeekly", intervalHours: 168 }
    }

    const deviceId = devices[0].deviceId
    const config = tableMap[range] || tableMap["24h"]
    const rangeMs = { "24h": 86400000, "7d": 604800000, "30d": 2592000000, "1y": 31536000000 }
    const startDate = rangeMs[range] ? new Date(Date.now() - rangeMs[range]) : undefined

    const result = await prisma.$queryRaw`
    SELECT
        COALESCE(SUM("solarW"), 0) * ${config.intervalHours} AS "solarW",
        COALESCE(SUM("gridW"), 0) * ${config.intervalHours} AS "gridW",
        COALESCE(SUM("internalW") + SUM("externalW"), 0) * ${config.intervalHours} AS "consumedW"
    FROM ${Prisma.raw(`"${config.table}"`)}
    WHERE "deviceId" = ${deviceId}
      AND "readingCount" >= 0
      ${startDate ? Prisma.sql`AND "timestamp" >= ${startDate}` : Prisma.empty}
    `

    res.json({
        solarW: +parseFloat(result[0].solarW).toFixed(2),
        gridW: +parseFloat(result[0].gridW).toFixed(2),
        consumedW: +parseFloat(result[0].consumedW).toFixed(2)
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
