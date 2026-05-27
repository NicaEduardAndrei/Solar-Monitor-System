import express from "express"
import authRoutes from "./routes/authRoutes.js"
import authMiddleware from "./middleware/authMiddleware.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import deviceRoutes from "./routes/deviceRoutes.js"
import cors from "cors"
import dotenv from "dotenv"
import deviceMiddleware from "./middleware/deviceMiddleware.js"
import websocket from "./services/websocket.js"
import "./services/mqttBroker.js"
import "./services/aggregator.js"

// ── Refactorizare rulează ca proces separat (nu blochează MQTT) ──
import { fork } from 'child_process';
import path from 'path';

const refactorProcess = fork(
  path.resolve('./src/services/refactorReadings.js'),
  [],
  { env: { ...process.env, REFACTOR_MODE: 'scheduled' } }
);

refactorProcess.on('exit', (code) => {
  console.log(`[Refactor] Process exited with code ${code}`);
});



dotenv.config()
const app = express()
const PORT = process.env.PORT

app.use(express.json())


app.use(cors({
    origin: [
        "http://localhost:5173",
        `http://${process.env.IP}:5173`
    ],
    credentials: true
}));







//Routes
app.use("/auth", authRoutes)
app.use("/dashboard" , authMiddleware , dashboardRoutes)
app.use("/device",deviceMiddleware, deviceRoutes)



const server = app.listen(PORT, "0.0.0.0" , ()=>{
    console.log(`Server has started at port : ${PORT}`)
})

websocket.startWebSocket(server)

// import { getSunPosition } from "./services/sunService.js";
// // teste manuale
// const lat = 44.94;
// const lon = 26.03;
// setInterval(()=>{
//     const result = getSunPosition(lat, lon);
// console.log("Sun position:", result);
// },1000)