import express from 'express';

import cors from 'cors';

import dotenv from 'dotenv';

import authRoutes from "./routes/auth.routes.js";
import digitalIdRoutes from "./routes/digitalId.routes.js";
import touristsRoutes from "./routes/tourists.routes.js";
import geofencingRoutes from "./routes/geofencing.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import anomalyRoutes from "./routes/anomaly.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import iotRoutes from "./routes/iot.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import journeyRoutes from './routes/journey.routes.js';

import { connectDB } from './utilities/connectDB.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    
}))

app.use("/api/auth", authRoutes);
app.use("/api/digital-id", digitalIdRoutes);
app.use("/api/tourists", touristsRoutes);
app.use("/api/geofencing", geofencingRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/anomaly", anomalyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/iot", iotRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/journey', journeyRoutes);

app.listen(process.env.PORT || 3000, () => {
    connectDB();
    console.log(`Server running on port ${process.env.PORT || 3000} .....`);
});