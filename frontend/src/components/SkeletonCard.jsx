export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div className="skeleton-row" style={{ width: "40%", height: "10px" }} />
          <div className="skeleton-row" style={{ width: "70%", height: "18px" }} />
        </div>
        <div className="skeleton-row" style={{ width: 80, height: 26, borderRadius: "999px" }} />
      </div>

      <div style={{ height: 1, background: "var(--border-soft)", margin: "0.25rem 0" }} />

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {[90, 110, 75].map((w, i) => (
          <div key={i} className="skeleton-row" style={{ width: w, height: 22, borderRadius: "4px" }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div className="skeleton-row" style={{ width: "55%", height: "10px" }} />
        <div className="skeleton-row" style={{ height: "10px" }} />
        <div className="skeleton-row" style={{ width: "85%", height: "10px" }} />
        <div className="skeleton-row" style={{ width: "90%", height: "10px" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div className="skeleton-row" style={{ width: "45%", height: "10px" }} />
        <div className="skeleton-row" style={{ width: "80%", height: "10px" }} />
        <div className="skeleton-row" style={{ height: "10px" }} />
      </div>

      <div className="skeleton-row" style={{ height: 58, borderRadius: "8px" }} />
    </div>
  );
}