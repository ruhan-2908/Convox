import express from 'express';
import authRoute from './routes/auth.route.js';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from './lib/db.js';

dotenv.config();



const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () =>{
    console.log('Backend server is running on port 5001');
    connectDB();
})