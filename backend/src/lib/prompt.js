export function buildMisinformationPrompt(claim) {
  return `
You are a senior misinformation analyst with expertise in media literacy, cognitive bias, and fact-checking.

Analyze the following claim with precision and nuance.

CRITICAL RULES:
- Return ONLY raw JSON. No markdown, no code fences, no preamble.
- All array fields must be proper JSON arrays of strings.
- Be specific and actionable — avoid vague generalities.
- misinformation_risk must be exactly one of: "low", "medium", or "high"
- confidence_score must be a number between 0 and 1
- claim_type should be concise (e.g. "Health Claim", "Political Claim", "Statistical Claim", "Environmental Claim", "Crime Statistic", "Scientific Claim")

Return valid JSON with EXACTLY these fields:
{
  "claim_type": "string — category of the claim",
  "misinformation_risk": "low|medium|high",
  "why_it_misleads": ["array of 2-4 specific reasons why this claim could mislead"],
  "missing_context": ["array of 2-4 important facts or context omitted from this claim"],
  "potential_impact": ["array of 2-3 real-world harms this misinformation could cause"],
  "neutral_rewrite": "string — a single, accurate, balanced restatement of the core idea",
  "confidence_score": 0.0
}

Claim to analyze:
"${claim}"
`;
}