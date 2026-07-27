import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import type { Tracking } from "@/api/trackings";

interface ClientStatsBarProps {
  trackings: Tracking[];
}

const ClientStatsBar = ({ trackings }: ClientStatsBarProps) => {
  const delivered = trackings.filter((t) => t.status === "delivered");
  const total = trackings.length;
  const deliveryRate = total > 0 ? Math.round((delivered.length / total) * 100) : 0;

  const avgDays = delivered.length > 0
    ? Math.round(
        delivered.reduce((sum, t) => {
          const created = new Date(t.createdAt).getTime();
          const eta = t.eta ? new Date(t.eta).getTime() : Date.now();
          return sum + (eta - created) / (1000 * 60 * 60 * 24);
        }, 0) / delivered.length
      )
    : 0;

  const delayedCount = trackings.filter((t) =>
    ["delayed", "customs_hold", "fees_pending"].includes(t.status)
  ).length;
  const incidentRate = total > 0 ? Math.round((delayedCount / total) * 100) : 0;

  const stats = [
    { label: "Delivery Rate", value: `${deliveryRate}%`, icon: CheckCircle, color: "text-success" },
    { label: "Avg. Delivery Time", value: `${avgDays}d`, icon: Clock, color: "text-info" },
    { label: "Delay Rate", value: `${incidentRate}%`, icon: AlertTriangle, color: "text-destructive" },
    { label: "Reliability Score", value: `${Math.max(0, 100 - incidentRate)}%`, icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <Card key={i} className="p-3 flex items-center gap-3">
          <s.icon className={`w-5 h-5 ${s.color}`} />
          <div>
            <p className="text-lg font-display font-bold">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ClientStatsBar;
