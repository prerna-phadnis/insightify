export default function Sidebar({ history, activeId, onSelect, onClear, stats }) {
  const fmt = (date) => {
    const now = new Date();
    const diff = (now - date) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <aside className="app-sidebar">
      {/* Session stats */}
      {stats.total > 0 && (
        <>
          <div className="sidebar-section-label">Session</div>
          <div className="stats-bar">
            <div className="stat-row">
              <span className="stat-label">Total Analyzed</span>
              <span className="stat-value amber">{stats.total}</span>
            </div>
            {stats.high > 0 && (
              <div className="stat-row">
                <span className="stat-label">High Risk</span>
                <span className="stat-value" style={{ color: "var(--red)" }}>{stats.high}</span>
              </div>
            )}
            {stats.medium > 0 && (
              <div className="stat-row">
                <span className="stat-label">Medium Risk</span>
                <span className="stat-value" style={{ color: "var(--yellow)" }}>{stats.medium}</span>
              </div>
            )}
            {stats.low > 0 && (
              <div className="stat-row">
                <span className="stat-label">Low Risk</span>
                <span className="stat-value" style={{ color: "var(--green)" }}>{stats.low}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* History */}
      <div className="sidebar-section-label" style={{ marginTop: stats.total > 0 ? "0.5rem" : 0 }}>
        History
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: 8 }}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <br />
          No analyses yet.<br />Past results appear here.
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {history.map((item) => (
              <div
                key={item.id}
                className={`history-item${item.id === activeId ? " active" : ""}`}
                onClick={() => onSelect(item)}
              >
                <div className="history-meta">
                  <span className={`history-risk ${item.result?.misinformation_risk}`}>
                    ● {item.result?.misinformation_risk || "—"} risk
                  </span>
                  <span className="history-time">{fmt(item.timestamp)}</span>
                </div>
                <div className="history-claim">{item.claim}</div>
              </div>
            ))}
          </div>
          <button className="sidebar-clear-btn" onClick={onClear}>
            Clear history
          </button>
        </>
      )}
    </aside>
  );
}