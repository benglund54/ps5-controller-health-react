import React from "react";

export function ProactiveHealthToast({ visible, subtitle, onViewDetails, onLater }) {
  if (!visible) return null;
  return (
    <section
      className="ps5-card"
      style={{
        padding: 14,
        marginBottom: 16,
        display: "grid",
        gap: 10
      }}
    >
      <span className="status-pill">Controller Health Alert</span>
      <strong>Proactive message</strong>
      <p className="ps5-subtitle" style={{ margin: 0 }}>
        {subtitle}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="ps5-btn primary" onClick={onViewDetails}>
          View details
        </button>
        <button className="ps5-btn" onClick={onLater}>
          Later
        </button>
      </div>
    </section>
  );
}

