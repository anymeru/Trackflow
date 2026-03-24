import { Progress } from "@/components/ui/progress";
import { Clock, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import type { TrackingItem } from "@/data/mockData";

interface ETABlockProps {
  tracking: TrackingItem;
}

const confidenceConfig = {
  high: { label: "Fiable", color: "text-success", icon: CheckCircle },
  medium: { label: "Estimée", color: "text-warning", icon: TrendingUp },
  low: { label: "Incertaine", color: "text-destructive", icon: AlertTriangle },
};

const ETABlock = ({ tracking }: ETABlockProps) => {
  const eta = new Date(tracking.estimatedArrival);
  const now = new Date();
  const isDelivered = tracking.status === "delivered";
  const isOverdue = !isDelivered && eta < now;
  const confidence = tracking.etaConfidence || "medium";
  const conf = confidenceConfig[confidence];
  const ConfIcon = conf.icon;

  const formatETA = () => {
    if (isDelivered) return "Livré";
    const diff = eta.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (isOverdue) return "En retard";
    if (days > 0) return `${days}j ${hours % 24}h`;
    if (hours > 0) return `${hours}h`;
    return "< 1h";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Arrivée estimée</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ConfIcon className={`w-3.5 h-3.5 ${conf.color}`} />
          <span className={`text-xs ${conf.color}`}>{conf.label}</span>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-display font-bold ${isOverdue ? "text-destructive" : isDelivered ? "text-success" : "text-foreground"}`}>
          {formatETA()}
        </span>
        {!isDelivered && !isOverdue && (
          <span className="text-sm text-muted-foreground">
            {eta.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} à {eta.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      <Progress value={tracking.progressPercent || 0} className="h-2" />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{tracking.origin.split(",")[0]}</span>
        <span>{Math.round(tracking.progressPercent || 0)}%</span>
        <span>{tracking.destination.split(",")[0]}</span>
      </div>

      {tracking.etaDetails && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
          {tracking.etaDetails}
        </p>
      )}
    </div>
  );
};

export default ETABlock;
