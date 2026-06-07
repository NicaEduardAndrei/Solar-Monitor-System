import { WebSocketServer } from 'ws'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { EventEmitter } from 'events'
import prisma from '../prismaClient.js'

const clients = new Map()
const esp32Clients = new Map()
export const events = new EventEmitter()

function verifyDevice(deviceId, hmac) {
    const expected = crypto
        .createHmac('sha256', process.env.DEVICE_SECRET)
        .update(deviceId)
        .digest('hex')
    return expected === hmac
}

function startWebSocket(server) {
    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws, req) => {
        if (req.url === '/esp') {
            let deviceId = null

            ws.on('message', (raw) => {
                try {
                    const msg = JSON.parse(raw.toString())

                    if (msg.type === 'auth' && msg.deviceId && msg.hmac) {
                        if (!verifyDevice(msg.deviceId, msg.hmac)) {
                            ws.close()
                            return
                        }
                        deviceId = msg.deviceId
                        esp32Clients.set(ws, deviceId)
                        console.log(`[WS] ESP32 ${deviceId} connected`)
                        return
                    }

                    if (!deviceId) {
                        ws.close()
                        return
                    }

                    if (msg.type === 'telemetry' && msg.data) {
                        console.log(`[WS] Telemetry from ${deviceId}:`)
                        console.log(JSON.stringify(msg.data, null, 2))
                        
                        events.emit('telemetry', { deviceId, data: msg.data })

                        for (const [clientWs, deviceIds] of clients) {
                            if (deviceIds.includes(deviceId) && clientWs.readyState === 1) {
                                clientWs.send(JSON.stringify({ type: 'telemetry', deviceId, data: msg.data }))
                            }
                        }
                    }
                } catch (err) {
                    ws.close()
                }
            })

            ws.on('close', () => {
                if (deviceId) {
                    esp32Clients.delete(ws)
                    console.log(`[WS] ESP32 ${deviceId} disconnected`)
                }
            })

            ws.on('error', () => ws.close())
            return
        }

        ws.on('message', async (message) => {
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

                    for (const [espWs, id] of esp32Clients) {
                        if (id === data.deviceId && espWs.readyState === 1) {
                            espWs.send(JSON.stringify({ type: 'command', payload: data.payload }))
                            console.log(`[WS] Command sent to ${data.deviceId}:`, data.payload)
                        }
                    }
                }
            } catch (err) {
                ws.close()
            }
        })

        ws.on('close', () => clients.delete(ws))
    })

    console.log('[WS] WebSocket server initialized')
}

export default { startWebSocket }
