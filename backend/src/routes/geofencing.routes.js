import express from "express";
const router = express.Router();

// Geofencing
router.get("/zones/:type", (req, res) => {});
router.post("/check-location", (req, res) => {});
router.get("/alerts/:touristId", (req, res) => {});
router.post("/zones/create", (req, res) => {}); // Admin only
router.put("/zones/:id/update", (req, res) => {}); // Admin only

export default router;
