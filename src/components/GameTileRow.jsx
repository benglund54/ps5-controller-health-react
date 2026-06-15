export function GameTileRow({ tiles, selectedIndex, startIndex, visibleCount = 8, onSelectTile, onActivateTile }) {
  const visibleTiles = tiles.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="ps5-game-row" aria-label="Games and apps">
      {visibleTiles.map((tile, visibleIndex) => {
        const actualIndex = startIndex + visibleIndex;
        const selected = actualIndex === selectedIndex;
        return (
        <button
          key={tile.id}
          type="button"
          className={`ps5-game-tile ${tile.id} ${selected ? "selected" : ""}`}
          onClick={() => (selected ? onActivateTile?.(tile) : onSelectTile?.(actualIndex))}
          aria-pressed={selected}
        >
          {tile.type === "symbols" ? (
            <div className="ps5-welcome-symbols" aria-hidden="true">
              <span>◻</span>
              <span>△</span>
              <span>✕</span>
              <span>◯</span>
            </div>
          ) : tile.logoTile ? (
            <img src={tile.image} alt="" className="ps5-logo-tile-img" aria-hidden="true" />
          ) : (
            <div
              className="ps5-game-art"
              style={{ backgroundImage: `url(${tile.image})` }}
              aria-hidden="true"
            />
          )}
          {tile.badge ? <span className="ps5-game-badge">{tile.badge}</span> : null}
          <div className="ps5-game-meta">
            <p>{tile.label}</p>
            <small>{tile.sub}</small>
          </div>
        </button>
        );
      })}
    </section>
  );
}
