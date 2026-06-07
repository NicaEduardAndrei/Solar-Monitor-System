import { IP } from "../../config"

let ws = null
let listeners = []
let token = null
let latestTelemetry = null

export function connectWebSocket() {
    if (ws && ws.readyState === WebSocket.OPEN) return

    token = localStorage.getItem("token")
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    ws = new WebSocket(`${protocol}//${IP}`)

    ws.onopen = () => {
        ws.send(JSON.stringify({ type: "auth", token }))
    }

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.type === "telemetry") {
            latestTelemetry = message.data
            listeners.forEach(fn => fn(message.data))
        }
    }

    ws.onclose = () => {
        console.log("WebSocket disconnected, reconnecting in 3s...")
        ws = null
        setTimeout(connectWebSocket, 3000)
    }
}

export function onTelemetry(callback) {
    listeners.push(callback)
    return () => {
        listeners = listeners.filter(fn => fn !== callback)
    }
}

export function getLiveData() {
    return ws?.readyState === WebSocket.OPEN
}

export function getLatestTelemetry() {
    return latestTelemetry
}


export function sendCommand(deviceId, payload) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "command", deviceId, payload }))
    } else {
        console.error("WebSocket not connected")
    }
}