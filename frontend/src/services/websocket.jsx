
import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { WS_BASE } from "../../config"

const WebSocketContext = createContext(null)

export function WebSocketProvider({ children }) {
    const [data, setData] = useState(null)
    const wsRef = useRef(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return

        const ws = new WebSocket(WS_BASE)

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
            // setTimeout(() => {
            //     if (!wsRef.current) {
            //         window.location.reload()
            //     }
            // }, 100000)
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


// eslint-disable-next-line react-refresh/only-export-components
export function useWebSocket() {
    return useContext(WebSocketContext)
}
