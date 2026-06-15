import React from "react";

export function QuickTestModal({ open, onClose, onComplete }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6,12,22,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 80
      }}
    >
      <section className="ps5-card" style={{ width: "min(560px, 92vw)", padding: 18 }}>
        <h3 style={{ marginTop: 0 }}>Quick controller test</h3>
        <p className="ps5-subtitle">
          Simulate stick center check, latency check, and disconnect scan.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="ps5-btn primary" onClick={onComplete}>
            Complete test
          </button>
          <button className="ps5-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}

