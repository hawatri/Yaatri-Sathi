import express from "express";
import {getAllTourists,getAllAlerts,broadcastAlert,getSystemStats,manageZones} from '../controllers/admin.controller.js';

const router = express.Router();

// Admin
router.get("/tourists", getAllTourists);
router.get("/alerts", getAllAlerts);
router.post("/broadcast-alert", broadcastAlert);
router.get("/system-stats", getSystemStats);
router.post("/manage-zones", manageZones);

export default router;
