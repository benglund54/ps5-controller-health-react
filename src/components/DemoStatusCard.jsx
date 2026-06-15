/**
 * DemoStatusCard
 *
 * Reusable visual states for async data loading, errors, and demo fallbacks.
 * Currently rendered in demo/mock form only — not wired to a real backend.
 *
 * Usage:
 *   <DemoStatusCard variant="loading" />
 *   <DemoStatusCard variant="error" message="Something went wrong." onRetry={...} />
 *   <DemoStatusCard variant="fallback" onContinue={...} />
 *   <DemoStatusCard variant="unavailable" />
 */

const icons = {
  loading: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="rgba(140,200,255,0.3)" strokeWidth="2" />
      <path
        d="M14 2 A12 12 0 0 1 26 14"
        stroke="rgba(120,190,255,0.9)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transformOrigin: "14px 14px", animation: "spin 1s linear infinite" }}
      />
    </svg>
  ),
  error: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="rgba(255,120,100,0.5)" strokeWidth="1.5" />
      <path d="M14 9v6M14 18v1" stroke="rgba(255,160,140,0.95)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  fallback: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="rgba(255,200,80,0.5)" strokeWidth="1.5" />
      <path d="M14 9v6M14 18v1" stroke="rgba(255,210,120,0.95)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  unavailable: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="rgba(160,180,210,0.4)" strokeWidth="1.5" />
      <path d="M9 14h10" stroke="rgba(180,205,240,0.8)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
};

const defaults = {
  loading:     { label: "Loading recommendation",       body: "Retrieving your controller health data…" },
  error:       { label: "Recommendation unavailable",   body: "We could not load your controller health data." },
  fallback:    { label: "Using demo fallback",           body: "Live data is not available. Showing demo data." },
  unavailable: { label: "Recommendation unavailable",   body: "No recommendation is available at this time." }
};

export function DemoStatusCard({ variant = "loading", message, onRetry, onContinue, onClose }) {
  const meta = defaults[variant] ?? defaults.unavailable;

  return (
    <div className="demo-status-card" data-variant={variant}>
      <div className="demo-status-icon" aria-hidden="true">
        {icons[variant] ?? icons.unavailable}
      </div>
      <div className="demo-status-copy">
        <p className="demo-status-label">{meta.label}</p>
        <p className="demo-status-body">{message ?? meta.body}</p>
        {variant === "fallback" ? (
          <p className="demo-status-note">Demo mode · No real data used</p>
        ) : null}
      </div>
      <div className="demo-status-actions">
        {onRetry ? (
          <button type="button" className="ps5-pill-button subtle" onClick={onRetry}>
            Retry
          </button>
        ) : null}
        {onContinue ? (
          <button type="button" className="ps5-pill-button primary" onClick={onContinue}>
            Continue with demo data
          </button>
        ) : null}
        {onClose ? (
          <button type="button" className="ps5-pill-button ghost" onClick={onClose}>
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
