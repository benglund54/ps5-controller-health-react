import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LiveClock } from "./LiveClock";
import { GameTileRow } from "./GameTileRow";
import { HomeWidgets } from "./HomeWidgets";
import { ProactiveHealthToast } from "./ProactiveHealthToast";
import { ControllerHealthOverlay } from "./ControllerHealthOverlay";
import { getControllerHealthJourney } from "../data/controllerHealthJourneys";
import welcomeBackground from "../../assets/PS5_Welcome_background-c2fb8859-4d49-4f6e-9620-7868bb34da1a.png";
import spiderManArt from "../../assets/Spider-Man_Miles_Morales-7809d6ce-8c11-455d-b1be-a3f34d1bc0e9.png";
import astroBotArt from "../../assets/astro_bot-788ff256-67f0-461a-b09e-981f24683a15.png";
import godOfWarArt from "../../assets/God_of_War-ddf6f85f-5bc4-4a38-b6e7-6dcf244e9568.png";
import psStoreArt from "../../assets/Playstation_store-ef2939a6-5eb9-4ff4-85a0-8220484dbf06.png";
import plusBgArt from "../../assets/plus-last-of-us-bg.png";
import overlayArt from "../../assets/welcome-widgets-overlay.png";
import controllerHealthIcon from "../../assets/controller-health-icon.png";
import backgroundParticles from "../../assets/Background_image-ee73d65f-96bd-4296-ada4-8270e78c5c26.png";
import ps5WordmarkBadge from "../../assets/ps5-wordmark-badge.png";
import searchIconCustom from "../../assets/search-icon-custom.png";
import ps5ControllerImage from "../../assets/ps5-controller-stick-drift.png";

const HOME_TILES = [
  {
    id: "welcome",
    label: "Welcome",
    sub: "Home",
    type: "symbols",
    backgroundImage: welcomeBackground,
    news: "Official News from PlayStation · 4 hours ago",
    title: "Welcome Back",
    subtitle: "Jump into your latest games, media, and PlayStation updates.",
    showWidgets: true
  },
  {
    id: "spiderman",
    label: "Marvel's Spider-Man 2",
    sub: "Game",
    image: spiderManArt,
    badge: "NEW",
    backgroundImage: spiderManArt,
    news: "Official News from PlayStation · Yesterday",
    title: "Marvel's Spider-Man 2",
    subtitle: "Continue your latest adventure.",
    cta: "Play Game"
  },
  {
    id: "astro",
    label: "ASTRO BOT",
    sub: "Game",
    image: astroBotArt,
    backgroundImage: astroBotArt,
    news: "Featured · PlayStation Studios",
    title: "ASTRO BOT",
    subtitle: "Discover the future of play with your DualSense in hand.",
    cta: "Play Game"
  },
  {
    id: "gow",
    label: "God of War",
    sub: "Game",
    image: godOfWarArt,
    backgroundImage: godOfWarArt,
    news: "PlayStation Studios · Featured",
    title: "God of War",
    subtitle: "Explore the Realms.",
    cta: "Play Game"
  },
  {
    id: "store",
    label: "PlayStation Store",
    sub: "App",
    image: psStoreArt,
    backgroundImage: psStoreArt,
    news: "Store · Featured",
    title: "PlayStation Store",
    subtitle: "Browse this week's highlighted deals."
  },
  {
    id: "plus",
    label: "PlayStation Plus",
    sub: "Subscription",
    image: plusBgArt,
    backgroundImage: plusBgArt,
    news: "PlayStation Plus · New",
    title: "PlayStation Plus",
    subtitle: "Explore monthly games and perks."
  },
  {
    id: "media-gallery",
    label: "Media Gallery",
    sub: "App",
    image: overlayArt,
    backgroundImage: overlayArt,
    news: "Library · Captures",
    title: "Media Gallery",
    subtitle: "View your latest captures and clips."
  },
  {
    id: "controller-health",
    label: "Controller Health",
    sub: "Support",
    image: controllerHealthIcon,
    logoTile: true,
    backgroundImage: backgroundParticles,
    news: "DualSense Wireless Controller",
    title: "Controller health check",
    subtitle: null
  },
  {
    id: "library",
    label: "Game Library",
    sub: "Collection",
    image: welcomeBackground,
    backgroundImage: welcomeBackground,
    news: "Collection",
    title: "Game Library",
    subtitle: "Browse your full game collection."
  }
];

const VISIBLE_TILE_COUNT = 8;

export function Ps5HomeScreen({
  persona,
  homeSession,
  onOpenHealthPanel,
  onCloseHealthPanel,
  onLater
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showActivatePulse, setShowActivatePulse] = useState(false);
  const [proactiveState, setProactiveState] = useState({
    navigationCount: 0,
    hasTriggered: false,
    isVisible: false,
    dismissed: false
  });
  const scene = HOME_TILES[selectedIndex] ?? HOME_TILES[0];
  const journey = useMemo(() => getControllerHealthJourney(persona.ownerId), [persona.ownerId]);
  const startIndex = useMemo(
    () => Math.max(0, Math.min(selectedIndex - 1, HOME_TILES.length - VISIBLE_TILE_COUNT)),
    [selectedIndex]
  );
  const selectedVisualSlot = selectedIndex - startIndex;
  const pressedArrowKeys = useRef(new Set());
  const [toastFocusedAction, setToastFocusedAction] = useState("viewOptions");

  // Refs keep the latest values so event-handler closures never go stale.
  // Updated via useLayoutEffect (after paint) rather than inline during render.
  const proactiveStateRef = useRef(proactiveState);
  const toastFocusedActionRef = useRef("viewOptions");
  // callbacksRef populated below (after dismissForSession / ignoreForPersonaSession are defined)
  const callbacksRef = useRef({});

  // Reset all session state whenever the active persona changes.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setProactiveState({
      navigationCount: 0,
      hasTriggered: false,
      isVisible: false,
      dismissed: false
    });
    setToastFocusedAction("viewOptions");
    setSelectedIndex(0);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [persona.ownerId]);

  const handleArrowNavigation = () => {
    setProactiveState((previous) => {
      const nextCount = previous.navigationCount + 1;
      if (!previous.hasTriggered && !previous.dismissed && nextCount >= 5) {
        return {
          ...previous,
          navigationCount: nextCount,
          hasTriggered: true,
          isVisible: true
        };
      }
      return {
        ...previous,
        navigationCount: nextCount
      };
    });
  };

  useEffect(() => {
    const moveSelection = (delta, source = "arrow") => {
      setSelectedIndex((previous) => {
        const next = Math.max(0, Math.min(HOME_TILES.length - 1, previous + delta));
        const changed = next !== previous;
        if (changed && source === "arrow") {
          handleArrowNavigation();
        }
        return next;
      });
    };

    const onKeyDown = (event) => {
      // When the toast is visible its capturing handler handles everything — don't also navigate tiles
      if (proactiveStateRef.current.isVisible) return;

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (pressedArrowKeys.current.has(event.key)) return;
        pressedArrowKeys.current.add(event.key);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection(-1, "arrow");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(1, "arrow");
      } else if (event.key === "Enter" || event.key.toLowerCase() === "x") {
        event.preventDefault();
        if (scene.id === "controller-health") {
          onOpenHealthPanel?.();
        } else {
          setShowActivatePulse(true);
        }
      }
    };

    const onKeyUp = (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        pressedArrowKeys.current.delete(event.key);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    // Capture the ref value so the cleanup closure uses a stable reference.
    const pressedKeys = pressedArrowKeys.current;
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      pressedKeys.clear();
    };
  }, [scene.id, onOpenHealthPanel]);

  useEffect(() => {
    if (!showActivatePulse) return undefined;
    const timeout = setTimeout(() => setShowActivatePulse(false), 450);
    return () => clearTimeout(timeout);
  }, [showActivatePulse]);

  // Reset toast focus to "View options" each time the toast appears.
  useEffect(() => {
    if (proactiveState.isVisible) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setToastFocusedAction("viewOptions");
      toastFocusedActionRef.current = "viewOptions";
    }
  }, [proactiveState.isVisible]);

  // Capturing keyboard handler active only while toast is visible.
  // Runs in the capture phase so it intercepts before App.jsx / tile handlers.
  useEffect(() => {
    if (!proactiveState.isVisible) return undefined;

    const ACTIONS = ["viewOptions", "later", "ignore"];

    const onToastKeyDown = (event) => {
      const { key } = event;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", "Escape"].includes(key)) return;

      event.preventDefault();
      event.stopPropagation(); // prevent App.jsx Escape → picker, and tile navigation

      if (key === "Escape") {
        callbacksRef.current.dismiss();
        return;
      }

      if (key === "Enter") {
        const action = toastFocusedActionRef.current;
        if (action === "viewOptions") callbacksRef.current.openPanel();
        else if (action === "later") callbacksRef.current.dismiss();
        else callbacksRef.current.ignore();
        return;
      }

      // Arrow keys cycle through toast actions
      const forward = key === "ArrowRight" || key === "ArrowDown";
      const current = toastFocusedActionRef.current;
      const idx = ACTIONS.indexOf(current);
      const next = ACTIONS[(forward ? idx + 1 : idx - 1 + ACTIONS.length) % ACTIONS.length];
      toastFocusedActionRef.current = next;
      setToastFocusedAction(next);
    };

    window.addEventListener("keydown", onToastKeyDown, true); // capture phase
    return () => window.removeEventListener("keydown", onToastKeyDown, true);
  }, [proactiveState.isVisible]);

  const backgroundImage = scene.backgroundImage || welcomeBackground;
  const selectedLabelStyle = {
    left: `calc(${selectedVisualSlot} * var(--tile-compact-size) + ${selectedVisualSlot} * var(--tile-gap) + var(--tile-selected-size) + 14px)`
  };
  const showWelcomeWidgets = scene.id === "welcome";
  const showLowerContext = scene.id !== "welcome";
  const lowerContextCards =
    scene.id === "controller-health"
      ? [
          { title: "DualSense status", value: persona.issueTitle },
          { title: "Recommended next step", value: persona.customerFacingMessage }
        ]
      : [
          { title: "Trophies", value: "20 · 231 · 902 · 4.7k" },
          { title: "Friends Who Play", value: "23 active friends" },
          { title: "Session", value: "Resume from latest checkpoint" }
        ];
  const dismissForSession = () => {
    setProactiveState((previous) => ({
      ...previous,
      isVisible: false,
      hasTriggered: false,
      navigationCount: 0
    }));
    onCloseHealthPanel?.();
  };

  const ignoreForPersonaSession = () => {
    setProactiveState((previous) => ({
      ...previous,
      isVisible: false,
      dismissed: true
    }));
    onLater?.();
    onCloseHealthPanel?.();
  };

  // Keep all refs fresh after every render so capturing event-handler closures
  // always call the correct (non-stale) versions. useLayoutEffect runs synchronously
  // after DOM mutations, before the browser paints — safe and lint-compliant.
  useLayoutEffect(() => {
    proactiveStateRef.current = proactiveState;
    toastFocusedActionRef.current = toastFocusedAction;
    callbacksRef.current = {
      dismiss: dismissForSession,
      ignore: ignoreForPersonaSession,
      openPanel: () => {
        setProactiveState((previous) => ({ ...previous, isVisible: false }));
        onOpenHealthPanel?.();
      }
    };
  });

  return (
    <section
      className="ps5-home-screen"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(6, 13, 27, 0.2), rgba(6, 13, 27, 0.5) 38%, rgba(6, 13, 27, 0.84) 70%, rgba(6, 13, 27, 0.95)), radial-gradient(circle at 22% 66%, rgba(5, 14, 31, 0.24), rgba(5, 14, 31, 0) 34%), url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <header className="ps5-home-top">
        <div className="ps5-home-tabs">
          <span className="active">Games</span>
          <span>Media</span>
        </div>
        <div className="ps5-home-icons">
          <span className="ps5-search-icon-wrap" aria-hidden="true">
            <img src={searchIconCustom} alt="" />
          </span>
          <span aria-hidden="true">⚙</span>
          <span className="ps5-top-avatar" aria-hidden="true">
            ☺
          </span>
          <LiveClock />
        </div>
      </header>

      <section className="ps5-tile-rail-wrap">
        <GameTileRow
          tiles={HOME_TILES}
          selectedIndex={selectedIndex}
          startIndex={startIndex}
          visibleCount={VISIBLE_TILE_COUNT}
          onSelectTile={setSelectedIndex}
          onActivateTile={(tile) => {
            if (tile.id === "controller-health") {
              onOpenHealthPanel?.();
              return;
            }
            setShowActivatePulse(true);
          }}
        />
        <div className={`ps5-selected-tile-label ${showActivatePulse ? "active-pulse" : ""}`} style={selectedLabelStyle}>
          <img className="ps5-selected-badge" src={ps5WordmarkBadge} alt="PS5" />
          <span>{scene.label}</span>
        </div>
      </section>

      <section className={`ps5-home-hero ${scene.id === "controller-health" ? "health-hero" : ""}`}>
        <p className="hero-news">{scene.news}</p>
        <h1>{scene.title}</h1>
        <p>
          {scene.id === "controller-health"
            ? `${persona.issueTitle}. ${journey.overlay.subtitle}`
            : scene.subtitle}
        </p>
        {scene.id === "controller-health" ? (
          <div className="ps5-feature-actions">
            <button type="button" onClick={onOpenHealthPanel}>
              View details
            </button>
            <button type="button" className="ghost" onClick={dismissForSession}>
              Later
            </button>
          </div>
        ) : null}
        {scene.cta ? (
          <div className="ps5-feature-actions">
            <button type="button">{scene.cta}</button>
            <button type="button" className="ghost">
              ...
            </button>
          </div>
        ) : null}
      </section>

      {showWelcomeWidgets ? (
        <HomeWidgets
          persona={persona}
          selectedTileId={scene.id}
          onOpenHealthPanel={onOpenHealthPanel}
          onLater={dismissForSession}
        />
      ) : null}

      {showLowerContext ? (
        <section className="ps5-context-deck">
          <div className="ps5-context-chips">
            <span className="context-chip">Play Game</span>
            <span className="context-chip ghost">...</span>
            <span className="context-chip muted">Official News</span>
          </div>
          <div className="ps5-context-cards">
            {lowerContextCards.map((card) => (
              <article key={card.title} className="context-card">
                <p className="context-card-title">{card.title}</p>
                <p className="context-card-value">{card.value}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <ProactiveHealthToast
        visible={proactiveState.isVisible}
        subtitle={journey.toast.message}
        controllerImage={ps5ControllerImage}
        focusedAction={toastFocusedAction}
        onViewDetails={() => {
          setProactiveState((previous) => ({ ...previous, isVisible: false }));
          onOpenHealthPanel?.();
        }}
        onLater={dismissForSession}
        onIgnore={ignoreForPersonaSession}
      />

      <ControllerHealthOverlay
        persona={persona}
        visible={Boolean(homeSession?.panelOpen)}
        onClose={onCloseHealthPanel}
        onLater={dismissForSession}
      />
      <footer className="ps5-home-footer">
        <span>Arrow keys: Navigate</span>
        <span>Enter/X: Select</span>
        <span>Esc: Back</span>
        <span>Options: Menu</span>
      </footer>
    </section>
  );
}
