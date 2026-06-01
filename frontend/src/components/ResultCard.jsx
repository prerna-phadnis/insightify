import { useState, useEffect, useMemo } from "react";

// Derive bias tags from analysis data
function deriveBiasTags(result) {
  const tags = [];
  const riskText = (
    (result.why_it_misleads || []).join(" ") +
    " " +
    (result.missing_context || []).join(" ")
  ).toLowerCase();

  if (/omit|missing|left out|not mention|ignore|absent|withhold/.test(riskText))
    tags.push({ icon: "◌", label: "Omission Bias" });
  if (/fram|spin|portray|slant|angle|perspective|characteriz/.test(riskText))
    tags.push({ icon: "◫", label: "Framing Bias" });
  if (/selec|cherry|partial|only|subset|sample/.test(riskText))
    tags.push({ icon: "◈", label: "Selection Bias" });
  if (/emot|fear|outrage|scare|alarm|panic|sensati/.test(riskText))
    tags.push({ icon: "◉", label: "Emotional Framing" });
  if (/context|without|background|broader|histor/.test(riskText))
    tags.push({ icon: "◎", label: "Context Stripping" });
  if (/correlat|cause|lead|result|link|associat/.test(riskText))
    tags.push({ icon: "◌", label: "Causation Confusion" });
  if (/statistic|number|data|percent|figure|rate/.test(riskText))
    tags.push({ icon: "◫", label: "Statistical Mislead" });

  return tags.slice(0, 5);
}

// Suggest fact-check sources based on claim type
function getSuggestedSources(claimType) {
  const base = [
    { name: "Snopes", url: "https://snopes.com" },
    { name: "FactCheck.org", url: "https://factcheck.org" },
    { name: "PolitiFact", url: "https://politifact.com" },
  ];
  const ct = (claimType || "").toLowerCase();
  if (/health|medical|vaccine|drug|cancer/.test(ct))
    return [{ name: "HealthNewsReview", url: "https://healthnewsreview.org" }, ...base.slice(0,2)];
  if (/politi|election|vote|govern|law/.test(ct))
    return [base[2], base[1], { name: "Reuters Fact Check", url: "https://reuters.com/fact-check" }];
  if (/climate|environment|science/.test(ct))
    return [{ name: "Climate Feedback", url: "https://climatefeedback.org" }, ...base.slice(0,2)];
  return base;
}

function AnimatedBar({ targetWidth, className }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(targetWidth), 80);
    return () => clearTimeout(t);
  }, [targetWidth]);
  return (
    <div className={`gauge-fill ${className}`} style={{ width: `${width}%` }} />
  );
}

export default function ResultCard({ result, claim }) {
  const [copied, setCopied] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);

  const confidencePct = Math.round((result.confidence_score || 0) * 100);
  const risk = result.misinformation_risk || "medium";
  const biasTags = useMemo(() => deriveBiasTags(result), [result]);
  const sources = useMemo(() => getSuggestedSources(result.claim_type), [result.claim_type]);

  // Risk gauge value: high=85, medium=52, low=22
  const riskPct = risk === "high" ? 85 : risk === "medium" ? 52 : 22;

  const copyRewrite = async () => {
    await navigator.clipboard.writeText(result.neutral_rewrite || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportReport = async () => {
    const lines = [
      `INSIGHTIFY ANALYSIS REPORT`,
      `Generated: ${new Date().toLocaleString()}`,
      ``,
      `CLAIM`,
      claim,
      ``,
      `CLAIM TYPE: ${result.claim_type || "—"}`,
      `RISK LEVEL: ${risk.toUpperCase()}`,
      `CONFIDENCE: ${confidencePct}%`,
      ``,
      `WHY IT MISLEADS`,
      ...(result.why_it_misleads || []).map(i => `  - ${i}`),
      ``,
      `MISSING CONTEXT`,
      ...(result.missing_context || []).map(i => `  - ${i}`),
      ``,
      `POTENTIAL IMPACT`,
      ...(result.potential_impact || []).map(i => `  - ${i}`),
      ``,
      `NEUTRAL REWRITE`,
      result.neutral_rewrite || "—",
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2500);
  };

  return (
    <div className="result-card">
      {/* Header */}
      <div className="result-header">
        <div className="result-meta">
          <div className="result-claim-type">
            {result.claim_type || "Claim Analysis"}
          </div>
          <div className="result-title">Analysis Report</div>
        </div>
        <div className="risk-badge">
          <div className={`risk-pill ${risk}`}>
            <div className="risk-pill-dot" />
            {risk} risk
          </div>
        </div>
      </div>

      {/* Gauges */}
      <div className="gauge-wrap">
        <div className="gauge-section">
          <div className="gauge-label">Misinformation Risk</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="gauge-track" style={{ flex: 1 }}>
              <AnimatedBar targetWidth={riskPct} className={risk} />
            </div>
            <div className="gauge-value">{riskPct}<span>%</span></div>
          </div>
        </div>

        <div className="confidence-section">
          <div className="gauge-label">Model Confidence</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="confidence-bar-track" style={{ flex: 1 }}>
              <AnimatedBar targetWidth={confidencePct} className="__conf" />
            </div>
            <div className="gauge-value">{confidencePct}<span>%</span></div>
          </div>
          <style>{`.gauge-fill.__conf { background: linear-gradient(90deg, var(--blue) 0%, #a78bfa 100%); }`}</style>
        </div>
      </div>

      {/* Bias tags */}
      {biasTags.length > 0 && (
        <div className="bias-row">
          <div className="bias-section-label">Detected Bias Patterns</div>
          {biasTags.map((tag) => (
            <div key={tag.label} className="bias-tag">
              <span className="bias-tag-icon">{tag.icon}</span>
              {tag.label}
            </div>
          ))}
        </div>
      )}

      {/* Body sections */}
      <div className="result-body">
        {/* Why it misleads */}
        {result.why_it_misleads?.length > 0 && (
          <div className="result-section">
            <div className="section-header">
              <span className="section-icon">⚠</span>
              <span className="section-title">Why It Misleads</span>
            </div>
            <ul className="section-list">
              {result.why_it_misleads.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing context */}
        {result.missing_context?.length > 0 && (
          <div className="result-section">
            <div className="section-header">
              <span className="section-icon">◌</span>
              <span className="section-title">Missing Context</span>
            </div>
            <ul className="section-list">
              {result.missing_context.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Potential impact */}
        {result.potential_impact?.length > 0 && (
          <div className="result-section">
            <div className="section-header">
              <span className="section-icon">◉</span>
              <span className="section-title">Potential Impact</span>
            </div>
            <ul className="section-list">
              {result.potential_impact.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Neutral rewrite */}
        {result.neutral_rewrite && (
          <div className="result-section">
            <div className="section-header">
              <span className="section-icon">✦</span>
              <span className="section-title">Neutral Rewrite</span>
            </div>
            <div className="rewrite-box">{result.neutral_rewrite}</div>
          </div>
        )}

        {/* Suggested sources */}
        <div className="result-section">
          <div className="section-header">
            <span className="section-icon">⟁</span>
            <span className="section-title">Verify With</span>
          </div>
          <div className="sources-grid">
            {sources.map((src) => (
              <a
                key={src.name}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-chip"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 9L9 1M9 1H4M9 1V6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {src.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="result-footer">
        <button
          className={`btn-ghost${copied ? " copied" : ""}`}
          onClick={copyRewrite}
        >
          {copied ? "✓ Copied" : "Copy Rewrite"}
        </button>
        <button
          className={`btn-ghost${exportCopied ? " copied" : ""}`}
          onClick={exportReport}
        >
          {exportCopied ? "✓ Report Copied" : "Export Report"}
        </button>
      </div>
    </div>
  );
}