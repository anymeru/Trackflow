import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/tracking/StatusBadge";
import TrackingMap from "@/components/tracking/TrackingMap";
import { mockTrackings, mockConversations } from "@/data/mockData";
import { Package, MessageSquare, AlertTriangle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const activeTrackings = mockTrackings.filter((t) => t.status !== "delivered");
  const openConversations = mockConversations.filter((c) => c.status !== "resolved");

  return (
    <DashboardLayout role="operator">
      <div className="p-6 space-y-6">
        <h1 className="font-display text-2xl font-bold">Espace Opérateur</h1>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-4">
            <Package className="w-8 h-8 text-accent" />
            <div>
              <p className="text-2xl font-display font-bold">{activeTrackings.length}</p>
              <p className="text-xs text-muted-foreground">Objets actifs</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <MessageSquare className="w-8 h-8 text-info" />
            <div>
              <p className="text-2xl font-display font-bold">{openConversations.length}</p>
              <p className="text-xs text-muted-foreground">Conversations ouvertes</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-2xl font-display font-bold">{mockTrackings.filter((t) => t.status === "delayed").length}</p>
              <p className="text-xs text-muted-foreground">En retard</p>
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold">Carte globale</h2>
          </div>
          <div className="h-[350px]">
            <TrackingMap items={mockTrackings} onSelect={(id) => navigate(`/dashboard/tracking/${id}`)} />
          </div>
        </Card>

        <Card>
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold">Tous les objets actifs</h2>
          </div>
          <div className="divide-y divide-border">
            {mockTrackings.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.trackingNumber} • {t.carrier}</p>
                </div>
                <div className="flex items-center gap-3">
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

export default OperatorDashboard;
