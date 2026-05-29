const MAX_CHARS = 500;

export default function ClaimInput({ value, onChange }) {
  const remaining = MAX_CHARS - value.length;

  return (
    <div>
      <textarea
        placeholder="Paste a headline, tweet, or news claim here..."
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        rows={5}
        style={{
          width: "100%",
          padding: "1rem",
          borderRadius: "14px",
          border: "1px solid #2b2f55",
          background: "#10132a",
          color: "white",
          fontSize: "1rem",
          resize: "none",
          outline: "none",
        }}
      />

      <div
        style={{
          textAlign: "right",
          fontSize: "0.8rem",
          color: remaining < 50 ? "#ffb347" : "#a0a3c4",
          marginTop: "0.3rem",
        }}
      >
        {remaining} characters remaining
      </div>
    </div>
  );
}
