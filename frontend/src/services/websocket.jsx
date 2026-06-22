
import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { IP } from "../../config"

const WebSocketContext = createContext(null)

export function WebSocketProvider({ children }) {
    const [data, setData] = useState(null)
    const wsRef = useRef(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return

        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
        const ws = new WebSocket(`${protocol}//${IP}`)

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "auth", token }))
        }

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data)
            if (msg.type === "telemetry") {
                setData(msg.data)
            }
        }

        ws.onclose = () => {
            wsRef.current = null
            setTimeout(() => {
                if (!wsRef.current) {
                    window.location.reload()
                }
            }, 3000)
        }

        wsRef.current = ws
        return () => ws.close()
    }, [])

    const sendCommand = (deviceId, payload) => {
        if (wsRef.current && wsRef.current.readyState === 1) {
            wsRef.current.send(JSON.stringify({ type: "command", deviceId, payload }))
        }
    }

    return (
        <WebSocketContext.Provider value={{ data, sendCommand }}>
            {children}
        </WebSocketContext.Provider>
    )
}


export function useWebSocket() {
    return useContext(WebSocketContext)
}
