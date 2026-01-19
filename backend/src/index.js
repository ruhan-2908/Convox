import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from './lib/db.js';
import messageRoute from "./routes/message.route.js";
import cors from "cors";
import {app,server} from "./lib/socket.js";

dotenv.config();



app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoute);
server.listen(process.env.PORT, () =>{
    console.log('Backend server is running on port 5001');
    connectDB();
})