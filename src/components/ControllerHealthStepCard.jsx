import { useEffect, useRef, useState } from "react";
import { ControllerOptionCard } from "./ControllerOptionCard";
import { ControllerConfirmationView } from "./ControllerConfirmationView";
import { DeliveryMap } from "./DeliveryMap";
import ps5ControllerImage from "../../assets/ps5-controller.png";
import stickDriftImage from "../../assets/ps5-controller-stick-drift.png";
import dualsenseEdgeImage from "../../assets/dualsense-edge.png";
import limitedAstroImage from "../../assets/dualsense-limited-astro-bot.png";

const confirmationStepIds = new Set(["confirmation", "done", "email_preview", "monitoring_summary", "update_complete"]);

function inferVariant(step) {
  if (step.variant) return step.variant;
  if (step.id === "review_issue") return "issue";
  if (step.id === "replacement_option" || step.id === "recommended_options" || step.id === "module_option") return "option";
  if (step.id === "confirm_controller" || step.id === "confirm_model") return "confirm";
  if (step.id === "confirm_address") return "address";
  if (step.id === "submit_review" || step.id === "review_offer" || step.id === "confirm_path") return "submit";
  if (step.id === "compare_options") return "compare";
  if (step.id === "firmware_guidance") return "firmware";
  if (step.id === "update_progress") return "update_progress";
  if (step.id === "monitoring_summary") return "monitoring";
  return "default";
}

const basePrices = { dualsense: 69.99, limited: 139.99, edge: 169.99 };

function getPricingDetails(optionId, personaId) {
  const base = basePrices[optionId];
  if (personaId === "PLAYER001") {
    if (optionId === "dualsense") {
      return { basePrice: base, finalPrice: 0, priceNote: "Included replacement", deltaPrice: null };
    }
    const difference = base - basePrices.dualsense;
    return { basePrice: base, finalPrice: difference, priceNote: "Upgrade price", deltaPrice: null };
  }
  if (personaId === "PLAYER002") {
    const promoMap = { dualsense: 49.99, limited: 109.99, edge: 129.99 };
    return { basePrice: base, finalPrice: promoMap[optionId], priceNote: "Promotional price", deltaPrice: null };
  }
  return { basePrice: base, finalPrice: base, priceNote: "Full price", deltaPrice: null };
}

function getOptionImageSrc(optionId) {
  if (optionId === "edge") return dualsenseEdgeImage;
  if (optionId === "limited") return limitedAstroImage;
  return ps5ControllerImage;
}

function getOptionLabels(optionId) {
  const map = {
    dualsense: { label: "DualSense Wireless Controller", chip: "Discounted replacement" },
    edge:      { label: "DualSense Edge Wireless Controller", chip: "Recommended premium upgrade" },
    limited:   { label: "Limited Edition Controller", chip: "Personalized option" }
  };
  return map[optionId] ?? map.dualsense;
}

// ─── Payment method selector ──────────────────────────────────────────────────
function PaymentSelector({ selectedPaymentId, onSelectPayment }) {
  const options = [
    { id: "wallet", label: "PSN Wallet", sub: "" },
    { id: "card",   label: "Credit card ending in 4242", sub: "" }
  ];
  return (
    <div className="payment-option-list">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`payment-option-card ${selectedPaymentId === opt.id ? "selected" : ""}`}
          onClick={() => onSelectPayment(opt.id)}
        >
          <span className="payment-radio" aria-hidden="true">
            {selectedPaymentId === opt.id ? (
              <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6.5" stroke="rgba(120,190,255,0.9)" strokeWidth="1" fill="none" /><circle cx="7" cy="7" r="3.5" fill="rgba(100,180,255,0.9)" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6.5" stroke="rgba(140,170,210,0.5)" strokeWidth="1" fill="none" /></svg>
            )}
          </span>
          <div className="payment-option-text">
            <p className="payment-option-label">{opt.label}</p>
            <p className="payment-option-sub">{opt.sub}</p>
          </div>
        </button>
      ))}
      <button type="button" className="payment-option-card add-payment" onClick={() => {}}>
        <span className="payment-add-icon" aria-hidden="true">＋</span>
        <div className="payment-option-text">
          <p className="payment-option-label">Add payment method</p>
          <p className="payment-option-sub"></p>
        </div>
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SARAH SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function SarahIssueAndOptions({ selectedOptionId, onSelectOption }) {
  const options = [
    { id: "dualsense", title: "DualSense Wireless Controller",      description: "Included replacement · No payment needed",        chip: "Recommended" },
    { id: "edge",      title: "DualSense Edge Wireless Controller", description: "Premium upgrade · Replaceable stick modules",     chip: "Premium upgrade" },
    { id: "limited",   title: "Limited Edition Controller",          description: "Personalized style option · Availability varies", chip: "Limited edition" }
  ];
  return (
    <section className="ps5-controller-step-card step-issue-and-options">
      <div className="issue-options-top">
        <div className="issue-detect-text">
          <p className="step-badge">Detected issue</p>
          <p className="issue-detect-body">Signs of right stick drift were detected.</p>
          <p className="issue-detect-helper">This can affect aim and movement.</p>
        </div>
        <div className="issue-controller-wrap drift-image">
          <img src={stickDriftImage} alt="" />
        </div>
      </div>
      <div className="issue-options-bottom">
        {options.map((opt) => (
          <ControllerOptionCard
            key={opt.id}
            title={opt.title}
            description={opt.description}
            chip={opt.chip}
            selected={selectedOptionId === opt.id}
            onClick={() => onSelectOption(opt.id)}
            imageSrc={getOptionImageSrc(opt.id)}
            imageAlt={opt.title}
            {...getPricingDetails(opt.id, "PLAYER001")}
          />
        ))}
      </div>
    </section>
  );
}

function SarahConfirmDelivery({ selectedOptionId, selectedPaymentId, onSelectPayment }) {
  const selectionMap = {
    dualsense: { title: "DualSense Wireless Controller",      chip: "Included replacement",    isIncluded: true },
    edge:      { title: "DualSense Edge Wireless Controller", chip: "Premium upgrade",          isIncluded: false },
    limited:   { title: "Limited Edition Controller",          chip: "Limited edition option",   isIncluded: false }
  };
  const selection = selectionMap[selectedOptionId] ?? selectionMap.dualsense;

  return (
    <section className="ps5-controller-step-card step-confirm-delivery">
      <div className="confirm-delivery-grid">
        <div className="confirm-left-col">
          <article className="sarah-card confirm-selection-card">
            <div className="confirm-selection-inner">
              <div className="confirm-selection-img-wrap">
                <img src={getOptionImageSrc(selectedOptionId)} alt="" />
              </div>
              <div className="confirm-selection-details">
                <p className="detail-label">Selected controller</p>
                <p className="confirm-selection-title">{selection.title}</p>
                <p className={`confirm-selection-chip ${selection.isIncluded ? "chip-included" : "chip-upgrade"}`}>
                  {selection.chip}
                </p>
                <p className="detail-label" style={{ marginTop: "0.42rem" }}>Affected controller</p>
                <p className="detail-value-sm">DualSense Wireless Controller</p>
                <p className="detail-value-sm serial-inline">ZCT1W-0A1B2C3D</p>
              </div>
            </div>
          </article>
          <article className="sarah-card confirm-payment-card">
            <p className="detail-label">Payment method</p>
            {selection.isIncluded ? (
              <div className="payment-no-charge">
                <span className="payment-free-badge">No payment needed</span>
                <p className="payment-free-note">Included replacement · No real payment processed</p>
              </div>
            ) : (
              <>
                <PaymentSelector selectedPaymentId={selectedPaymentId} onSelectPayment={onSelectPayment} />
              </>
            )}
          </article>
        </div>
        <div className="confirm-right-col">
          <article className="sarah-card confirm-address-card">
            <p className="detail-label">Shipping to</p>
            <p className="detail-value-sm bold">Sarah Jeffries</p>
            <p className="detail-value-sm">1234 PlayStation Way</p>
            <p className="detail-value-sm">San Mateo, CA 94402</p>
            <p className="detail-value-sm">United States</p>
          </article>
          <DeliveryMap />
        </div>
      </div>
    </section>
  );
}

function SarahDone({ selectedOptionId }) {
  const isIncluded = selectedOptionId === "dualsense";
  return (
    <section className="ps5-controller-step-card step-done">
      <article className="sarah-card done-success-card">
        <div className="done-checkmark" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="rgba(80,200,130,0.6)" strokeWidth="1.4" />
            <path d="M11 18.5l5 5 9-10" stroke="rgba(100,220,150,0.95)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="done-success-copy">
          <h4>{isIncluded ? "Replacement confirmed" : "Checkout confirmed"}</h4>
          <p>{isIncluded ? "No payment needed." : "Your selection has been confirmed."}</p>
        </div>
      </article>
      <div className="done-grid">
        <article className="sarah-card done-email-card">
          <p className="detail-label">Email preview</p>
          <p className="done-email-from">From: PlayStation</p>
          <p className="done-email-to">To: Sarah Jeffries</p>
          <p className="done-email-subject">Your controller replacement details</p>
          <p className="done-email-body">
            Your controller replacement details are ready. You can return here to view status updates.
          </p>
        </article>
        <article className="sarah-card done-tracking-card">
          <p className="detail-label">Tracking preview</p>
          <p className="done-tracking-window">2–3 business days</p>
          <p className="done-tracking-note">Estimated delivery window</p>
          <p className="done-tracking-sub">Tracking will appear here when available</p>
        </article>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MARCUS SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function MarcusIssue() {
  return (
    <section className="ps5-controller-step-card step-marcus-issue">
      <article className="sarah-card issue-card marcus-issue-card">
        <div className="issue-copy">
          <p className="step-badge">Detected issue</p>
          <h4>Stick drift patterns detected</h4>
          <p>This can affect aim, movement, and precision.</p>
        </div>
        <div className="issue-controller-wrap drift-image">
          <img src={stickDriftImage} alt="" />
        </div>
      </article>
      <article className="sarah-card recommendation-card marcus-recommendation-card">
        <p className="recommendation-kicker">Personalized options ready</p>
        <p>Based on your controller status and PlayStation activity, upgrade and replacement options are available for you.</p>
      </article>
    </section>
  );
}

function MarcusCompareOptions({ selectedOptionId, onSelectOption, step }) {
  const options = step.options ?? [
    { id: "edge",      title: "DualSense Edge Wireless Controller", description: "Premium controls · Replaceable stick modules",      chip: "Recommended" },
    { id: "dualsense", title: "DualSense Wireless Controller",      description: "Discounted replacement option",                     chip: "Discount option" },
    { id: "limited",   title: "Limited Edition Controller",          description: "Personalized style option · Availability varies",   chip: "Limited edition" }
  ];
  return (
    <section className="ps5-controller-step-card step-marcus-options">
      <div className="sarah-option-grid">
        {options.map((option) => (
          <ControllerOptionCard
            key={option.id}
            title={option.title}
            description={option.description}
            chip={option.chip}
            selected={option.id === selectedOptionId}
            onClick={() => onSelectOption?.(option.id)}
            imageSrc={getOptionImageSrc(option.id)}
            imageAlt={option.title}
            {...getPricingDetails(option.id, "PLAYER002")}
          />
        ))}
      </div>
    </section>
  );
}

function MarcusDemoCheckout({ selectedOptionId, selectedPaymentId, onSelectPayment }) {
  const { label, chip } = getOptionLabels(selectedOptionId ?? "edge");
  const pricing = getPricingDetails(selectedOptionId ?? "edge", "PLAYER002");

  return (
    <section className="ps5-controller-step-card step-marcus-checkout">
      <div className="marcus-checkout-grid">
        {/* Selected controller */}
        <article className="sarah-card marcus-selected-card">
          <p className="detail-label">Selected controller</p>
          <div className="marcus-selected-inner">
            <div className="marcus-selected-img-wrap">
              <img src={getOptionImageSrc(selectedOptionId ?? "edge")} alt="" />
            </div>
            <div className="marcus-selected-details">
              <p className="confirm-selection-title">{label}</p>
              <p className="confirm-selection-chip chip-upgrade">{chip}</p>
              <div className="marcus-pricing-row">
                {pricing.basePrice !== pricing.finalPrice ? (
                  <span className="price-original">${pricing.basePrice.toFixed(2)}</span>
                ) : null}
                <span className="price-final">
                  {pricing.finalPrice === 0 ? "No charge" : `$${pricing.finalPrice.toFixed(2)}`}
                </span>
                {pricing.priceNote ? (
                  <span className="price-note-inline">{pricing.priceNote}</span>
                ) : null}
              </div>
            </div>
          </div>
        </article>

        {/* Payment */}
        <article className="sarah-card marcus-payment-card">
          <p className="detail-label">Payment method</p>
          <PaymentSelector selectedPaymentId={selectedPaymentId} onSelectPayment={onSelectPayment} />
        </article>
      </div>

      {/* Shipping */}
      <article className="sarah-card marcus-shipping-card">
        <p className="detail-label">Shipping to</p>
        <p className="detail-value-sm bold">Marcus Chen</p>
        <p className="detail-value-sm">5678 Console Avenue, San Francisco, CA 94102</p>
      </article>
    </section>
  );
}

function MarcusConfirmation({ selectedOptionId }) {
  const { label } = getOptionLabels(selectedOptionId ?? "edge");
  return (
    <section className="ps5-controller-step-card step-marcus-confirmation">
      <article className="sarah-card done-success-card">
        <div className="done-checkmark" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="rgba(80,200,130,0.6)" strokeWidth="1.4" />
            <path d="M11 18.5l5 5 9-10" stroke="rgba(100,220,150,0.95)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="done-success-copy">
          <h4>Checkout confirmed</h4>
          <p className="done-selected-name">{label}</p>
          <p>Your selection has been confirmed.</p>
        </div>
      </article>
      <div className="done-grid">
        <article className="sarah-card done-email-card">
          <p className="detail-label">Email preview</p>
          <p className="done-email-from">From: PlayStation</p>
          <p className="done-email-to">To: Marcus Chen</p>
          <p className="done-email-subject">Your controller upgrade details</p>
          <p className="done-email-body">
            Your controller upgrade options have been confirmed.
          </p>
        </article>
        <article className="sarah-card done-tracking-card">
          <p className="detail-label">Tracking preview</p>
          <p className="done-tracking-window">3–5 business days</p>
          <p className="done-tracking-note">Estimated delivery window</p>
          <p className="done-tracking-sub">Tracking will appear here when available</p>
        </article>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NINA SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function NinaIssue() {
  return (
    <section className="ps5-controller-step-card step-nina-issue">
      <article className="sarah-card nina-issue-card">
        <div className="issue-copy">
          <p className="step-badge nina-badge">Connection issue</p>
          <h4>Disconnects above expected levels</h4>
          <p>Recent sessions show disconnect frequency above expected levels.</p>
          <p className="issue-detect-helper">A firmware update is the recommended first step.</p>
        </div>
        <div className="nina-controller-wrap">
          <img src={ps5ControllerImage} alt="" />
          <span className="nina-disconnect-ring" aria-hidden="true" />
        </div>
      </article>
      <article className="sarah-card nina-no-replace-card">
        <p className="recommendation-kicker nina-kicker">No replacement recommended yet</p>
        <p>Let's try a firmware update first. This often resolves connection issues.</p>
      </article>
    </section>
  );
}

function NinaFirmwareGuidance() {
  return (
    <section className="ps5-controller-step-card step-nina-firmware">
      <article className="sarah-card nina-firmware-card">
        <div className="nina-firmware-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="rgba(100,180,255,0.35)" strokeWidth="1.5" />
            <path d="M20 12v8l5 3" stroke="rgba(120,190,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="nina-firmware-copy">
          <p className="step-badge nina-badge">Update available</p>
          <h4>Firmware update recommended</h4>
          <p>A firmware update is available for your controller. This update may resolve the disconnect issues.</p>
        </div>
      </article>
      <article className="sarah-card nina-firmware-steps-card">
        <p className="detail-label">Before you start</p>
        <div className="nina-prereq-list">
          <div className="nina-prereq-item">
            <span className="nina-prereq-icon" aria-hidden="true">①</span>
            <p>Keep your controller connected via USB cable during the update.</p>
          </div>
          <div className="nina-prereq-item">
            <span className="nina-prereq-icon" aria-hidden="true">②</span>
            <p>Ensure your PS5 is connected to the internet.</p>
          </div>
          <div className="nina-prereq-item">
            <span className="nina-prereq-icon" aria-hidden="true">③</span>
            <p>Do not power off the console during the update.</p>
          </div>
        </div>
      </article>
    </section>
  );
}

const UPDATE_PHASES = [
  { label: "Preparing update",       pct: 20 },
  { label: "Downloading firmware",   pct: 45 },
  { label: "Installing firmware",    pct: 75 },
  { label: "Verifying connection",   pct: 92 },
  { label: "Update complete",        pct: 100 }
];

function NinaUpdateProgress() {
  const [phase, setPhase] = useState(0);
  const intervalRef = useRef(null);

  // Reset to phase 0 and start the animation interval on mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase(0);
    intervalRef.current = setInterval(() => {
      setPhase((prev) => {
        if (prev >= UPDATE_PHASES.length - 1) {
          clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(intervalRef.current);
  }, []);

  const current = UPDATE_PHASES[phase];
  const isDone = phase >= UPDATE_PHASES.length - 1;

  return (
    <section className="ps5-controller-step-card step-nina-progress">
      <article className="sarah-card nina-progress-card">
        <div className="nina-progress-top">
          <div className="nina-controller-wrap">
            <img src={ps5ControllerImage} alt="" />
            {isDone ? null : <span className="nina-update-pulse" aria-hidden="true" />}
          </div>
          <div className="nina-progress-copy">
            <p className="step-badge nina-badge">{isDone ? "Complete" : "In progress"}</p>
            <h4>{current.label}</h4>
            <p className="issue-detect-helper">Keep your controller connected.</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="nina-progress-bar-wrap" aria-hidden="true">
          <div className="nina-progress-bar" style={{ width: `${current.pct}%` }} />
          <span className="nina-progress-pct">{current.pct}%</span>
        </div>

        {/* Phase dots */}
        <div className="nina-phase-list" aria-hidden="true">
          {UPDATE_PHASES.map((p, i) => (
            <div key={p.label} className={`nina-phase-item ${i < phase ? "done" : i === phase ? "active" : ""}`}>
              <span className="nina-phase-dot" />
              <span className="nina-phase-label">{p.label}</span>
            </div>
          ))}
        </div>
      </article>
      <p className="payment-disclaimer nina-disclaimer">Keep your controller connected during the update.</p>
    </section>
  );
}

function NinaMonitoringSummary() {
  return (
    <section className="ps5-controller-step-card step-nina-done">
      <article className="sarah-card done-success-card nina-done-card">
        <div className="done-checkmark nina-checkmark" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="rgba(80,200,130,0.6)" strokeWidth="1.4" />
            <path d="M11 18.5l5 5 9-10" stroke="rgba(100,220,150,0.95)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="done-success-copy">
          <h4>Update complete</h4>
          <p>Your controller firmware is now up to date.</p>
          <p className="done-demo-note">No replacement recommended at this time</p>
        </div>
      </article>
      <article className="sarah-card nina-monitoring-card">
        <p className="detail-label">Controller monitoring</p>
        <div className="nina-monitoring-row">
          <span className="nina-monitoring-dot active" aria-hidden="true" />
          <p>Monitoring active · Disconnect frequency tracking enabled</p>
        </div>
        <div className="nina-monitoring-row">
          <span className="nina-monitoring-dot check" aria-hidden="true" />
          <p>Firmware: up to date (v3.02)</p>
        </div>
        <div className="nina-monitoring-row">
          <span className="nina-monitoring-dot check" aria-hidden="true" />
          <p>No replacement recommended at this time</p>
        </div>
        <p className="payment-disclaimer" style={{ marginTop: "0.6rem" }}>
          If disconnect issues continue, replacement options may appear here.
        </p>
      </article>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export function ControllerHealthStepCard({ step, personaId, selectedOptionId, onSelectOption, selectedPaymentId, onSelectPayment }) {
  if (!step) return null;

  const isSarah  = personaId === "PLAYER001";
  const isMarcus = personaId === "PLAYER002";
  const isNina   = personaId === "PLAYER003";
  const variant  = inferVariant(step);

  // ── Sarah ─────────────────────────────────────────────────────────────────────
  if (isSarah && step.id === "issue_and_options") {
    return <SarahIssueAndOptions selectedOptionId={selectedOptionId} onSelectOption={onSelectOption} />;
  }
  if (isSarah && step.id === "confirm_delivery") {
    return (
      <SarahConfirmDelivery
        selectedOptionId={selectedOptionId}
        selectedPaymentId={selectedPaymentId}
        onSelectPayment={onSelectPayment}
      />
    );
  }
  if (isSarah && step.id === "done") {
    return <SarahDone selectedOptionId={selectedOptionId} />;
  }

  // ── Marcus ────────────────────────────────────────────────────────────────────
  if (isMarcus && step.id === "review_issue") {
    return <MarcusIssue />;
  }
  if (isMarcus && step.id === "compare_options") {
    return (
      <MarcusCompareOptions
        selectedOptionId={selectedOptionId}
        onSelectOption={onSelectOption}
        step={step}
      />
    );
  }
  if (isMarcus && step.id === "confirm_path") {
    return (
      <MarcusDemoCheckout
        selectedOptionId={selectedOptionId}
        selectedPaymentId={selectedPaymentId}
        onSelectPayment={onSelectPayment}
      />
    );
  }
  if (isMarcus && step.id === "confirmation") {
    return <MarcusConfirmation selectedOptionId={selectedOptionId} />;
  }

  // ── Nina ──────────────────────────────────────────────────────────────────────
  if (isNina && step.id === "review_issue") {
    return <NinaIssue />;
  }
  if (isNina && step.id === "firmware_guidance") {
    return <NinaFirmwareGuidance />;
  }
  if (isNina && step.id === "update_progress") {
    return <NinaUpdateProgress />;
  }
  if (isNina && step.id === "monitoring_summary") {
    return <NinaMonitoringSummary />;
  }

  // ── Generic fallback (PLAYER004 / Alex, unknown steps) ────────────────────────
  const showConfirmationView = confirmationStepIds.has(step.id);
  return (
    <section className={`ps5-controller-step-card variant-${variant}`}>
      {!showConfirmationView ? (
        <header className="step-header">
          {step.badge ? <p className="step-badge">{step.badge}</p> : null}
          <h4>{step.label}</h4>
        </header>
      ) : null}
      <div className="step-body">
        {showConfirmationView ? (
          <ControllerConfirmationView
            title={step.title ?? step.label}
            message={step.body}
            detail={step.helper}
            stepId={step.id}
          />
        ) : (
          <>
            <p className="step-main">{step.body}</p>
            {step.helper ? <p className="step-helper">{step.helper}</p> : null}
          </>
        )}
        {step.options?.length ? (
          <div className="step-options-grid">
            {step.options.map((option, index) => (
              <ControllerOptionCard
                key={`${step.id}-${option.title}`}
                title={option.title}
                description={option.description}
                selected={option.id ? selectedOptionId === option.id : index === 0}
                chip={option.chip}
                onClick={option.id ? () => onSelectOption?.(option.id) : undefined}
                imageSrc={option.id ? getOptionImageSrc(option.id) : undefined}
                imageAlt={option.title}
                {...(option.id ? getPricingDetails(option.id, personaId) : {})}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
