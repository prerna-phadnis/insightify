import express from "express";
import groq from "../lib/groqClient.js";
import { buildMisinformationPrompt } from "../lib/prompt.js";

const router = express.Router();

// Helper to normalize arrays
const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return [];
};

router.post("/analyze-claim", async (req, res) => {
  const { claim } = req.body;

  if (!claim || claim.trim().length < 5) {
    return res.status(400).json({ error: "Claim is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: buildMisinformationPrompt(claim) }
      ],
      temperature: 0.2
    });

    const raw = completion.choices[0].message.content;

    // 🔥 Strip markdown if present
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        rawOutput: raw
      });
    }

    // 🔒 Normalize array fields (CRITICAL)
    parsed.why_it_misleads = normalizeArray(parsed.why_it_misleads);
    parsed.missing_context = normalizeArray(parsed.missing_context);
    parsed.potential_impact = normalizeArray(parsed.potential_impact);

    res.json(parsed);

  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});

export default router;
