import express from "express";
const router = express.Router();

// Emergency
router.post("/panic-button", (req, res) => {});
router.post("/sos-signal", (req, res) => {});
router.get("/nearest-police", (req, res) => {});
router.post("/auto-efir", (req, res) => {});
router.get("/emergency-contacts", (req, res) => {});

export default router;
