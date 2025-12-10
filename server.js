require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Debugging: Check if OpenRouter key exists
console.log("🔑 OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "YES" : "NO");
console.log("🔑 SERP_API_KEY:", process.env.SERP_API_KEY ? "YES" : "NO");

// Import Routes
const searchRoute = require("./api/search");
const summaryRoute = require("./api/summary");

// Use Routes
app.use("/api/search", searchRoute);
app.use("/api/summary", summaryRoute);

// Default Route
app.get("/", (req, res) => {
    res.send("DealFury Backend Running");
});

// Start Server
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});

