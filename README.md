# Insightify — Explainable Claim Context Tool

Insightify is a GenAI-backed web app that helps users understand how short claims, headlines, or social posts may mislead by identifying missing context, framing choices, and potential impact. It emphasizes explanation and education rather than binary fact labeling.

## Highlights
- Explain why a claim may mislead (not just label it)
- Provide a neutral rewrite and confidence score
- Return structured JSON suitable for UI rendering
- Small, clear backend and a React + Vite frontend

## Repo structure

- backend/ — Node.js + Express API that calls the Groq LLM
- frontend/ — React (Vite) single-page app

## Quickstart (Development)

Prerequisites: Node.js (v18+ recommended) and npm or pnpm.

1) Run the backend

```bash
cd backend
npm install
# create a .env with GROQ_API_KEY (see below)
npm run dev
```

The backend runs on port `5000` by default. Health check: `http://localhost:5000/health`.

2) Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses Vite (default port `5173`). Open the URL shown by Vite in your browser.

## Environment

Required environment variables for the backend (create a `.env` in `backend/`):

- `GROQ_API_KEY` — API key for the Groq LLM SDK used by the backend.
- Optional: `PORT` — port for the backend (defaults to `5000`).

Example `.env` (backend/.env):

```
GROQ_API_KEY=sk-...your-key...
PORT=5000
```

## Backend API

POST /api/analyze-claim

Request JSON:

```json
{ "claim": "The claim text to analyze" }
```

Response: Structured JSON with fields produced by the model:
- `claim_type`
- `misinformation_risk`
- `why_it_misleads` (array)
- `missing_context` (array)
- `potential_impact` (array)
- `neutral_rewrite`
- `confidence_score`

Example curl:

```bash
curl -s -X POST http://localhost:5000/api/analyze-claim \
  -H "Content-Type: application/json" \
  -d '{"claim":"Crime has doubled in area X"}'
```

## Development notes

- The backend uses `groq-sdk` and expects the raw LLM output to be JSON; the route strips markdown fences and parses JSON, returning an error if parsing fails.
- Prompt engineering is in `backend/src/lib/prompt.js` and returns strict JSON tokens for reliability.

## Contributing

- Fork, create a branch, add tests or a small demo, and open a PR.
- Keep prompts and system instructions auditable and version-controlled.

## License

Add a license file if you plan to open-source this project.

---

If you want, I can:

- Add a `.env.example` to `backend/` with the required keys.
- Add a small README snippet inside `frontend/` with the development URL and expected environment.
- Create a simple Postman/Insomnia collection or a curl example file in `scripts/`.

Which would you like next?
