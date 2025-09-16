import express from "express";
const router = express.Router();

// Digital ID
router.post("/generate", (req, res) => {});
router.get("/:id/verify", (req, res) => {});
router.put("/:id/update", (req, res) => {});
router.get("/:id/details", (req, res) => {});
router.delete("/:id/revoke", (req, res) => {});

export default router;
