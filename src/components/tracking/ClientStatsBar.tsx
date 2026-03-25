import { Card } from "@/components/ui/card";
import { mockTrackings, mockIncidents } from "@/data/mockData";
import { TrendingUp, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const ClientStatsBar = () => {
  const delivered = mockTrackings.filter((t) => t.status === "delivered");
  const total = mockTrackings.length;
  const deliveryRate = total > 0 ? Math.round((delivered.length / total) * 100) : 0;

  // Average delivery time (mock calc based on created → delivered)
  const avgDays = delivered.length > 0
    ? Math.round(
        delivered.reduce((sum, t) => {
          const created = new Date(t.createdAt).getTime();
          const est = new Date(t.estimatedArrival).getTime();
          return sum + (est - created) / (1000 * 60 * 60 * 24);
        }, 0) / delivered.length
      )
    : 0;

  const incidentRate = total > 0 ? Math.round((mockIncidents.length / total) * 100) : 0;

  const stats = [
    { label: "Taux de livraison", value: `${deliveryRate}%`, icon: CheckCircle, color: "text-success" },
    { label: "Délai moyen", value: `${avgDays}j`, icon: Clock, color: "text-info" },
    { label: "Taux d'incidents", value: `${incidentRate}%`, icon: AlertTriangle, color: "text-destructive" },
    { label: "Score fiabilité", value: `${Math.max(0, 100 - incidentRate)}%`, icon: TrendingUp, color: "text-accent" },
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
