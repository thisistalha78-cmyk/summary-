const express = require("express");
const router = express.Router();

const getDeals = require("../services/serpapi");
const generateSummary = require("../services/openrouter");

router.get("/search", async (req, res) => {
    const q = req.query.q;
    if (!q) return res.json({ error: "Missing query parameter" });

    try {
        const deals = await getDeals(q);

        // IF NO DEAL FOUND
        if (!deals || deals.length === 0) {
            return res.json({
                summary: "No deals found for this keyword.",
                deals: []
            });
        }

        // Extract BEST DEAL (Lowest Price)
        const validDeals = deals.filter(d => d.extracted_price);
        const bestDeal = validDeals.length > 0
            ? validDeals.reduce((a, b) => (a.extracted_price < b.extracted_price ? a : b))
            : null;

        // Create text for AI Summary
        let textBlock = deals
            .slice(0, 8)
            .map((d, i) => `${i + 1}) ${d.title} — Price: ${d.extracted_price || "N/A"}`)
            .join("\n");

        if (bestDeal) {
            textBlock =
                `BEST DEAL: ${bestDeal.title} at $${bestDeal.extracted_price}\n\n` +
                textBlock;
        }

        // Generate AI summary
        const summary = await generateSummary(textBlock);

        res.json({
            summary,
            bestDeal, // <-- sending best deal to frontend
            deals
        });

    } catch (err) {
        console.log("SEARCH API ERROR:", err);
        res.json({
            summary: "Something went wrong.",
            deals: []
        });
    }
});

module.exports = router;
