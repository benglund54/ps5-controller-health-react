export function ControllerHealthDetailCard({ persona, onRequestReview, onLater }) {
  return (
    <article className="ps5-health-card ps5-card">
      <div className="ps5-health-header">
        <div>
          <p className="ps5-section-label">Controller health details</p>
          <h3>Controller health check</h3>
        </div>
        <span className="ps5-chip warn">{persona.recommendationLabel}</span>
      </div>

      <p className="ps5-subtitle">Your right stick may not be centering correctly.</p>

      <div className="ps5-health-grid">
        <div>
          <small>Player</small>
          <p>{persona.displayName}</p>
        </div>
        <div>
          <small>Controller model</small>
          <p>{persona.controllerModel}</p>
        </div>
        <div>
          <small>Controller serial</small>
          <p>{persona.serial}</p>
        </div>
        <div>
          <small>Issue type</small>
          <p>{persona.issueTypeLabel}</p>
        </div>
        <div>
          <small>Warranty status</small>
          <p>{persona.warrantyStatusLabel}</p>
        </div>
        <div>
          <small>Telemetry severity</small>
          <p>{persona.telemetrySeverityLabel}</p>
        </div>
      </div>

      <p className="ps5-message">{persona.customerFacingMessage}</p>
      <p className="ps5-legal-note">Any recommendation remains pending support review.</p>

      <div className="ps5-action-row">
        <button type="button" className="ps5-btn primary" onClick={onRequestReview}>
          Request review
        </button>
        <button type="button" className="ps5-btn" onClick={onLater}>
          Later
        </button>
      </div>
    </article>
  );
}
