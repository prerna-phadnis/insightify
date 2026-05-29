export function buildMisinformationPrompt(claim) {
  return `
You are a misinformation analyst.

Analyze the following claim.

IMPORTANT RULES:
- Return ONLY raw JSON
- Do NOT wrap the response in markdown
- Do NOT use \`\`\`
- Do NOT add explanations outside JSON

Return valid JSON with exactly these fields:
- claim_type
- misinformation_risk
- why_it_misleads
- missing_context
- potential_impact
- neutral_rewrite
- confidence_score

Claim:
"${claim}"
`;
}
