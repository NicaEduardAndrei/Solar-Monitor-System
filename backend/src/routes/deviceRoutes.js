import express from "express"
import prisma from "../prismaClient.js"
import crypto from "crypto"

const router = express.Router()


function generateClaimSecret(length = 10){
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""

    for(let i=0 ; i < length; i++){
        const randomIndex = crypto.randomInt(0, chars.length)
        result += chars[randomIndex]
    }

    return result
}


// Trebuie apelat orice cu deviceId si hmac pentru middleware



router.post("/register", async (req, res) => {
    const existingDevice = await prisma.device.findUnique({
        where: {
            deviceId: req.deviceId
        }
    })
    if (existingDevice) {
        return res.json({
            message: "Device already registered",
            device: existingDevice,
            // claimSecret: existingDevice.claimSecret
        })
    }
    const claimSecret = generateClaimSecret(10)
    const newDevice = await prisma.device.create({
        data: {
            deviceId: req.deviceId,
            claimSecret: claimSecret
        }
    })
    res.json({
        message: "Device registered successfully",
        device: newDevice.deviceId,
        claimSecret: newDevice.claimSecret
    })
})



export default router