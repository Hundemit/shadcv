/** Vector decoration avoids a symbol-font fallback in printed PDFs. */
export function LinkArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className="inline size-[0.8em] align-baseline"
    >
      <path d="M4 12 12 4M4 4h8v8" />
    </svg>
  );
}
