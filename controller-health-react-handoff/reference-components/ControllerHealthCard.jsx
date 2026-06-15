import React from "react";

export function ControllerHealthCard({ response, onRunQuickTest, onRequestReview, onDismiss }) {
  if (!response) return null;
  const decision = response.decision || {};
  const ui = response.ui || {};

  return (
    <article className="ps5-card" style={{ padding: 18, display: "grid", gap: 10 }}>
      <h2 style={{ margin: 0 }}>{ui.title || "Controller health check"}</h2>
      <p className="ps5-subtitle" style={{ margin: 0 }}>
        {ui.subtitle}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(120px, 1fr))", gap: 10 }}>
        <div><small>Issue</small><div>{decision.issueType}</div></div>
        <div><small>Severity</small><div>{decision.telemetrySeverity}</div></div>
        <div><small>Confidence</small><div>{decision.issueConfidence}</div></div>
      </div>
      <p style={{ margin: 0 }}>
        {decision.customerFacingMessage}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="ps5-btn" onClick={onRunQuickTest}>Run quick test</button>
        <button className="ps5-btn primary" onClick={onRequestReview}>Request review</button>
        <button className="ps5-btn" onClick={onDismiss}>Later</button>
      </div>
    </article>
  );
}

