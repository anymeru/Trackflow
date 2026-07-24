import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Tracking } from "@/api/trackings";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const STATUS_COLORS: Record<string, string> = {
  in_transit: "#06B6D4",
  out_for_delivery: "#3B82F6",
  delivered: "#22C55E",
  delayed: "#F59E0B",
  customs_hold: "#F97316",
  fees_pending: "#D97706",
  returned: "#8B5CF6",
  lost: "#EF4444",
};

const FREEZE_STATUSES = ["delayed", "customs_hold", "fees_pending"];

const createColorIcon = (color: string) =>
  new L.DivIcon({
    html: `<div style="position:relative;width:20px;height:20px;">
      <div style="position:absolute;width:20px;height:20px;border-radius:50%;border:2px solid ${color};opacity:0;animation:marker-pulse 2s ease-in-out infinite;"></div>
      <div style="background:${color};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);position:absolute;top:3px;left:3px;"></div>
    </div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

interface TrackingMapProps {
  items: Tracking[];
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

    const center: [number, number] = items.length === 1
      ? [items[0].currentLat, items[0].currentLng]
      : [46.6, 2.5];
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

    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    });

    items.forEach((item) => {
      const color = STATUS_COLORS[item.status] || "#6b7280";
      const marker = L.marker([item.currentLat, item.currentLng], {
        icon: createColorIcon(color),
      }).addTo(map);

      const freezeLabel = FREEZE_STATUSES.includes(item.status)
        ? `<p style="font-size:11px;color:#D97706;margin:2px 0 0;">⏸ Pending</p>`
        : "";

      marker.bindPopup(`
        <div style="font-size:13px;">
          <p style="font-weight:600;margin:0;">${item.clientName}</p>
          <p style="font-size:11px;margin:2px 0 0;color:#666;">${item.trackingNumber}</p>
          ${freezeLabel}
        </div>
      `);

      if (onSelect) {
        marker.on("click", () => onSelect(item.id));
      }

      // Draw route from origin → current → destination
      if (showRoute && item.id === selectedId) {
        const origin: [number, number] = [item.originLat, item.originLng];
        const current: [number, number] = [item.currentLat, item.currentLng];
        const dest: [number, number] = [item.destLat, item.destLng];

        // Completed path (origin → current)
        L.polyline([origin, current], {
          color: color,
          weight: 3,
          opacity: 0.8,
        }).addTo(map);

        // Future path (current → destination) - dashed
        L.polyline([current, dest], {
          color: "#9ca3af",
          weight: 2,
          dashArray: "8 4",
          opacity: 0.5,
        }).addTo(map);

        // Origin marker (smaller)
        L.circleMarker(origin, {
          radius: 6,
          color: "#6b7280",
          fillColor: "#6b7280",
          fillOpacity: 0.5,
          weight: 2,
        }).addTo(map);

        // Destination marker
        L.circleMarker(dest, {
          radius: 6,
          color: color,
          fillColor: color,
          fillOpacity: 0.5,
          weight: 2,
        }).addTo(map);
      }
    });

    if (items.length > 1) {
      const bounds = L.latLngBounds(
        items.map((t) => [t.currentLat, t.currentLng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    } else if (items.length === 1) {
      map.setView([items[0].currentLat, items[0].currentLng], 8);
    }
  }, [items, selectedId, showRoute, onSelect]);

  return (
    <div className={`rounded-xl overflow-hidden border border-border shadow-sm ${className}`}>
      <div ref={containerRef} className="h-full w-full" style={{ minHeight: "300px" }} />
    </div>
  );
};

export default TrackingMap;
