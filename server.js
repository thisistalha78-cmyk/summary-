// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// IMPORT SUMMARY SERVICE
const generateSummary = require("./services/openrouter");

// SUMMARY ROUTE (POST REQUEST)
app.post("/api/summary", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ summary: "No text provided." });

    const summary = await generateSummary(text);
    res.json({ summary });
});

// IMPORT DEALS ROUTE (you already have it)
const searchRoute = require("./api/search");
app.use("/api", searchRoute);

// Default route
app.get("/", (req, res) => {
    res.send("Dealfury Backend Running...");
});

// Render requires this
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Backend running on port", PORT));
