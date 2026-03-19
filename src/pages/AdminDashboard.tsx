import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/tracking/StatusBadge";
import TrackingMap from "@/components/tracking/TrackingMap";
import { mockTrackings, mockUsers, mockConversations } from "@/data/mockData";
import { Users, Package, MessageSquare, BarChart3, Shield, UserX } from "lucide-react";

const AdminDashboard = () => {
  const roleColors: Record<string, string> = {
    client: "bg-info text-info-foreground",
    operator: "bg-accent text-accent-foreground",
    admin: "bg-primary text-primary-foreground",
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 space-y-6">
        <h1 className="font-display text-2xl font-bold">Administration</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-4">
            <Users className="w-8 h-8 text-info" />
            <div>
              <p className="text-2xl font-display font-bold">{mockUsers.length}</p>
              <p className="text-xs text-muted-foreground">Utilisateurs</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <Package className="w-8 h-8 text-accent" />
            <div>
              <p className="text-2xl font-display font-bold">{mockTrackings.length}</p>
              <p className="text-xs text-muted-foreground">Trackings</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <BarChart3 className="w-8 h-8 text-success" />
            <div>
              <p className="text-2xl font-display font-bold">
                {mockTrackings.filter((t) => t.status === "delivered").length}
              </p>
              <p className="text-xs text-muted-foreground">Livrés</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <MessageSquare className="w-8 h-8 text-warning" />
            <div>
              <p className="text-2xl font-display font-bold">{mockConversations.length}</p>
              <p className="text-xs text-muted-foreground">Conversations</p>
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold">Carte globale</h2>
          </div>
          <div className="h-[300px]">
            <TrackingMap items={mockTrackings} />
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Users */}
          <Card>
            <div className="p-4 border-b border-border">
              <h2 className="font-display font-semibold">Utilisateurs</h2>
            </div>
            <div className="divide-y divide-border">
              {mockUsers.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${roleColors[u.role]} border-0 text-xs`}>{u.role}</Badge>
                    <Button variant="ghost" size="sm">
                      {u.active ? <Shield className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trackings */}
          <Card>
            <div className="p-4 border-b border-border">
              <h2 className="font-display font-semibold">Trackings récents</h2>
            </div>
            <div className="divide-y divide-border">
              {mockTrackings.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.trackingNumber}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
