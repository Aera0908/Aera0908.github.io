/**
 * AJ brand mark — ultra-bold rounded strokes, two-tone (A follows
 * currentColor, J is signal yellow). Same silhouette as public/aj-logo.svg.
 */
export function AJLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 72"
      className={className}
      role="img"
      aria-label="AJ — Aera logo"
    >
      {/* A */}
      <path
        d="M 30,58 L 30,16 L 50,16 L 70,36 L 70,58 L 58,58 L 58,44 L 42,44 L 42,58 Z M 42,32 L 42,26 L 50,26 L 56,32 Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      {/* J */}
      <path
        d="M 74,16 L 98,16 L 98,58 L 74,58 L 74,44 L 86,44 L 86,28 Z"
        fill="var(--signal)"
      />
    </svg>
  );
}
