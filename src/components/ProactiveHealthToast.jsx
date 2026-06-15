import { useEffect, useRef } from "react";

export function ProactiveHealthToast({
  visible,
  subtitle,
  controllerImage,
  focusedAction = "viewOptions",
  onViewDetails,
  onLater,
  onIgnore
}) {
  const viewOptionsRef = useRef(null);
  const laterRef = useRef(null);
  const ignoreRef = useRef(null);

  // Move browser focus to the correct button whenever the focused action changes
  useEffect(() => {
    if (!visible) return;
    const refMap = { viewOptions: viewOptionsRef, later: laterRef, ignore: ignoreRef };
    refMap[focusedAction]?.current?.focus();
  }, [visible, focusedAction]);

  if (!visible) return null;

  return (
    <section className="ps5-toast ps5-card" aria-live="polite" aria-label="Controller health notification">
      {/* Accent bar along the top */}
      <div className="ps5-toast-accent-bar" aria-hidden="true" />

      <div className="ps5-toast-body">
        {/* ── Left column: text content ── */}
        <div className="ps5-toast-text-col">
          <div className="ps5-toast-head">
            <div className="ps5-toast-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="rgba(80,180,255,0.18)" />
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  fill="rgba(120,210,255,0.95)"
                />
              </svg>
            </div>
            <p className="ps5-section-label">PROACTIVE CONSOLE MESSAGE</p>
          </div>

          <h2 className="ps5-toast-title">Controller health check</h2>
          <p className="ps5-subtitle ps5-toast-message">{subtitle}</p>

          <span className="ps5-toast-chip" aria-label="Status: Eligible options ready">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="5" fill="rgba(80,220,160,0.9)" />
            </svg>
            Eligible options ready
          </span>

          <div className="ps5-action-row">
            <button
              ref={viewOptionsRef}
              type="button"
              className={`ps5-btn primary${focusedAction === "viewOptions" ? " toast-focused" : ""}`}
              onClick={onViewDetails}
            >
              View options
            </button>
            <button
              ref={laterRef}
              type="button"
              className={`ps5-btn${focusedAction === "later" ? " toast-focused" : ""}`}
              onClick={onLater}
            >
              Later
            </button>
            <button
              ref={ignoreRef}
              type="button"
              className={`ps5-btn ghost${focusedAction === "ignore" ? " toast-focused" : ""}`}
              onClick={onIgnore}
            >
              Ignore
            </button>
          </div>
        </div>

        {/* ── Right column: controller visual ── */}
        {controllerImage ? (
          <div className="ps5-toast-controller-panel" aria-hidden="true">
            <div className="toast-controller-wrap">
              {/* stick-drift image already contains the red diagnostic ring */}
              <img src={controllerImage} alt="" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
