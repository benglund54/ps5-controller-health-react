import { ControllerHealthPanel } from "./ControllerHealthPanel";
import psStoreArt from "../../assets/Playstation_store-ef2939a6-5eb9-4ff4-85a0-8220484dbf06.png";
import spiderManArt from "../../assets/Spider-Man_Miles_Morales-7809d6ce-8c11-455d-b1be-a3f34d1bc0e9.png";
import plusBgArt from "../../assets/plus-last-of-us-bg.png";
import plusThumbArt from "../../assets/plus-last-of-us-thumb.png";

// ─── Trophy dots ──────────────────────────────────────────────────────────────
function TrophyDot({ type, count }) {
  return (
    <div className={`trophy-item trophy-${type}`}>
      <span className="trophy-dot" aria-hidden="true" />
      <p className="trophy-count">{count}</p>
    </div>
  );
}

// ─── Storage progress bar ─────────────────────────────────────────────────────
function StorageMeter({ usedPercent = 82 }) {
  return (
    <div className="storage-meter" aria-hidden="true">
      <div className="storage-meter-track">
        <div className="storage-meter-fill" style={{ width: `${usedPercent}%` }} />
      </div>
    </div>
  );
}

// ─── Widgets ──────────────────────────────────────────────────────────────────
export function HomeWidgets({ persona, selectedTileId, onOpenHealthPanel, onLater }) {
  const healthFocused = selectedTileId === "controller-health";

  return (
    <section className="ps5-widgets-grid">

      {/* ── Console Storage ─────────────────────────────────────────────── */}
      <article className="glass widget-card widget-storage">
        <div className="widget-inner">
          <div className="widget-storage-top">
            <p className="widget-eyebrow">
              <span className="widget-eyebrow-icon" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" stroke="rgba(180,215,255,0.7)" strokeWidth="0.8" fill="rgba(100,155,230,0.18)" />
                  <rect x="2" y="4" width="6" height="1" rx="0.4" fill="rgba(180,215,255,0.7)" />
                  <rect x="2" y="6" width="4" height="1" rx="0.4" fill="rgba(180,215,255,0.5)" />
                </svg>
              </span>
              Console Storage
            </p>
          </div>
          <p className="widget-storage-gb">23.77 GB</p>
          <p className="widget-storage-label">Free space</p>
          <StorageMeter usedPercent={82} />
        </div>
      </article>

      {/* ── PlayStation Store ────────────────────────────────────────────── */}
      <article className="glass widget-card widget-store" style={{ backgroundImage: `url(${psStoreArt})` }}>
        <div className="widget-inner widget-store-inner">
          <p className="widget-eyebrow">
            <span className="widget-eyebrow-icon" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1l1.2 2.4L9 3.8 7 5.7l.5 2.8L5 7.2 2.5 8.5 3 5.7 1 3.8l2.8-.4z" fill="rgba(180,215,255,0.7)" />
              </svg>
            </span>
            PlayStation Store
          </p>
          <div className="widget-promo-badge">75% OFF</div>
          <p className="widget-store-sub">This week only</p>
        </div>
      </article>

      {/* ── Trophies ─────────────────────────────────────────────────────── */}
      <article className="glass widget-card widget-trophies">
        <div className="widget-inner">
          <div className="widget-trophies-header">
            <p className="widget-eyebrow">Trophies</p>
            <p className="widget-trophy-total">Total: 5866</p>
          </div>
          <div className="widget-trophy-row">
            <TrophyDot type="platinum" count="20" />
            <TrophyDot type="gold" count="231" />
            <TrophyDot type="silver" count="902" />
            <TrophyDot type="bronze" count="4.7k" />
          </div>
        </div>
      </article>

      {/* ── Wishlist ─────────────────────────────────────────────────────── */}
      <article className="glass widget-card widget-wishlist">
        <div className="widget-inner">
          <p className="widget-eyebrow">
            <span className="widget-eyebrow-icon" aria-hidden="true" style={{ color: "rgba(255,90,110,0.9)" }}>♥</span>
            Wishlist
          </p>
          <p className="widget-wishlist-count">5 items</p>
          <img className="widget-thumb wishlist-thumb" src={spiderManArt} alt="" aria-hidden="true" />
        </div>
      </article>

      {/* ── Messages ─────────────────────────────────────────────────────── */}
      <article className="glass widget-card widget-messages">
        <div className="widget-inner">
          <p className="widget-eyebrow">
            <span className="widget-eyebrow-icon" aria-hidden="true">
              <svg width="10" height="9" viewBox="0 0 10 9" fill="none">
                <path d="M1 1h8v5.5H6L5 8l-1-1.5H1z" stroke="rgba(180,215,255,0.7)" strokeWidth="0.8" fill="rgba(100,155,230,0.15)" strokeLinejoin="round" />
              </svg>
            </span>
            Messages
          </p>
          <div className="widget-messages-body">
            <div className="messages-bubble-icon" aria-hidden="true">
              <svg width="32" height="30" viewBox="0 0 32 30" fill="none">
                <path d="M3 3h26v18H19l-3 5-3-5H3z" fill="rgba(100,150,215,0.14)" stroke="rgba(140,185,240,0.38)" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M8 10h16M8 14h10" stroke="rgba(140,185,240,0.3)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="widget-messages-text">No recent messages to show.</p>
          </div>
        </div>
      </article>

      {/* ── PlayStation Plus ──────────────────────────────────────────────── */}
      <article className="glass widget-card widget-plus" style={{ backgroundImage: `url(${plusBgArt})` }}>
        <div className="widget-inner widget-plus-inner">
          <p className="widget-eyebrow widget-plus-eyebrow">
            <span className="widget-eyebrow-icon plus-cross" aria-hidden="true">✚</span>
            New to PlayStation Plus
          </p>
          <p className="widget-plus-title">The Last of Us Part I</p>
          <img className="widget-plus-thumb" src={plusThumbArt} alt="" aria-hidden="true" />
        </div>
      </article>

      {/* ── Controller Health ─────────────────────────────────────────────── */}
      <ControllerHealthPanel
        persona={persona}
        focused={healthFocused}
        onOpenDetails={onOpenHealthPanel}
        onLater={onLater}
      />

    </section>
  );
}
