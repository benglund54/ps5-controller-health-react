function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

export function ControllerOptionCard({
  title,
  description,
  chip,
  selected = false,
  onClick,
  imageSrc,
  imageAlt,
  basePrice,
  finalPrice,
  priceNote,
  deltaPrice
}) {
  return (
    <article
      className={`ps5-controller-option-card ${selected ? "selected" : ""} ${onClick ? "interactive" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {imageSrc ? (
        <div className="option-image-wrap">
          <img src={imageSrc} alt={imageAlt ?? ""} />
        </div>
      ) : null}
      {chip ? (
        <p className={`option-chip ${
          chip.toLowerCase().includes("recommended") ? "option-chip-recommended" :
          chip.toLowerCase().includes("premium")     ? "option-chip-premium" :
          chip.toLowerCase().includes("limited")     ? "option-chip-limited" : ""
        }`}>{chip}</p>
      ) : null}
      <p className="option-title">{title}</p>
      <p className="option-description">{description}</p>
      {typeof basePrice === "number" && typeof finalPrice === "number" ? (
        <div className="option-price-block">
          <p className={basePrice !== finalPrice ? "base-price crossed" : "base-price"}>{formatPrice(basePrice)}</p>
          <p className="final-price">{formatPrice(finalPrice)}</p>
          {deltaPrice ? <p className="delta-price">{deltaPrice}</p> : null}
          {priceNote ? <p className="price-note">{priceNote}</p> : null}
        </div>
      ) : null}
    </article>
  );
}
