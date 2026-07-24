import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RecentTracking {
  trackingNumber: string;
  name: string;
  status: string;
  timestamp: number;
}

const STORAGE_KEY = "trackflow_recent_trackings";
const MAX_ITEMS = 5;

export const addRecentTracking = (item: Omit<RecentTracking, "timestamp">) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let items: RecentTracking[] = stored ? JSON.parse(stored) : [];
    items = items.filter((i) => i.trackingNumber !== item.trackingNumber);
    items.unshift({ ...item, timestamp: Date.now() });
    items = items.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable
  }
};

export const clearRecentTrackings = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
};

const RecentTrackings = ({ onSelect }: { onSelect?: (trackingNumber: string) => void }) => {
  const [items, setItems] = useState<RecentTracking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const handleClear = () => {
    clearRecentTrackings();
    setItems([]);
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs text-muted-foreground h-auto py-1">
          <X className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.trackingNumber}
            onClick={() => onSelect?.(item.trackingNumber)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/80 hover:bg-muted text-sm transition-colors group"
          >
            <span className="font-mono text-xs text-muted-foreground">{item.trackingNumber}</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentTrackings;
