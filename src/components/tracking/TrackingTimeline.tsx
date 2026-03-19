import { StatusEvent } from "@/data/mockData";
import { Check, Clock, Truck, AlertTriangle, Package, MapPin } from "lucide-react";

const statusIcons: Record<string, React.ReactNode> = {
  created: <Package className="w-4 h-4" />,
  picked_up: <MapPin className="w-4 h-4" />,
  in_transit: <Truck className="w-4 h-4" />,
  out_for_delivery: <Truck className="w-4 h-4" />,
  delivered: <Check className="w-4 h-4" />,
  delayed: <AlertTriangle className="w-4 h-4" />,
};

interface TrackingTimelineProps {
  events: StatusEvent[];
}

const TrackingTimeline = ({ events }: TrackingTimelineProps) => {
  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isLast ? "gradient-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {statusIcons[event.status] || <Clock className="w-4 h-4" />}
              </div>
              {!isLast && <div className="w-px h-full min-h-[24px] bg-border" />}
            </div>
            <div className="pb-4">
              <p className="font-medium text-sm">{event.description}</p>
              <p className="text-xs text-muted-foreground">{event.location} • {new Date(event.date).toLocaleString("fr-FR")}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackingTimeline;
