const MAX_CHARS = 500;

export default function ClaimInput({ value, onChange }) {
  return (
    <textarea
      className="claim-textarea"
      placeholder='e.g. "Scientists confirm coffee causes cancer" — paste any headline, tweet, or claim…'
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
      rows={5}
      spellCheck={false}
    />
  );
}