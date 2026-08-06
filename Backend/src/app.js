import express from "express";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRouter from "./routes/interviewRoutes.js";


const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    }));

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRouter); 








export default app;