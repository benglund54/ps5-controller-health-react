import { useEffect, useRef, useState } from "react";
import { LiveClock } from "./LiveClock";
import pickerBackground from "../../assets/Background_image-ee73d65f-96bd-4296-ada4-8270e78c5c26.png";
import selectedControllerIcon from "../../assets/controller-icon-selected.png";
import playstationPlusBadge from "../../assets/playstation-plus-badge.png";

const MOCK_HINT_IDS = ["PLAYER001", "PLAYER002", "PLAYER003", "PLAYER004"];
const MOCK_HINT_NAMES = ["sarahj_plays", "marcus_chen84", "nina_streams", "alex_edge"];

export function ProfilePicker({
  personas,
  selectedIndex,
  onClickItem,
  onManualSelect,
  showManualLookup,
  onDismissManualLookup
}) {
  const [manualInput, setManualInput] = useState("");
  const [manualError, setManualError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  // Clear and focus the input each time the lookup modal opens.
  useEffect(() => {
    if (showManualLookup) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setManualInput("");
      setManualError("");
      setIsSearching(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [showManualLookup]);

  const submitManual = () => {
    const trimmed = manualInput.trim();
    if (!trimmed) {
      setManualError("Enter a Player ID, PSN handle, or display name.");
      return;
    }
    setIsSearching(true);
    // Short delay to simulate async lookup (mirrors the service layer pattern)
    setTimeout(() => {
      const matched = onManualSelect?.(trimmed);
      setIsSearching(false);
      if (!matched) {
        setManualError("Player not found. Try a Player ID, PSN handle, or display name from the list below.");
      }
    }, 180);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitManual();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      onDismissManualLookup?.();
    }
    // Allow arrow keys inside input to move the cursor — do not propagate to picker
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.stopPropagation();
    }
  };

  const fillHint = (id) => {
    setManualInput(id);
    setManualError("");
    inputRef.current?.focus();
  };

  const pickerItems = [
    { type: "addUser", key: "add-user" },
    ...personas.map((persona) => ({ type: "persona", key: persona.ownerId, persona }))
  ];
  const slotIndexes = [selectedIndex - 1, selectedIndex, selectedIndex + 1];

  return (
    <section
      className="ps5-picker-screen"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(6, 11, 25, 0.5), rgba(6, 11, 25, 0.78)), url(${pickerBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <header className="ps5-picker-top">
        <LiveClock />
      </header>

      <main className="ps5-picker-main">
        <h1>Welcome Back to PlayStation</h1>
        <p>Who&apos;s using this controller?</p>

        <div className="ps5-profile-carousel" role="listbox" aria-label="Select profile">
          {slotIndexes.map((itemIndex, slotIndex) => {
            const slotClass = slotIndex === 0 ? "left" : slotIndex === 1 ? "center" : "right";
            const item = pickerItems[itemIndex];

            if (!item) {
              return <div key={`empty-${slotClass}`} className={`ps5-profile-slot ${slotClass} empty`} />;
            }

            const isSelected = itemIndex === selectedIndex;
            if (item.type === "addUser") {
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`ps5-profile-slot ${slotClass} ps5-profile-option ps5-add-user-btn ${isSelected ? "active" : ""}`}
                  onClick={() => onClickItem?.(itemIndex)}
                  aria-selected={isSelected}
                  aria-label="Add user"
                >
                  <span className="ps5-avatar-shell">
                    <span className="add-user-disk">
                      <span className="add-user-plus">+</span>
                    </span>
                  </span>
                  <span className="ps5-profile-name add-user-label">Add User</span>
                </button>
              );
            }

            const persona = item.persona;
            return (
              <button
                key={item.key}
                type="button"
                className={`ps5-profile-slot ${slotClass} ps5-profile-option ${persona.accent} ${isSelected ? "active" : ""}`}
                onClick={() => onClickItem?.(itemIndex)}
                aria-selected={isSelected}
              >
                {isSelected ? (
                  <span className="ps5-controller-indicator" aria-hidden="true">
                    <img src={selectedControllerIcon} alt="" className="controller-glyph-image" />
                  </span>
                ) : null}
                <span className="ps5-avatar-shell">
                  <span className="ps5-avatar-ring">
                    <span className={`ps5-avatar-face ${persona.avatarImage ? "with-image" : ""}`}>
                      {persona.avatarImage ? (
                        <img
                          src={persona.avatarImage}
                          alt={`${persona.displayName} profile avatar`}
                          style={{ objectPosition: persona.avatarPosition || "center" }}
                        />
                      ) : (
                        persona.displayName.charAt(0)
                      )}
                    </span>
                  </span>
                </span>
                <span className="ps5-profile-name">
                  {persona.displayName}
                  {persona.ownerId === "PLAYER001" ? (
                    <img className="ps5-plus-badge" src={playstationPlusBadge} alt="PlayStation Plus" />
                  ) : null}
                </span>
                <span className="ps5-profile-scenario">{persona.scenarioText}</span>
              </button>
            );
          })}
        </div>

        <div className="ps5-options-pill">
          <span className="ps5-options-icon" aria-hidden="true" />
          Options
        </div>
      </main>

      <div className="ps5-power-button" aria-label="Power menu">⏻</div>

      <footer className="ps5-picker-footer">
        <span className="ps5-select-hint">
          <span className="x-icon">✕</span>
          Select
        </span>
        <span>← → Move</span>
      </footer>

      {/* ── PS5-style Player ID lookup modal ────────────────────────────────── */}
      {showManualLookup ? (
        <div
          className="ps5-manual-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Player ID lookup"
          onClick={(e) => { if (e.target === e.currentTarget) onDismissManualLookup?.(); }}
        >
          <div className="ps5-manual-panel">
            <div className="ps5-manual-panel-header">
              <p className="ps5-manual-kicker">PLAYER LOOKUP</p>
              <h2 className="ps5-manual-headline">Enter Player ID</h2>
              <p className="ps5-manual-desc">
                Enter a Player ID, PSN handle, or display name to load a player profile.
              </p>
              <button
                type="button"
                className="ps5-manual-close"
                onClick={onDismissManualLookup}
                aria-label="Close player lookup"
              >
                ×
              </button>
            </div>

            <div className="ps5-manual-input-row">
              <input
                ref={inputRef}
                type="text"
                className={`ps5-manual-input ${manualError ? "has-error" : ""}`}
                value={manualInput}
                onChange={(e) => {
                  setManualInput(e.target.value);
                  setManualError("");
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="e.g. PLAYER001 or sarahj_plays"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="ps5-pill-button primary ps5-manual-submit"
                onClick={submitManual}
                disabled={isSearching}
              >
                {isSearching ? "Searching…" : "Look up"}
              </button>
            </div>

            {manualError ? (
              <p className="ps5-manual-error" role="alert">{manualError}</p>
            ) : null}

            {/* Mock ID hints */}
            <div className="ps5-manual-hints">
              <p className="ps5-manual-hints-label">Sample Player IDs</p>
              <div className="ps5-manual-hints-grid">
                {MOCK_HINT_IDS.map((id, i) => (
                  <button
                    key={id}
                    type="button"
                    className="ps5-manual-hint-chip"
                    onClick={() => fillHint(id)}
                  >
                    <span className="hint-chip-id">{id}</span>
                    <span className="hint-chip-psn">{MOCK_HINT_NAMES[i]}</span>
                  </button>
                ))}
              </div>
              <p className="ps5-manual-disclaimer">
                Click any ID to fill the field, then press Look up
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
