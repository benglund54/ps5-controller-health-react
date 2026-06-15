import { useEffect, useMemo, useRef, useState } from "react";
import { ControllerHealthStepCard } from "./ControllerHealthStepCard";
import { getControllerHealthJourney } from "../data/controllerHealthJourneys";

export function ControllerHealthOverlay({ persona, visible, onClose, onLater }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState("dualsense");
  const [selectedPaymentId, setSelectedPaymentId] = useState("wallet");

  const overlayRef = useRef(null);
  const primaryBtnRef = useRef(null);

  const journey = useMemo(() => getControllerHealthJourney(persona.ownerId), [persona.ownerId]);
  const steps = journey.overlay.steps;
  const currentStep = steps[stepIndex];
  const atFirstStep = stepIndex <= 0;
  const atLastStep = stepIndex >= steps.length - 1;
  const progressPercent = steps.length > 1 ? (stepIndex / (steps.length - 1)) * 100 : 100;
  const statusChip = journey.overlay.statusChip;
  const isFinalStep = stepIndex === steps.length - 1;
  const isSarah = persona.ownerId === "PLAYER001";

  const getStepTitle = () => {
    if (isSarah && currentStep.id === "done") {
      return selectedOptionId === "dualsense" ? "Replacement confirmed" : "Checkout confirmed";
    }
    return currentStep.title ?? currentStep.label ?? journey.overlay.title;
  };

  const getStepSubtitle = () => currentStep.subtitle ?? journey.overlay.subtitle;

  const goBack = () => setStepIndex((p) => Math.max(p - 1, 0));
  const goForward = () => setStepIndex((p) => Math.min(p + 1, steps.length - 1));

  // Reset step/selection state when the overlay opens or the persona changes.
  useEffect(() => {
    if (visible) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setStepIndex(0);
      // Marcus defaults to Edge (recommended); Sarah/others default to dualsense
      setSelectedOptionId(persona.ownerId === "PLAYER002" ? "edge" : "dualsense");
      setSelectedPaymentId("wallet");
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [visible, persona.ownerId]);

  // Auto-focus the primary button when the step changes
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => primaryBtnRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [visible, stepIndex]);

  // Keyboard navigation:
  // - Escape           → close overlay
  // - ArrowLeft/Right/Up/Down → move focus among overlay focusable elements
  // - Enter            → click the currently focused element
  // Arrow keys do NOT advance the step — only clicking/Enter on a button does.
  useEffect(() => {
    if (!visible) return undefined;

    const onKeyDown = (event) => {
      const key = event.key;
      const navKeys = ["Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (!navKeys.includes(key)) return;

      // Always stop propagation when overlay is open to protect home-screen nav
      event.preventDefault();
      event.stopPropagation();

      if (key === "Escape") {
        onClose?.();
        return;
      }

      if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown") {
        const el = overlayRef.current;
        if (!el) return;

        // Collect all focusable elements inside the overlay
        const focusable = Array.from(
          el.querySelectorAll(
            'button:not([disabled]), [tabindex="0"]:not([tabindex="-1"]):not([disabled])'
          )
        );
        if (focusable.length === 0) return;

        const current = focusable.indexOf(document.activeElement);
        const forward = key === "ArrowRight" || key === "ArrowDown";

        const next =
          current === -1
            ? forward ? 0 : focusable.length - 1
            : forward
              ? (current + 1) % focusable.length
              : (current - 1 + focusable.length) % focusable.length;

        focusable[next]?.focus();
        return;
      }

      if (key === "Enter") {
        const focused = document.activeElement;
        if (focused && overlayRef.current?.contains(focused)) {
          focused.click();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [visible, onClose]);

  const getPrimaryLabel = () => {
    if (atLastStep) return "Done";
    // Sarah
    if (isSarah && currentStep?.id === "issue_and_options") return "Continue";
    if (isSarah && currentStep?.id === "confirm_delivery") {
      return selectedOptionId === "dualsense" ? "Confirm replacement" : "Confirm checkout";
    }
    // Marcus
    if (persona.ownerId === "PLAYER002" && currentStep?.id === "review_issue") return "See options";
    if (persona.ownerId === "PLAYER002" && currentStep?.id === "compare_options") return "Continue to checkout";
    if (persona.ownerId === "PLAYER002" && currentStep?.id === "confirm_path") return "Confirm checkout";
    // Nina
    if (persona.ownerId === "PLAYER003" && currentStep?.id === "review_issue") return "See firmware update";
    if (persona.ownerId === "PLAYER003" && currentStep?.id === "firmware_guidance") return "Start update";
    if (persona.ownerId === "PLAYER003" && currentStep?.id === "update_progress") return "Continue";
    return "Next";
  };

  if (!visible) return null;

  return (
    <div className="ps5-controller-overlay-shell" role="dialog" aria-modal="false" aria-label="Controller health details">
      <aside className="ps5-controller-overlay overlay-enter" ref={overlayRef}>
        <header className="overlay-header">
          <div className="overlay-step-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="rgba(180,215,255,0.9)" />
            </svg>
          </div>
          <div className="overlay-header-copy">
            <p className="overlay-kicker">CONTROLLER HEALTH</p>
            <p className="overlay-step-counter">{stepIndex + 1} OF {steps.length}</p>
            <h3>{getStepTitle()}</h3>
            <p className="overlay-subtitle">{getStepSubtitle()}</p>
            {statusChip ? <p className="overlay-status-chip">{statusChip}</p> : null}
          </div>
          <button type="button" className="overlay-close-pill" onClick={onClose} aria-label="Close overlay">
            ×
          </button>
        </header>

        <section className="overlay-progress">
          <p className="overlay-progress-label">Step {stepIndex + 1} of {steps.length}</p>
          <div className="progress-rail" aria-hidden="true">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-dots" aria-hidden="true">
            {steps.map((step, index) => (
              <span key={step.id} className={index === stepIndex ? "active" : ""} />
            ))}
          </div>
        </section>

        <div key={currentStep.id} className="overlay-step-stage">
          <ControllerHealthStepCard
            step={currentStep}
            personaId={persona.ownerId}
            selectedOptionId={selectedOptionId}
            onSelectOption={setSelectedOptionId}
            selectedPaymentId={selectedPaymentId}
            onSelectPayment={setSelectedPaymentId}
          />
        </div>

        <footer className="overlay-actions">
          <button
            type="button"
            className="ps5-pill-button subtle"
            onClick={goBack}
            disabled={atFirstStep}
          >
            Back
          </button>
          {atLastStep ? (
            <button type="button" className="ps5-pill-button primary" ref={primaryBtnRef} onClick={onClose}>
              Done
            </button>
          ) : (
            <button type="button" className="ps5-pill-button primary" ref={primaryBtnRef} onClick={goForward}>
              {getPrimaryLabel()}
            </button>
          )}
          {!isFinalStep ? (
            <button type="button" className="ps5-pill-button ghost" onClick={onLater}>
              Later
            </button>
          ) : null}
        </footer>
      </aside>
    </div>
  );
}
