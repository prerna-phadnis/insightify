export default function AnalyzeButton({ loading, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        marginTop: "1.5rem",
        width: "100%",
        padding: "1rem",
        fontSize: "1.1rem",
        borderRadius: "14px",
        border: "none",
        cursor: loading || disabled ? "not-allowed" : "pointer",
        background: disabled
          ? "#2b2f55"
          : "linear-gradient(135deg, #7c7cff, #00ffd5)",
        color: "#0f1220",
        fontWeight: 600,
        animation: loading ? "pulse 1.5s infinite" : "none",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s ease",
      }}
    >
      {loading ? "Analyzing..." : "Analyze Misinformation Risk"}
    </button>
  );
}
