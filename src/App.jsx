import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProfilePicker } from "./components/ProfilePicker";
import { Ps5HomeScreen } from "./components/Ps5HomeScreen";
import { playerPersonas } from "./data/playerPersonas";
import { getPlayerProfile, isMiddlewareSourceEnabled } from "./services/controllerHealthService";
import "./styles/ps5-console.css";

function createHomeSession(personaId) {
  return {
    selectedPersonaId: personaId,
    navigationCount: 0,
    hasTriggered: false,
    isVisible: false,
    dismissed: false,
    panelOpen: false
  };
}

function App() {
  const [personas, setPersonas] = useState(playerPersonas);
  const [screen, setScreen] = useState("picker");
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(1);
  const [activePersonaIndex, setActivePersonaIndex] = useState(0);
  const [showManualLookup, setShowManualLookup] = useState(false);
  const [homeSession, setHomeSession] = useState(() =>
    createHomeSession(playerPersonas[0]?.ownerId)
  );

  // Keep a stable ref to current screen for use inside stable callbacks
  const screenRef = useRef(screen);
  useEffect(() => { screenRef.current = screen; }, [screen]);

  const activePersona = useMemo(
    () => personas[activePersonaIndex] ?? personas[0],
    [activePersonaIndex, personas]
  );

  const maxPickerIndex = personas.length;

  useEffect(() => {
    if (!isMiddlewareSourceEnabled()) return;
    let cancelled = false;

    const hydratePersonas = async () => {
      const hydrated = await Promise.all(
        playerPersonas.map(async (persona) => {
          try {
            const profile = await getPlayerProfile(persona.ownerId);
            return profile ?? persona;
          } catch {
            return persona;
          }
        })
      );
      if (!cancelled) {
        setPersonas(hydrated);
      }
    };

    hydratePersonas();
    return () => {
      cancelled = true;
    };
  }, []);

  const movePickerSelection = useCallback((nextIndex) => {
    const clamped = Math.max(0, Math.min(maxPickerIndex, nextIndex));
    setSelectedProfileIndex(clamped);
  }, [maxPickerIndex]);

  const openSelectedPickerItem = useCallback((index) => {
    const idx = index ?? selectedProfileIndex;
    if (idx === 0) {
      setShowManualLookup(true);
      return;
    }
    const personaIndex = idx - 1;
    const persona = personas[personaIndex];
    setActivePersonaIndex(personaIndex);
    setHomeSession(createHomeSession(persona?.ownerId));
    setScreen("home");
  }, [selectedProfileIndex, personas]);

  // Normalize a lookup query against all fields
  const handleManualSelect = useCallback((query) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return false;

    const foundIndex = personas.findIndex((persona) =>
      persona.ownerId.toLowerCase() === normalized ||
      persona.psnAccount.toLowerCase() === normalized ||
      persona.displayName.toLowerCase() === normalized
    );

    if (foundIndex === -1) return false;
    setSelectedProfileIndex(foundIndex + 1);
    setActivePersonaIndex(foundIndex);
    setHomeSession(createHomeSession(personas[foundIndex]?.ownerId));
    setScreen("home");
    setShowManualLookup(false);
    return true;
  }, [personas]);

  const handleHomeToastLater = useCallback(() => {
    setHomeSession((prev) =>
      prev ? { ...prev, isVisible: false, dismissed: true, panelOpen: false } : prev
    );
  }, []);

  const handleOpenHealthPanel = useCallback(() => {
    setHomeSession((prev) =>
      prev ? { ...prev, panelOpen: true, isVisible: false } : prev
    );
  }, []);

  const handleCloseHealthPanel = useCallback(() => {
    setHomeSession((prev) =>
      prev ? { ...prev, panelOpen: false } : prev
    );
  }, []);

  // R key: reset session state (close toast/overlay, reset nav count) — stays on home
  const handleResetSession = useCallback(() => {
    setHomeSession((prev) =>
      prev
        ? createHomeSession(prev.selectedPersonaId)
        : prev
    );
  }, []);

  // Global keyboard handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isInInput = event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA";

      // ── Picker screen ──────────────────────────────────────────────────────
      if (screen === "picker") {
        // Allow arrow keys inside the manual lookup input to move cursor normally
        if (isInInput && (event.key === "ArrowLeft" || event.key === "ArrowRight")) return;

        if (event.key === "ArrowLeft" && !isInInput) {
          event.preventDefault();
          movePickerSelection(selectedProfileIndex - 1);
        } else if (event.key === "ArrowRight" && !isInInput) {
          event.preventDefault();
          movePickerSelection(selectedProfileIndex + 1);
        } else if ((event.key === "Enter" || event.key.toLowerCase() === "x") && !isInInput) {
          event.preventDefault();
          openSelectedPickerItem();
        } else if (event.key === "Escape") {
          setShowManualLookup(false);
        }
        return;
      }

      // ── Home screen ────────────────────────────────────────────────────────
      if (screen === "home") {
        // P key → back to picker (demo reset shortcut)
        if (event.key.toLowerCase() === "p" && !isInInput) {
          event.preventDefault();
          setSelectedProfileIndex(activePersonaIndex + 1);
          setScreen("picker");
          return;
        }

        // R key → reset session (demo reset shortcut)
        if (event.key.toLowerCase() === "r" && !isInInput) {
          event.preventDefault();
          handleResetSession();
          return;
        }

        // Escape on home (without overlay/toast open) → back to picker
        if (event.key === "Escape") {
          // Overlay and toast handle their own Escape via capturing handlers.
          // This fires only if neither is intercepting (they call stopPropagation).
          event.preventDefault();
          setSelectedProfileIndex(activePersonaIndex + 1);
          setScreen("picker");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, selectedProfileIndex, activePersonaIndex, movePickerSelection, openSelectedPickerItem, handleResetSession]);

  const handlePickerItemClick = (index) => {
    if (index === selectedProfileIndex) {
      openSelectedPickerItem(index);
      return;
    }
    setSelectedProfileIndex(index);
  };

  return (
    <div className="ps5-console-app">
      {screen === "picker" ? (
        <ProfilePicker
          personas={personas}
          selectedIndex={selectedProfileIndex}
          onClickItem={handlePickerItemClick}
          onManualSelect={handleManualSelect}
          showManualLookup={showManualLookup}
          onDismissManualLookup={() => setShowManualLookup(false)}
        />
      ) : (
        <Ps5HomeScreen
          persona={activePersona}
          homeSession={homeSession}
          onOpenHealthPanel={handleOpenHealthPanel}
          onCloseHealthPanel={handleCloseHealthPanel}
          onLater={handleHomeToastLater}
        />
      )}
    </div>
  );
}

export default App;
