/**
 * FIFA World Cup trophy icon.
 * Filled silhouette inspired by the iconic trophy shape.
 * Inherits color via `currentColor` — set color with Tailwind text-* class.
 */
export function WorldCupIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {/* Globe top */}
      <path d="M256 60c-44 0-80 33-80 76 0 32 19 60 47 72l-6 32c-3 16 5 28 22 28h34c17 0 25-12 22-28l-6-32c28-12 47-40 47-72 0-43-36-76-80-76zm0 36c25 0 44 18 44 40s-19 40-44 40-44-18-44-40 19-40 44-40z" />
      {/* Handles / cup body */}
      <path d="M150 92c-22 0-38 16-38 38 0 60 30 132 86 168l-10 52c-2 12 6 22 18 22h100c12 0 20-10 18-22l-10-52c56-36 86-108 86-168 0-22-16-38-38-38h-30v36h26c4 0 6 2 6 6 0 46-22 102-60 132-8 6-10 16-8 26l8 40h-80l8-40c2-10 0-20-8-26-38-30-60-86-60-132 0-4 2-6 6-6h26V92h-30z" />
      {/* Base */}
      <rect x="156" y="392" width="200" height="36" rx="6" />
      <rect x="140" y="432" width="232" height="28" rx="4" />
    </svg>
  );
}
