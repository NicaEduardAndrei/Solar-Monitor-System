import crypto from "crypto"

function deviceMiddleware(req, res, next) {
    const { deviceId, hmac } = req.body

    if (!deviceId || !hmac) {
        return res.status(400).json({ message: "deviceId and hmac are required" })
    }

    const expectedHmac = crypto
        .createHmac("sha256", process.env.DEVICE_SECRET)
        .update(deviceId)
        .digest("hex")

    if(expectedHmac !== hmac){
        return res.status(401).json({message: "Invalid device signature"})
    }

    req.deviceId = deviceId
    next()
}

export default deviceMiddleware