// Importuri necesare pentru WebSocket, autentificare și baza de date
import { WebSocketServer } from 'ws'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { EventEmitter } from 'events'
import prisma from '../prismaClient.js'

// Map pentru clienții web - cheia e WebSocket-ul, valoarea e UN SINGUR deviceId
const usersWS = new Map()
// Map pentru ESP32-uri - cheia e WebSocket-ul, valoarea e deviceId-ul
const devicesWS = new Map()
// EventEmitter exportat pentru a anunța aggregator.js când vine telemetrie
export const aggregatorEvents = new EventEmitter()

// Funcție care verifică dacă ESP32-ul e legitim folosind HMAC
function verifyDevice(deviceId, hmac) {
    const expected = crypto
        .createHmac('sha256', process.env.DEVICE_SECRET)
        .update(deviceId)
        .digest('hex')
    return expected === hmac
}

// Funcția principală care pornește serverul WebSocket
function startWebSocket(server) {
    const wss = new WebSocketServer({ server })

    // Se declanșează când un client (ESP32 sau web) se conectează
    wss.on('connection', (ws, req) => {
        // Verificăm URL-ul ca să diferențiem ESP32 de web
        if (req.url === '/esp') {
            let deviceId = null

            // Handler pentru mesaje de la ESP32
            ws.on('message', (sensorData) => {
                try {
                    const devData = JSON.parse(sensorData.toString())

                    // Autentificare ESP32
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

                    // Dacă nu e autentificat, închidem
                    if (!deviceId) {
                        ws.close()
                        return
                    }

                    // Procesare telemetrie de la ESP32
                    if (devData.type === 'telemetry' && devData.data) {
                        console.log(`[WS] Telemetry from ${deviceId}:`)
                        console.log(JSON.stringify(devData.data, null, 2))
                        
                        // Emitere eveniment pentru aggregator.js
                        aggregatorEvents.emit('telemetry', { deviceId, data: devData.data })

                        // Trimitem telemetria direct la userul care are acest deviceId
                        // Căutăm în usersWS pe cine are acest deviceId
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

            // Handler pentru deconectare ESP32
            ws.on('close', () => {
                    devicesWS.delete(ws)
                    console.log(`[WS] ESP32 ${deviceId} disconnected`)
            })

            ws.on('error', () => ws.close())
            return
        }

        // Client web (frontend)
        ws.on('message', async (userControls) => {
            try {
                const data = JSON.parse(userControls.toString())

                // Autentificare web cu JWT
                if (data.type === 'auth' && !usersWS.has(ws)) {
                    const decoded = jwt.verify(data.token, process.env.JWT_SECRET)
                    // Luăm device-ul userului din baza de date (presupunem că are doar unul)
                    const device = await prisma.device.findFirst({
                        where: { userId: decoded.id }
                    })

                    if (device) {
                        // Salvăm doar deviceId-ul (string simplu, nu array)
                        usersWS.set(ws, device.deviceId)
                        console.log(`[WS] User ${decoded.id} connected to device ${device.deviceId}`)
                    } else {
                        ws.close()
                    }
                    return
                }

                // Procesare comandă de la user
                if (data.type === 'command') {
                    const devId = usersWS.get(ws)
                    // Verificăm dacă userul are acces la acest deviceId
                    if (!devId || devId !== data.deviceId) {
                        ws.close()
                        return
                    }

                    // Trimitem comanda la ESP32
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

        // Handler pentru deconectare web
        ws.on('close', () => usersWS.delete(ws))
    })

    console.log('[WS] WebSocket server initialized')
}

export default { startWebSocket }