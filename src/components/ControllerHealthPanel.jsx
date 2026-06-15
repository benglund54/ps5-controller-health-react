// Circular SVG health ring — amber arc for issue-detected state
function HealthRing() {
  // Use conic-gradient trick via CSS classes for the ring
  return (
    <div className="health-ring-outer" aria-hidden="true">
      <div className="health-ring-inner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* Simplified gamepad silhouette */}
          <rect x="2" y="7" width="20" height="12" rx="4" fill="none" stroke="rgba(200,225,255,0.7)" strokeWidth="1.2" />
          <rect x="5" y="11" width="1.6" height="4" rx="0.5" fill="rgba(200,225,255,0.7)" />
          <rect x="3.8" y="12.2" width="4" height="1.6" rx="0.5" fill="rgba(200,225,255,0.7)" />
          <circle cx="16.5" cy="11.5" r="0.9" fill="rgba(200,225,255,0.7)" />
          <circle cx="18.5" cy="13" r="0.9" fill="rgba(200,225,255,0.7)" />
          <circle cx="14.5" cy="13" r="0.9" fill="rgba(200,225,255,0.7)" />
          <circle cx="16.5" cy="14.5" r="0.9" fill="rgba(200,225,255,0.7)" />
          {/* thumbsticks */}
          <circle cx="8.5" cy="14.5" r="1.4" fill="none" stroke="rgba(200,225,255,0.5)" strokeWidth="0.8" />
          <circle cx="13.5" cy="14.5" r="1.4" fill="none" stroke="rgba(200,225,255,0.5)" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  );
}

export function ControllerHealthPanel({ persona, focused = false, onOpenDetails, onLater }) {
  return (
    <section className={`ps5-health-widget glass widget-card ${focused ? "focused" : ""}`}>
      <div className="widget-inner health-widget-inner">
        <HealthRing />
        <div className="health-widget-content">
          <p className="widget-eyebrow health-eyebrow">{persona.controllerModel}</p>
          <h3 className="health-widget-title">Controller health check</h3>
          <p className="health-widget-sub">{persona.issueTitle}</p>
          <p className="health-widget-note">{persona.customerFacingMessage}</p>
          <div className="widget-actions">
            <button type="button" className="widget-btn widget-btn-primary" onClick={onOpenDetails}>
              View details
            </button>
            <button type="button" className="widget-btn" onClick={onLater}>
              Later
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
