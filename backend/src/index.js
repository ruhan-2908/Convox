import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from './lib/db.js';
import messageRoute from "./routes/message.route.js";

dotenv.config();



const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/message",messageRoute);
app.listen(process.env.PORT, () =>{
    console.log('Backend server is running on port 5001');
    connectDB();
})