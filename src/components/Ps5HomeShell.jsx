const primaryBackground = [
  "linear-gradient(180deg, rgba(4, 11, 27, 0.38), rgba(4, 11, 27, 0.82))",
  "url('/ps5-assets/PS5_Welcome_background-c2fb8859-4d49-4f6e-9620-7868bb34da1a.png')",
  "url('/assets/PS5_Welcome_background-c2fb8859-4d49-4f6e-9620-7868bb34da1a.png')",
  "radial-gradient(circle at 70% 12%, rgba(42, 138, 255, 0.28), rgba(7, 15, 32, 0) 45%)",
  "radial-gradient(circle at 18% 85%, rgba(105, 88, 255, 0.26), rgba(7, 15, 32, 0) 45%)",
  "linear-gradient(145deg, #071124 0%, #0a1c3e 48%, #050b1a 100%)"
].join(",");

export function Ps5HomeShell({ persona, children }) {
  return (
    <div className="ps5-app-bg" style={{ backgroundImage: primaryBackground }}>
      <main className="ps5-shell">
        <header className="ps5-topbar">
          <div className="ps5-brand">
            <span className="ps5-dot" aria-hidden="true" />
            PlayStation Home
          </div>
          <div className="ps5-top-actions">
            <span className="ps5-chip">Console online</span>
            <span className="ps5-chip muted">{persona.controllerModel}</span>
          </div>
        </header>

        <section className="ps5-hero ps5-card">
          <div>
            <p className="ps5-eyebrow">Welcome back, {persona.greetingName}</p>
            <h1 className="ps5-title">{persona.displayName}'s Home</h1>
            <p className="ps5-subtitle">
              Controller health check is ready for review on your primary controller.
            </p>
          </div>
          <div className="ps5-profile">
            <div className="ps5-avatar" aria-hidden="true">
              {persona.greetingName[0]}
            </div>
            <div>
              <p className="ps5-profile-name">{persona.displayName}</p>
              <p className="ps5-profile-meta">
                {persona.controllerModel} · {persona.ownerId}
              </p>
            </div>
          </div>
        </section>

        <section className="ps5-tile-row" aria-label="Home content">
          <article className="ps5-tile active">
            <h2>Controller health check</h2>
            <p>Review your latest controller status.</p>
          </article>
          <article className="ps5-tile">
            <h2>Game Library</h2>
            <p>Continue your recently played titles.</p>
          </article>
          <article className="ps5-tile">
            <h2>Media</h2>
            <p>Launch streaming apps and captures.</p>
          </article>
        </section>

        <section className="ps5-content">{children}</section>
      </main>
    </div>
  );
}
