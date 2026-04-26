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

    if(!deviceId || !claimSecret){
        return res.status(400).json({message: "deviceId and password are required"})
    }

    const device = await prisma.device.findUnique({
        where:{
            deviceId: deviceId
        }
    })



    if(!device){
        return res.status(404).json({message: "Device not found"})
    }
    if(device.userId){
        return res.status(400).json({message: "Device already claimed by another user"})
    }
    if(device.claimSecret !== claimSecret){
        return res.status(401).json({message: "Invalid password"})
    }


    const updatedDevice = await prisma.device.update({
        where:{
            deviceId: deviceId
        },
        data: {
            userId: req.userId
        }
    })

    res.json({message: "Device paired successfully"})

})

export default router