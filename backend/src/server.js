//cloudflared tunnel run licenta-tunnel


import express from "express"
import authRoutes from "./routes/authRoutes.js"
import authMiddleware from "./middleware/authMiddleware.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import deviceRoutes from "./routes/deviceRoutes.js"
import cors from "cors"
import dotenv from "dotenv"
import deviceMiddleware from "./middleware/deviceMiddleware.js"
import websocket from "./services/websocket.js"
import "./services/aggregator.js"
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';





const refactorProcess = fork(
    path.resolve('./src/services/refactorReadings.js'),
    [],
    { env: { ...process.env, REFACTOR_MODE: 'scheduled' } }
);

refactorProcess.on('exit', (code) => {
    console.log(`[Refactor] Process exited with code ${code}`);
});



dotenv.config()
const file = fileURLToPath(import.meta.url)
const dir = path.dirname(file)
const DOMAIN = process.env.DOMAIN || "localhost"

const app = express()
const PORT = process.env.PORT

app.use(express.json())


app.use(cors({
    origin: [
        "http://localhost:5173",
        `http://${process.env.IP}:5173`,
        `https://${DOMAIN}`,
        `https://www.${DOMAIN}`
    ],
    credentials: true
}));



//Routes
app.use("/api/auth", authRoutes)
app.use("/api/dashboard", authMiddleware, dashboardRoutes)
app.use("/api/device", deviceMiddleware, deviceRoutes)

// frontend in production
if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(dir, "../../frontend/dist")
    app.use(express.static(distPath))

    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"))
    })
}

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started : ${PORT}`)
})

websocket.startWebSocket(server)
