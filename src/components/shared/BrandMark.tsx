/** The integration-hub motif from slide 1 of the deck, reused as the product mark. */
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g stroke="#b6a5f2" strokeWidth="3" strokeDasharray="4 4">
        <line x1="32" y1="32" x2="32" y2="8" />
        <line x1="32" y1="32" x2="54" y2="44" />
        <line x1="32" y1="32" x2="10" y2="44" />
      </g>
      <circle cx="32" cy="32" r="12" fill="#6f58c9" />
      <circle cx="32" cy="8" r="5" fill="#e5a64a" />
      <circle cx="54" cy="44" r="5" fill="#e5a64a" />
      <circle cx="10" cy="44" r="5" fill="#e5a64a" />
    </svg>
  );
}
