import { useEffect, useRef, useState } from "react";
import psStoreLogoMark from "../../assets/ps-store-logo-mark.png";
import wolverineArt from "../../assets/wolverine-wishlist-card.png";

const ORDER_NUMBER = "PS-WOLV-88421";
const PLAYER_EMAIL = "sarah.jeffries@example.com";
const PAYMENT_LABEL = "Visa ending in 4242";
const ORDER_TOTAL = "$69.99";

// Player-facing Wolverine wishlist-to-purchase flow.
// Stage "purchase" → PS Store-style pre-order panel; stage "confirmation" → native
// PlayStation confirmation screen with an optional branded email preview on top.
export function WolverinePreorderOverlay({ visible, initialStage = "purchase", onCancel, onComplete }) {
  const [stage, setStage] = useState(initialStage);
  const [emailOpen, setEmailOpen] = useState(false);

  const panelRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const doneBtnRef = useRef(null);
  const emailCloseRef = useRef(null);

  // Sync the internal stage whenever the overlay (re)opens.
  useEffect(() => {
    if (visible) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setStage(initialStage);
      setEmailOpen(false);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [visible, initialStage]);

  // Move keyboard focus to the most relevant control as the view changes.
  useEffect(() => {
    if (!visible) return undefined;
    const timeout = setTimeout(() => {
      if (emailOpen) emailCloseRef.current?.focus();
      else if (stage === "purchase") confirmBtnRef.current?.focus();
      else doneBtnRef.current?.focus();
    }, 60);
    return () => clearTimeout(timeout);
  }, [visible, stage, emailOpen]);

  // Capture-phase Escape handling so it never bubbles to the home-screen / App handlers.
  useEffect(() => {
    if (!visible) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      if (emailOpen) {
        setEmailOpen(false);
        return;
      }
      if (stage === "purchase") {
        onCancel?.();
        return;
      }
      onComplete?.();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [visible, emailOpen, stage, onCancel, onComplete]);

  if (!visible) return null;

  return (
    <div
      className="wolverine-preorder-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Marvel's Wolverine pre-order"
    >
      <button
        type="button"
        className="wolverine-modal-scrim"
        aria-label={stage === "purchase" ? "Cancel pre-order" : "Close"}
        onClick={() => (stage === "purchase" ? onCancel?.() : onComplete?.())}
        tabIndex={-1}
      />

      {stage === "purchase" ? (
        <section className="wolverine-store-panel overlay-enter" ref={panelRef}>
          <header className="wolverine-store-head">
            <span className="wolverine-store-logo-badge">
              <img className="wolverine-store-logo" src={psStoreLogoMark} alt="PlayStation Store" />
            </span>
            <button
              type="button"
              className="wolverine-close-pill"
              onClick={onCancel}
              aria-label="Cancel pre-order"
            >
              ×
            </button>
          </header>

          <div className="wolverine-store-body">
            <div className="wolverine-store-art">
              <img src={wolverineArt} alt="Marvel's Wolverine key art" />
              <span className="wolverine-store-art-chip">Pre-order</span>
            </div>

            <div className="wolverine-store-detail">
              <p className="wolverine-store-kicker">Marvel</p>
              <h2 className="wolverine-store-title">Marvel&apos;s Wolverine</h2>
              <p className="wolverine-store-edition">Digital Edition</p>

              <dl className="wolverine-store-facts">
                <div>
                  <dt>Status</dt>
                  <dd>Pre-order</dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>Available at launch</dd>
                </div>
                <div>
                  <dt>Included</dt>
                  <dd>Pre-load notification included</dd>
                </div>
                <div>
                  <dt>Payment</dt>
                  <dd>{PAYMENT_LABEL}</dd>
                </div>
              </dl>

              <div className="wolverine-store-total">
                <span>Total</span>
                <strong>{ORDER_TOTAL}</strong>
              </div>

              <div className="wolverine-store-actions">
                <button
                  type="button"
                  className="wolverine-btn primary"
                  ref={confirmBtnRef}
                  onClick={() => setStage("confirmation")}
                >
                  Confirm Pre-Order
                </button>
                <button type="button" className="wolverine-btn ghost" onClick={onCancel}>
                  Cancel
                </button>
              </div>
              <p className="wolverine-store-note">Demo checkout. No real payment was processed.</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="wolverine-confirmation-panel overlay-enter">
          <div className="wolverine-confirm-glow" aria-hidden="true">
            <span className="wolverine-confirm-check">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <h2 className="wolverine-confirm-title">Pre-order confirmed</h2>
          <p className="wolverine-confirm-body">
            Marvel&apos;s Wolverine has been added to your library.
          </p>
          <p className="wolverine-confirm-subbody">
            You&apos;ll be notified when pre-load is available.
          </p>

          <dl className="wolverine-confirm-meta">
            <div>
              <dt>Order #</dt>
              <dd>{ORDER_NUMBER}</dd>
            </div>
            <div>
              <dt>Confirmation email sent to</dt>
              <dd>{PLAYER_EMAIL}</dd>
            </div>
          </dl>

          <div className="wolverine-confirm-actions">
            <button type="button" className="wolverine-btn primary" ref={doneBtnRef} onClick={onComplete}>
              Done
            </button>
            <button
              type="button"
              className="wolverine-btn ghost"
              onClick={() => setEmailOpen(true)}
            >
              Preview Email
            </button>
          </div>
        </section>
      )}

      {emailOpen ? (
        <div
          className="wolverine-email-preview"
          role="dialog"
          aria-modal="true"
          aria-label="Pre-order confirmation email preview"
        >
          <div className="wolverine-email-preview-bar">
            <span className="wolverine-email-preview-label">Email preview</span>
            <button
              type="button"
              className="wolverine-email-close"
              ref={emailCloseRef}
              onClick={() => setEmailOpen(false)}
              aria-label="Close preview"
            >
              Close Preview ×
            </button>
          </div>

          <div className="wolverine-email-scroll">
            <p className="wolverine-email-preheader">
              You&apos;re ready for launch. We&apos;ll notify you when pre-load begins.
            </p>

            <div className="wolverine-email-shell">
              <div className="wolverine-email-meta">
                <p>
                  <span>From</span> PlayStation Store &lt;no-reply@playstation-demo.com&gt;
                </p>
                <p>
                  <span>To</span> {PLAYER_EMAIL}
                </p>
                <p className="wolverine-email-subject">
                  Subject: Your Marvel&apos;s Wolverine pre-order is confirmed
                </p>
              </div>

              <header className="wolverine-email-header">
                <span className="wolverine-store-logo-badge">
                  <img className="wolverine-store-logo" src={psStoreLogoMark} alt="PlayStation Store" />
                </span>
              </header>

              <section
                className="wolverine-email-hero"
                style={{ backgroundImage: `url(${wolverineArt})` }}
              >
                <div className="wolverine-email-hero-veil" aria-hidden="true" />
                <div className="wolverine-email-hero-claws" aria-hidden="true" />
                <div className="wolverine-email-hero-copy">
                  <p className="wolverine-email-hero-kicker">Marvel&apos;s Wolverine</p>
                  <h1>Your pre-order is confirmed</h1>
                  <p className="wolverine-email-hero-sub">You&apos;re ready for launch.</p>
                </div>
              </section>

              <section className="wolverine-email-body">
                <p className="wolverine-email-greeting">Hi Sarah,</p>
                <p>
                  Your Marvel&apos;s Wolverine pre-order is confirmed. We&apos;ll notify you when
                  pre-load is available, so you can be ready to play at launch.
                </p>

                <div className="wolverine-email-order-card">
                  <p className="wolverine-email-order-title">Marvel&apos;s Wolverine — Digital Edition</p>
                  <ul>
                    <li>
                      <span>Order #</span>
                      <strong>{ORDER_NUMBER}</strong>
                    </li>
                    <li>
                      <span>Status</span>
                      <strong>Pre-order confirmed</strong>
                    </li>
                    <li>
                      <span>Delivery</span>
                      <strong>Available at launch</strong>
                    </li>
                    <li>
                      <span>Payment</span>
                      <strong>{PAYMENT_LABEL}</strong>
                    </li>
                  </ul>
                </div>

                <div className="wolverine-email-cta-row">
                  <span className="wolverine-email-cta primary">View in Library</span>
                  <span className="wolverine-email-cta ghost">Explore PlayStation Store</span>
                </div>

                <ul className="wolverine-email-benefits">
                  <li>Pre-load notification included</li>
                  <li>Launch reminder enabled</li>
                  <li>Wishlist updated</li>
                </ul>

                <p className="wolverine-email-signoff">Thanks for pre-ordering with PlayStation.</p>
              </section>

              <footer className="wolverine-email-footer">
                <p className="wolverine-email-footer-brand">PlayStation Store</p>
                <p className="wolverine-email-footer-links">
                  <span>Account Settings</span> · <span>Preference Center</span> ·{" "}
                  <span>Help</span>
                </p>
                <p className="wolverine-email-footer-legal">
                  This is a demo confirmation preview created for an internal PlayStation experience
                  demonstration. No real order, payment, or email was processed.
                </p>
              </footer>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
