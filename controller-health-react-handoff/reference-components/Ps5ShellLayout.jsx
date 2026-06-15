import React from "react";

export function Ps5ShellLayout({ title, subtitle, topRight, children }) {
  return (
    <div className="ps5-app-bg">
      <main className="ps5-shell">
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20
          }}
        >
          <div>
            <h1 className="ps5-title">{title}</h1>
            <p className="ps5-subtitle">{subtitle}</p>
          </div>
          {topRight}
        </header>
        {children}
      </main>
    </div>
  );
}

