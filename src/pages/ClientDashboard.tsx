import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/tracking/StatusBadge";
import TrackingMap from "@/components/tracking/TrackingMap";
import { mockTrackings } from "@/data/mockData";
import ClientStatsBar from "@/components/tracking/ClientStatsBar";
import { Package, Truck, CheckCircle, AlertTriangle, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const inTransit = mockTrackings.filter((t) => t.status === "in_transit").length;
  const delivered = mockTrackings.filter((t) => t.status === "delivered").length;
  const delayed = mockTrackings.filter((t) => t.status === "delayed").length;

  const stats = [
    { label: "Total", value: mockTrackings.length, icon: Package, color: "text-info" },
    { label: "En transit", value: inTransit, icon: Truck, color: "text-accent" },
    { label: "Livrés", value: delivered, icon: CheckCircle, color: "text-success" },
    { label: "En retard", value: delayed, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <DashboardLayout role="client">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground text-sm">Bienvenue, Jean Dupont</p>
          </div>
          <Button variant="accent" size="sm" onClick={() => navigate("/dashboard/trackings")}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un tracking
          </Button>
        </div>

        {/* Personal stats */}
        <ClientStatsBar />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4 flex items-center gap-4">
                <div className={`${s.color}`}>
                  <s.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Map */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold">Carte des objets suivis</h2>
          </div>
          <div className="h-[350px]">
            <TrackingMap
              items={mockTrackings}
              onSelect={(id) => navigate(`/dashboard/tracking/${id}`)}
            />
          </div>
        </Card>

        {/* Recent trackings */}
        <Card>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-semibold">Objets suivis</h2>
          </div>
          <div className="divide-y divide-border">
            {mockTrackings.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    {t.type === "vehicule" ? <Truck className="w-5 h-5 text-muted-foreground" /> : <Package className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{t.trackingNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <StatusBadge status={t.status} />
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/tracking/${t.id}`)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
