import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TrackingItem } from "@/data/mockData";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const statusToColor: Record<string, string> = {
  in_transit: "#f97316",
  delivered: "#22c55e",
  delayed: "#ef4444",
  out_for_delivery: "#eab308",
  created: "#3b82f6",
  picked_up: "#3b82f6",
};

const createColorIcon = (color: string) =>
  new L.DivIcon({
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

interface TrackingMapProps {
  items: TrackingItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  showRoute?: boolean;
  className?: string;
}

const TrackingMap = ({ items, selectedId, onSelect, showRoute = false, className = "" }: TrackingMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] = items.length === 1 ? [items[0].lat, items[0].lng] : [46.6, 2.5];
    const zoom = items.length === 1 ? 8 : 6;

    const map = L.map(containerRef.current).setView(center, zoom);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing layers (except tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    });

    // Add markers
    items.forEach((item) => {
      const marker = L.marker([item.lat, item.lng], {
        icon: createColorIcon(statusToColor[item.status] || "#6b7280"),
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-size:13px;">
          <p style="font-weight:600;margin:0;">${item.name}</p>
          <p style="font-size:11px;margin:2px 0 0;color:#666;">${item.trackingNumber}</p>
        </div>
      `);

      if (onSelect) {
        marker.on("click", () => onSelect(item.id));
      }
    });

    // Fit bounds
    if (items.length > 1) {
      const bounds = L.latLngBounds(items.map((t) => [t.lat, t.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }

    // Draw route
    if (showRoute && selectedId) {
      const selectedItem = items.find((t) => t.id === selectedId);
      if (selectedItem?.positions && selectedItem.positions.length > 1) {
        const routePositions = selectedItem.positions.map((p) => [p.lat, p.lng] as [number, number]);
        L.polyline(routePositions, { color: "#f97316", weight: 3, dashArray: "8 4" }).addTo(map);
      }
    }
  }, [items, selectedId, showRoute, onSelect]);

  return (
    <div className={`rounded-xl overflow-hidden border border-border shadow-sm ${className}`}>
      <div ref={containerRef} className="h-full w-full" style={{ minHeight: "300px" }} />
    </div>
  );
};

export default TrackingMap;
