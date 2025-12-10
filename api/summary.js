const express = require("express");
const router = express.Router();
const openrouterSummary = require("../services/openrouter");

// POST /api/summary
router.post("/", async (req, res) => {
    try {
        const text = req.body.text;

        if (!text) {
            return res.json({ error: "Missing text for summary" });
        }

        const summary = await openrouterSummary(text);

        res.json({ summary });
    } catch (err) {
        console.error("SUMMARY API ERROR:", err);
        res.json({ summary: "Summary failed" });
    }
});

module.exports = router;
