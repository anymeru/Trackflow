import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, CheckCircle, Pause } from "lucide-react";

interface ETABlockProps {
  eta: string | null;
  status: string;
  progressPercent?: number;
  originAddress?: string;
  destinationAddress?: string;
}

const STATUS_LABELS: Record<string, string> = {
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  delayed: "Delayed",
  customs_hold: "Customs Hold",
  fees_pending: "Fees Pending",
  returned: "Returned",
  lost: "Lost",
};

const FREEZE_STATUSES = ["delayed", "customs_hold", "fees_pending"];
const TERMINAL_STATUSES = ["delivered", "returned", "lost"];

const ETABlock = ({
  eta,
  status,
  progressPercent = 0,
  originAddress,
  destinationAddress,
}: ETABlockProps) => {
  const isFreeze = FREEZE_STATUSES.includes(status);
  const isTerminal = TERMINAL_STATUSES.includes(status);
  const isDelivered = status === "delivered";
  const isLost = status === "lost";
  const isReturned = status === "returned";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRemaining = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const etaDate = new Date(dateStr);
    const now = new Date();
    const diff = etaDate.getTime() - now.getTime();
    if (diff <= 0) return "Delayed";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}j ${hours % 24}h`;
    if (hours > 0) return `${hours}h`;
    return "< 1h";
  };

  if (isLost) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">Package Lost</span>
        </div>
        <p className="text-sm text-muted-foreground">Please contact support.</p>
      </div>
    );
  }

  if (isReturned) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-purple-500">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">Return to Sender</span>
        </div>
        <p className="text-sm text-muted-foreground">The package has been returned.</p>
      </div>
    );
  }

  if (isDelivered) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Delivered</span>
        </div>
        {eta && (
          <p className="text-sm text-muted-foreground">
            Delivered on {formatDate(eta)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isFreeze ? (
            <Pause className="w-4 h-4 text-amber-500" />
          ) : (
            <Clock className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">
            {isFreeze ? "Pending" : "Estimated Arrival"}
          </span>
        </div>
        {isFreeze && (
          <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Suspended
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-display font-bold ${
          isFreeze ? "text-amber-500" : "text-foreground"
        }`}>
          {isFreeze ? "—" : formatRemaining(eta)}
        </span>
        {eta && !isFreeze && (
          <span className="text-sm text-muted-foreground">
            {formatDate(eta)}
          </span>
        )}
        {isFreeze && eta && (
          <span className="text-sm text-muted-foreground">
            Frozen at {formatDate(eta)}
          </span>
        )}
      </div>

      {!isFreeze && (
        <Progress value={progressPercent} className="h-2" />
      )}
      {isFreeze && (
        <Progress value={progressPercent} className="h-2 opacity-50" />
      )}

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{originAddress?.split(",")[0] || "Origin"}</span>
        <span>{isFreeze ? "⏸ Suspended" : `${Math.round(progressPercent)}%`}</span>
        <span>{destinationAddress?.split(",")[0] || "Destination"}</span>
      </div>
    </div>
  );
};

export default ETABlock;
