import { IP } from "../config"

let ws = null
let listeners = []
let token = null

export function connectWebSocket() {
    if (ws && ws.readyState === WebSocket.OPEN) return

    token = localStorage.getItem("token")
    ws = new WebSocket(`ws://${IP}:3000`)

    ws.onopen = () => {
        ws.send(JSON.stringify({ type: "auth", token }))
    }

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.type === "telemetry") {
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