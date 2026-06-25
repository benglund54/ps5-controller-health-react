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
import psStoreArt from "../../assets/playstation-store-nav.png";
import plusBgArt from "../../assets/playstation-plus-nav.png";
import overlayArt from "../../assets/media-gallery-nav.png";
import controllerHealthIcon from "../../assets/controller-health-icon.png";
import backgroundParticles from "../../assets/Background_image-ee73d65f-96bd-4296-ada4-8270e78c5c26.png";
import ps5WordmarkBadge from "../../assets/ps5-wordmark-badge.png";
import searchIconCustom from "../../assets/search-icon-custom.png";
import ps5ControllerImage from "../../assets/ps5-controller-stick-drift.png";
import recommendedArcRaidersArt from "../../assets/recommended-arc-raiders.png";
import recommendedDyingLightArt from "../../assets/recommended-dying-light.png";
import recommendedNba2k26Art from "../../assets/recommended-nba2k26.png";
import recommendedResidentEvilArt from "../../assets/recommended-resident-evil.png";
import playstationPlusPremiumLogoCard from "../../assets/playstation-plus-premium-logo-discovery.png";
import playstationPortableCloudImage from "../../assets/playstation-portable-cloud.png";
import gameLibraryNavArt from "../../assets/game-library-nav.png";
import wolverineWishlistImage from "../../assets/wolverine-wishlist-card.png";

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
    news: "PlayStation Cloud Streaming  |  Available Now",
    title: "Spider-Man 2",
    subtitle: "Swing into action instantly - no download, no wait. Stream the full Marvel's Spider-Man 2 experience included with your PS Plus Premium membership.",
    cta: "Start Streaming Now",
    ctaSecondary: "More Info"
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
    backgroundImage: backgroundParticles,
    news: "DualSense Wireless Controller",
    title: "Controller health check",
    subtitle: null
  },
  {
    id: "library",
    label: "Game Library",
    sub: "Collection",
    image: gameLibraryNavArt,
    backgroundImage: gameLibraryNavArt,
    news: "Collection",
    title: "Game Library",
    subtitle: "Browse your full game collection."
  }
];

const VISIBLE_TILE_COUNT = 8;
const WELCOME_RECOMMENDED_GAMES = [
  { id: "spiderman", label: "Spider-Man 2", image: spiderManArt },
  { id: "astro", label: "ASTRO BOT", image: astroBotArt },
  { id: "gow", label: "God of War", image: godOfWarArt },
  { id: "arc-raiders", label: "ARC Raiders", image: recommendedArcRaidersArt },
  // Keep right-side image positions fixed; labels are intentionally remapped per Sarah welcome direction.
  { id: "resident-evil", label: "Dying Light: The Beast", image: recommendedResidentEvilArt },
  { id: "dying-light", label: "NBA 2K26", image: recommendedDyingLightArt },
  { id: "nba2k26", label: "Resident Evil Requiem", image: recommendedNba2k26Art }
];

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
        // Hard stop tile movement while proactive toast is open.
        if (proactiveStateRef.current.isVisible) {
          return previous;
        }
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
  const useSarahWelcomeStreamingLayout = showWelcomeWidgets && persona.ownerId === "PLAYER001";
  const homeBackdropGradient = useSarahWelcomeStreamingLayout
    ? "linear-gradient(180deg, rgba(6, 13, 27, 0.14), rgba(6, 13, 27, 0.28) 42%, rgba(6, 13, 27, 0.46) 72%, rgba(6, 13, 27, 0.56))"
    : "linear-gradient(180deg, rgba(6, 13, 27, 0.2), rgba(6, 13, 27, 0.5) 38%, rgba(6, 13, 27, 0.84) 70%, rgba(6, 13, 27, 0.95))";
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
      className={`ps5-home-screen ${useSarahWelcomeStreamingLayout ? "sarah-welcome-mode" : ""}`}
      style={{
        backgroundImage: `${homeBackdropGradient}, radial-gradient(circle at 22% 66%, rgba(5, 14, 31, 0.24), rgba(5, 14, 31, 0) 34%), url(${backgroundImage})`,
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

      {useSarahWelcomeStreamingLayout ? null : (
        <section className={`ps5-home-hero ${scene.id === "controller-health" ? "health-hero" : ""} ${scene.id === "spiderman" ? "spiderman-hero" : ""}`}>
        {scene.id === "spiderman" ? (
          <>
            <div className="spiderman-pill-row">
              <span className="spiderman-pill">TRY CLOUD STREAMING</span>
              <span className="spiderman-pill premium">PS Plus Premium</span>
            </div>
            <p className="hero-news">{scene.news}</p>
            <h1>{scene.title}</h1>
            <p className="spiderman-subhead">STREAM INSTANTLY</p>
            <p>{scene.subtitle}</p>
            <ul className="spiderman-bullet-row" aria-label="Streaming highlights">
              <li>No download required</li>
              <li>Included with Premium</li>
              <li>Start in seconds</li>
            </ul>
          </>
        ) : (
          <>
            <p className="hero-news">{scene.news}</p>
            <h1>{scene.title}</h1>
            <p>
              {scene.id === "controller-health"
                ? `${persona.issueTitle}. ${journey.overlay.subtitle}`
                : scene.subtitle}
            </p>
          </>
        )}
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
          <div className={`ps5-feature-actions ${scene.id === "spiderman" ? "spiderman-actions" : ""}`}>
            <button type="button">{scene.cta}</button>
            <button type="button" className="ghost">
              {scene.ctaSecondary || "..."}
            </button>
          </div>
        ) : null}
        </section>
      )}

      {useSarahWelcomeStreamingLayout ? (
        <section className="welcome-stream-layout" aria-label="Cloud streaming welcome layout">
          <div className="welcome-stream-main-card">
            <div className="spiderman-pill-row">
              <span className="spiderman-pill">TRY CLOUD STREAMING</span>
              <span className="spiderman-pill premium">PS Plus Premium</span>
            </div>
            <p className="hero-news">PlayStation Cloud Streaming  |  Available Now</p>
            <h2>Spider-Man 2</h2>
            <p className="spiderman-subhead">STREAM INSTANTLY</p>
            <p className="welcome-stream-copy">
              Swing into action instantly - no download, no wait. Stream the full Marvel&apos;s Spider-Man 2 experience
              included with your PS Plus Premium membership.
            </p>
            <ul className="spiderman-bullet-row" aria-label="Streaming highlights">
              <li>No download required</li>
              <li>Included with Premium</li>
              <li>Start in seconds</li>
            </ul>
            <div className="ps5-feature-actions spiderman-actions welcome-stream-actions">
              <button type="button">Start Streaming Now</button>
              <button type="button" className="ghost">More Info</button>
            </div>
          </div>

          <aside className="welcome-stream-wishlist-card" aria-label="Marvel's Wolverine wishlist pre-order">
            <div className="welcome-wishlist-media">
              <img src={wolverineWishlistImage} alt="Marvel's Wolverine key art" />
            </div>
            <div className="welcome-wishlist-content">
              <div className="welcome-wishlist-top">
                <span className="welcome-wishlist-badge">WISHLISTED</span>
                <p className="welcome-wishlist-context">Recommended from your wishlist</p>
              </div>
              <div className="welcome-wishlist-body">
                <h3>Marvel&apos;s Wolverine</h3>
                <p className="welcome-wishlist-headline">Pre-order available now</p>
                <p className="welcome-wishlist-copy">
                  You added Wolverine to your wishlist. Pre-order today and be ready to play at launch.
                </p>
                <div className="welcome-wishlist-actions">
                  <button type="button" className="welcome-wishlist-primary">Pre-order Now</button>
                  <button type="button" className="welcome-wishlist-secondary">View Details</button>
                </div>
              </div>
            </div>
          </aside>

          <aside className="welcome-stream-side-card" aria-label="Cloud gaming discovery panel">
            <img
              className="welcome-plus-logo"
              src={playstationPlusPremiumLogoCard}
              alt="PlayStation Plus Premium"
            />
            <h3>Discover Cloud Streaming on PlayStation</h3>
            <img
              className="welcome-side-device-image"
              src={playstationPortableCloudImage}
              alt="PlayStation portable cloud streaming"
            />
            <p>
              As a Premium member, you have access to hundreds of games - stream instantly, no download, no waiting,
              just press play.
            </p>
            <div className="welcome-side-actions">
              <button type="button">Stream Games</button>
              <button type="button">Game Catalog</button>
              <button type="button">Classics</button>
            </div>
          </aside>

          <div className="welcome-recommended-row" aria-label="Recommended for you">
            <p className="welcome-row-label">RECOMMENDED FOR YOU</p>
            <div className="welcome-row-track">
              {WELCOME_RECOMMENDED_GAMES.map((game) => (
                <article key={game.id} className="welcome-reco-card">
                  <img src={game.image} alt={game.label} />
                  <span className="welcome-reco-badge">Stream</span>
                  <p>{game.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : showWelcomeWidgets ? (
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
