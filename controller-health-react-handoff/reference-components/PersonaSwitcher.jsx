import React from "react";

export function PersonaSwitcher({ personas, activeId, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {personas.map((p) => {
        const active = p.ownerId === activeId;
        return (
          <button
            key={p.ownerId}
            className="ps5-btn"
            style={{
              borderColor: active ? "rgba(255,255,255,0.9)" : undefined,
              background: active ? "rgba(255,255,255,0.16)" : undefined
            }}
            onClick={() => onSelect(p.ownerId)}
          >
            {p.ownerId} · {p.displayName}
          </button>
        );
      })}
    </div>
  );
}

