import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// San Mateo, CA — demo delivery address
const SAN_MATEO = [37.56299, -122.32553];

// PS5-style custom pin — avoids the Leaflet default icon Vite/ESM issue
const psPin = L.divIcon({
  html: `<div class="ps5-map-pin"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  className: ""
});

export function DeliveryMap() {
  const mapRef = useRef(null);

  // Prevent the map from capturing ArrowKey events that should go to the overlay nav
  useEffect(() => {
    const container = mapRef.current?.getContainer?.();
    if (!container) return;
    const handler = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
        e.stopPropagation();
      }
    };
    container.addEventListener("keydown", handler);
    return () => container.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="delivery-map-wrap" aria-hidden="true">
      <MapContainer
        ref={mapRef}
        center={SAN_MATEO}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={true}
        dragging={false}
        doubleClickZoom={false}
        className="delivery-leaflet-map"
        tabIndex={-1}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" tabindex="-1">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={SAN_MATEO} icon={psPin} />
      </MapContainer>
    </div>
  );
}
