import express from "express";
const router = express.Router();

// Tracking
router.post("/location-update", (req, res) => {});
router.get("/:touristId/current-location", (req, res) => {});
router.get("/:touristId/location-history", (req, res) => {});
router.post("/opt-in-tracking", (req, res) => {});
router.delete("/opt-out-tracking", (req, res) => {});

export default router;
