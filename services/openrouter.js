// services/openrouter.js
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

async function generateSummary(text) {
    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
        console.error("❌ OPENROUTER_API_KEY is missing!");
        return "Summary unavailable (missing key).";
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemma-2b-it:free",
                messages: [
                    { role: "system", content: "Summarize these shopping deals in simple and short language." },
                    { role: "user", content: text }
                ]
            })
        });

        const data = await response.json();

        return (
            data?.choices?.[0]?.message?.content ||
            "Summary generation failed."
        );

    } catch (err) {
        console.error("OpenRouter Error:", err);
        return "Summary generation failed due to server error.";
    }
}

module.exports = generateSummary;
