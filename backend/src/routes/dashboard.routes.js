import express from "express";
const router = express.Router();

// Dashboard
router.get("/tourist-clusters", (req, res) => {});
router.get("/heat-maps", (req, res) => {});
router.get("/analytics", (req, res) => {});
router.get("/alerts-summary", (req, res) => {});
router.get("/statistics", (req, res) => {});

export default router;
