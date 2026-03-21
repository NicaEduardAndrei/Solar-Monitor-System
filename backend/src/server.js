import express from "express"
import authRoutes from "./routes/authRoutes.js"
import authMiddleware from "./middleware/authMiddleware.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import cors from "cors"

const app = express()
const PORT = process.env.PORT
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));





//Routes
app.use("/auth", authRoutes)
app.use("/dashboard" , authMiddleware , dashboardRoutes)




app.listen(PORT, ()=>{
    console.log(`Server has started at port : ${PORT}`)
})