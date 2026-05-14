import aedes from 'aedes'
import net from 'net'
import crypto from 'crypto'
import { json } from 'stream/consumers'

const MQTT_PORT = 1883

const broker = aedes({
    id: 'esp32-broker'
})

const server = net.createServer(broker.handle)

server.listen(MQTT_PORT, () => {
    console.log(`MQTT Broker started on port ${MQTT_PORT}`)
})




broker.authenticate = async function (client, username, password, callback) {
    const expected = crypto
        .createHmac("sha256", process.env.DEVICE_SECRET)
        .update(username)
        .digest("hex")

    if (password.toString() === expected) {
        callback(null, true)
    }
    else {
        callback(new Error("Invalid credentials"), false)
    }
}




broker.on("publish", (packet, client) => {

    //STERGE
     console.log(`[MQTT] PUBLISH received | topic: ${packet.topic} | client: ${client?.id}`)
    
     //if (!client || !packet.topic || !packet.payload) return
     //STERGE
    if (!client || !packet.topic || !packet.payload) {
        console.log(`[MQTT] Skipping: missing client/topic/payload`)
        return
    }
    //PANA AICI

    const match = packet.topic.match(/^devices\/(.+)\/telemetry$/)
    const deviceId = match?.[1]
    //STERGE
    console.log(`[MQTT] Match result: ${deviceId}`)

    if (deviceId) {
        try {
            const data = JSON.parse(packet.payload.toString())
            //STERGE
            console.log(`[MQTT] Received from ${deviceId}:`, JSON.stringify(data, null, 2))
            broker.emit("telemetry", { deviceId, data })
        } catch (err) {
            console.error("Invalid JSON: ", err.message)
        }
    }
})

//STERGE
broker.on('client', (client) => {
    console.log(`[MQTT] Client connected: ${client.id}`)
})
//PANA AICI


export function sendCommand(deviceId, commandType, payload) {
    broker.publish({
        topic: `devices/${deviceId}/commands/${commandType}`,
        payload: Buffer.from(payload)
    })
}








export default broker