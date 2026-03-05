export const config = {
    maxDuration: 30,
};

export default async function handler(req, res) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
        console.error("ANTHROPIC_API_KEY is not set in environment variables");
        return res.status(500).json({
            error: "ANTHROPIC_API_KEY not configured. Add it in Vercel → Settings → Environment Variables.",
        });
    }

    // Parse body — Vercel auto-parses JSON, but handle edge cases
    let body = req.body;
    if (typeof body === "string") {
        try {
            body = JSON.parse(body);
        } catch {
            return res.status(400).json({ error: "Invalid JSON in request body" });
        }
    }

    if (!body || !body.model || !body.messages) {
        return res.status(400).json({
            error: "Missing required fields: model, messages",
        });
    }

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: body.model,
                max_tokens: body.max_tokens || 1200,
                system: body.system,
                messages: body.messages,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`Anthropic API error ${response.status}:`, errText);
            return res.status(response.status).json({
                error: `Anthropic API error: ${errText}`,
            });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        console.error("Anthropic proxy error:", err.message || err);
        return res.status(500).json({
            error: `Failed to reach Anthropic API: ${err.message}`,
        });
    }
}
