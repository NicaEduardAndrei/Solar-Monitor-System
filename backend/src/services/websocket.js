
import { WebSocketServer } from 'ws'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { EventEmitter } from 'events'
import prisma from '../prismaClient.js'

const usersWS = new Map()
const devicesWS = new Map()

export const aggregatorEvents = new EventEmitter()

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


            ws.on('message', (sensorData) => {
                try {
                    const devData = JSON.parse(sensorData.toString())


                    if (devData.type === 'auth' && devData.deviceId && devData.hmac) {
                        if (!verifyDevice(devData.deviceId, devData.hmac)) {
                            ws.close()
                            return
                        }
                        deviceId = devData.deviceId
                        devicesWS.set(ws, deviceId)
                        console.log(`[WS] ESP32 ${deviceId} connected`)
                        return
                    }


                    if (!deviceId) {
                        ws.close()
                        return
                    }


                    if (devData.type === 'telemetry' && devData.data) {
                        console.log(`[WS] Telemetry from ${deviceId}:`)
                        console.log(JSON.stringify(devData.data, null, 2))


                        aggregatorEvents.emit('telemetry', { deviceId, data: devData.data })

                        for (const [userWs, devId] of usersWS) {
                            if (devId === deviceId && userWs.readyState === 1) {
                                userWs.send(JSON.stringify({ type: 'telemetry', deviceId, data: devData.data }))
                            }
                        }
                    }
                } catch (err) {
                    ws.close()
                }
            })


            ws.on('close', () => {
                devicesWS.delete(ws)
                console.log(`[WS] ESP32 ${deviceId} disconnected`)
            })

            ws.on('error', () => ws.close())
            return
        }


        ws.on('message', async (userControls) => {
            try {
                const data = JSON.parse(userControls.toString())


                if (data.type === 'auth' && !usersWS.has(ws)) {
                    const decoded = jwt.verify(data.token, process.env.JWT_SECRET)
                    const device = await prisma.device.findFirst({
                        where: { userId: decoded.id }
                    })

                    if (device) {
                        usersWS.set(ws, device.deviceId)
                        console.log(`[WS] User ${decoded.id} connected to device ${device.deviceId}`)
                    } else {
                        ws.close()
                    }
                    return
                }

                if (data.type === 'command') {
                    const devId = usersWS.get(ws)
                    if (!devId || devId !== data.deviceId) {
                        ws.close()
                        return
                    }

                    for (const [deviceWs, id] of devicesWS) {
                        if (id === data.deviceId && deviceWs.readyState === 1) {
                            deviceWs.send(JSON.stringify({ type: 'command', payload: data.payload }))
                            console.log(`[WS] Command sent to ${data.deviceId}:`, data.payload)
                        }
                    }
                }
            } catch (err) {
                ws.close()
            }
        })

        ws.on('close', () => usersWS.delete(ws))
    })

    console.log('[WS] WebSocket server on')
}

export default { startWebSocket }