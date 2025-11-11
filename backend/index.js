import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
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
})

