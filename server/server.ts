import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/auth', authRouter);
app.use('/api/restaurnts', restaurantRouter);

//Global error handler
app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({
         message: 'Something went wrong!' ,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});