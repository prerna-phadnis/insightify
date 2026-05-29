import "../styles/results.css";

export default function ResultCard({ result }) {
  if (!result) return null;

  const confidencePercent = Math.round(
    (result.confidence_score || 0) * 100
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.neutral_rewrite);
  };

  return (
    <div className="card" style={{ marginTop: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>Analysis Result</h2>
          <p style={{ color: "#a0a3c4" }}>
            Claim type: <strong>{result.claim_type}</strong>
          </p>
        </div>

        <span className={`badge ${result.misinformation_risk}`}>
          {result.misinformation_risk} risk
        </span>
      </div>

      {/* Confidence */}
      <div className="result-section">
        <p>
          Confidence score: <strong>{confidencePercent}%</strong>
        </p>
        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Why it misleads */}
      <div className="section-card result-section">
        <h4>⚠️ Why it misleads</h4>
        <ul>
          {result.why_it_misleads.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Missing context */}
      <div className="section-card result-section">
        <h4>🧩 Missing context</h4>
        <ul>
          {result.missing_context.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Potential impact */}
      {result.potential_impact.length > 0 && (
        <div className="section-card result-section">
          <h4>🌍 Potential impact</h4>
          <ul>
            {result.potential_impact.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Neutral rewrite */}
      <div className="section-card result-section">
        <h4>✍️ Neutral rewrite</h4>
        <p>{result.neutral_rewrite}</p>
        <button className="copy-btn" onClick={copyToClipboard}>
          Copy rewrite
        </button>
      </div>
    </div>
  );
}
