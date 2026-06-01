import { WebSocketServer } from 'ws'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'
import broker, { sendCommand } from './mqttBroker.js'
import { json } from 'express'


const clients = new Map()

function startWebSocket(server) {
    const wss = new WebSocketServer({ server })

    wss.on("connection", (ws, req) => {
        ws.on("message", async (message) => {
            try {
                const data = JSON.parse(message.toString())

                if (data.type === 'auth' && !clients.has(ws)) {
                    const decoded = jwt.verify(data.token, process.env.JWT_SECRET)
                    const devices = await prisma.device.findMany({
                        where: { userId: decoded.id }
                    })

                    clients.set(ws, devices.map(d => d.deviceId))
                    console.log(`[WS] User ${decoded.id} connected with ${devices.length} ${devices.length > 1 ? "devices" : "device"}`)
                    return
                }


                

                if (data.type === 'command') {
                    const deviceIds = clients.get(ws)
                    if (!deviceIds || !deviceIds.includes(data.deviceId)) {
                        ws.close()
                        return
                    }
                    sendCommand(data.deviceId, 'manual', JSON.stringify(data.payload))
                    console.log(`[WS] Command sent to ${data.deviceId}:`, data.payload)
                    return
                }



            } catch (err) {
                ws.close()
            }
        })

        ws.on("close", () => clients.delete(ws))
    })

    broker.on('telemetry', ({ deviceId, data }) => {
        for (const [ws, deviceIds] of clients) {
            if (deviceIds.includes(deviceId) && ws.readyState === 1) {
                ws.send(JSON.stringify({ type: 'telemetry', deviceId, data }))
            }
        }
    })

    console.log('[WS] WebSocket server initialized')
}

export default { startWebSocket }
