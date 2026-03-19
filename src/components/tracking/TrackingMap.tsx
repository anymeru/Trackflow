import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TrackingItem } from "@/data/mockData";
import StatusBadge from "@/components/tracking/StatusBadge";
import { useEffect } from "react";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createColorIcon = (color: string) =>
  new L.DivIcon({
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const statusToColor: Record<string, string> = {
  in_transit: "#f97316",
  delivered: "#22c55e",
  delayed: "#ef4444",
  out_for_delivery: "#eab308",
  created: "#3b82f6",
  picked_up: "#3b82f6",
};

interface FitBoundsProps {
  items: TrackingItem[];
}

const FitBounds = ({ items }: FitBoundsProps) => {
  const map = useMap();
  useEffect(() => {
    if (items.length > 0) {
      const bounds = L.latLngBounds(items.map((t) => [t.lat, t.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [items, map]);
  return null;
};

interface TrackingMapProps {
  items: TrackingItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  showRoute?: boolean;
  className?: string;
}

const TrackingMap = ({ items, selectedId, onSelect, showRoute = false, className = "" }: TrackingMapProps) => {
  const center: [number, number] = items.length === 1 ? [items[0].lat, items[0].lng] : [46.6, 2.5];
  const zoom = items.length === 1 ? 8 : 6;

  const selectedItem = items.find((t) => t.id === selectedId);
  const routePositions = selectedItem?.positions.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <div className={`rounded-xl overflow-hidden border border-border shadow-sm ${className}`}>
      <MapContainer center={center} zoom={zoom} className="h-full w-full" style={{ minHeight: "300px" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.length > 1 && <FitBounds items={items} />}
        {items.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={createColorIcon(statusToColor[item.status] || "#6b7280")}
            eventHandlers={{ click: () => onSelect?.(item.id) }}
          >
            <Popup>
              <div className="text-sm space-y-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs">{item.trackingNumber}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {showRoute && routePositions && routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: "#f97316", weight: 3, dashArray: "8 4" }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TrackingMap;
