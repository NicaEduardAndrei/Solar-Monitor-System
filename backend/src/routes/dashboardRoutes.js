import express from 'express'
import prisma from '../prismaClient.js'

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
            "7d":  { table: "sensorReading" },
            "30d": { table: "sensorReadingHourly" },
            "1y":  { table: "sensorReadingDaily" },
            "all": { table: "sensorReadingWeekly" }
        }

        const config = tableMap[range] || tableMap["24h"]
        const rangeMs = { "24h": 86400000, "7d": 604800000, "30d": 2592000000, "1y": 31536000000, "all": null }
        const startDate = rangeMs[range] ? new Date(Date.now() - rangeMs[range]) : undefined

        const fieldMap = {
            solar:    { solarV: true, solarVMin: true, solarVMax: true, solarA: true, solarAMin: true, solarAMax: true, solarW: true, solarWMin: true, solarWMax: true },
            grid:     { gridV: true, gridVMin: true, gridVMax: true, gridA: true, gridAMin: true, gridAMax: true, gridW: true, gridWMin: true, gridWMax: true },
            battery:  { battV: true, battVMin: true, battVMax: true, battA: true, battAMin: true, battAMax: true, battW: true, battWMin: true, battWMax: true, battTemp: true, battTempMin: true, battTempMax: true },
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


export default router