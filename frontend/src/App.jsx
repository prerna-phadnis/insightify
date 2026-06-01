import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import ClaimInput from "./components/ClaimInput";
import ResultCard from "./components/ResultCard";
import SkeletonCard from "./components/SkeletonCard";

import "./styles/global.css";

const EXAMPLE_CLAIMS = [
  "Vaccines cause autism in children",
  "Crime has doubled in major cities this year",
  "Electric cars are worse for the environment than gas",
  "Scientists say coffee cures cancer",
  "Immigration is the leading cause of unemployment",
];

export default function App() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  const analyzeClaim = useCallback(async (claimText) => {
    const text = (claimText || claim).trim();
    if (!text) return;

    setLoading(true);
    setError("");
    setResult(null);
    setActiveHistoryId(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/analyze-claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: text }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      const id = Date.now();
      const entry = { id, claim: text, result: data, timestamp: new Date() };

      setResult(data);
      setActiveHistoryId(id);
      setHistory((prev) => [entry, ...prev.slice(0, 19)]);
    } catch {
      setError("Analysis failed. Check your connection or try again.");
    } finally {
      setLoading(false);
    }
  }, [claim]);

  const loadHistoryItem = (entry) => {
    setClaim(entry.claim);
    setResult(entry.result);
    setActiveHistoryId(entry.id);
    setError("");
  };

  const clearHistory = () => {
    setHistory([]);
    setActiveHistoryId(null);
  };

  const handleExample = (text) => {
    setClaim(text);
  };

  // Session stats
  const stats = {
    total: history.length,
    high: history.filter(h => h.result?.misinformation_risk === "high").length,
    medium: history.filter(h => h.result?.misinformation_risk === "medium").length,
    low: history.filter(h => h.result?.misinformation_risk === "low").length,
  };

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="wordmark">
          <div className="wordmark-dot" />
          Insightify
        </div>
        <span className="header-badge">Claim Intelligence v2</span>
      </header>

      {/* Sidebar */}
      <Sidebar
        history={history}
        activeId={activeHistoryId}
        onSelect={loadHistoryItem}
        onClear={clearHistory}
        stats={stats}
      />

      {/* Main content */}
      <main className="app-main">
        {/* Hero */}
        <div className="hero">
          
          <h1>
            Detect <em>Misleading</em><br />Information
          </h1>
          <p className="hero-desc">
            Paste any headline, tweet, or claim. Our AI identifies framing bias,
            missing context, and misinformation risk — with a neutral rewrite.
          </p>
        </div>

        {/* Input */}
        <div className="input-card">
          <div className="input-label">
            <span>Claim Input</span>
            <span
              className={`char-count${claim.length > 450 ? " critical" : claim.length > 350 ? " warn" : ""}`}
            >
              {500 - claim.length} left
            </span>
          </div>

          <ClaimInput value={claim} onChange={setClaim} />

          <div className="input-divider" />

          <div className="input-actions">
            <div className="examples-row">
              <span className="examples-label">Try:</span>
              {EXAMPLE_CLAIMS.slice(0, 3).map((ex) => (
                <button
                  key={ex}
                  className="example-chip"
                  onClick={() => handleExample(ex)}
                  title={ex}
                >
                  {ex}
                </button>
              ))}
            </div>

            <button
              className={`btn-analyze${loading ? " loading" : ""}`}
              onClick={() => analyzeClaim()}
              disabled={loading || claim.trim().length < 5}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="6.5" cy="6.5" r="5" />
                    <path d="M10.5 10.5L14 14" strokeLinecap="round" />
                  </svg>
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-msg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M8 5v3.5M8 11v.5" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <SkeletonCard />}

        {/* Result */}
        {!loading && result && (
          <ResultCard result={result} claim={claim} />
        )}
      </main>
    </div>
  );
}