import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import https from "https"
import userRouter from "./routes/user.routes.js"
import geminiResponse from "./gemini.js"


const app=express()
// Allow all origins (reflect the request origin) and keep credentials enabled.
// Using origin: true lets the CORS middleware set the Access-Control-Allow-Origin
// header to the request's Origin. This is useful when you want to accept requests
// from any origin but still allow cookies/credentials.
app.use(cors({
    origin: true,
    credentials: true
}))
const port=process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.get("/", (req, res) => {
    res.send("API is running...");
}
);

app.listen(port,()=>{
    connectDb()
    console.log("server started")

    // Keep-alive ping to prevent idle shutdown on some hosting platforms.
    // Hits the root endpoint every 7 minutes.
    const PING_URL = "https://ai-gaurav-backend.onrender.com/"
    const PING_INTERVAL_MS = 7 * 60 * 1000 // 7 minutes

    function ping() {
        try {
            const req = https.get(PING_URL, (res) => {
                // consume response to free socket
                res.on('data', () => {})
                res.on('end', () => {})
                console.log(`Pinged ${PING_URL} - status: ${res.statusCode}`)
            })
            req.on('error', (err) => {
                console.error(`Ping error: ${err.message}`)
            })
            req.setTimeout(10000, () => { // 10s timeout
                req.abort()
            })
        } catch (err) {
            console.error(`Ping exception: ${err}`)
        }
    }

    // Run an immediate ping, then schedule periodic pings.
    ping()
    const pingInterval = setInterval(ping, PING_INTERVAL_MS)

    // Clear interval on exit signals.
    const cleanup = () => {
        clearInterval(pingInterval)
        process.exit(0)
    }
    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)
})

