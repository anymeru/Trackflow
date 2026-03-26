import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/tracking/StatusBadge";
import StatusChanger from "@/components/operator/StatusChanger";
import OperatorFilters from "@/components/operator/OperatorFilters";
import TrackingMap from "@/components/tracking/TrackingMap";
import { mockTrackings, mockConversations, mockIncidents } from "@/data/mockData";
import { Package, MessageSquare, AlertTriangle, Eye, ChevronDown, ChevronUp, Flame, Clock, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PriorityLevel = "critical" | "at_risk" | "normal";

const getPriority = (t: typeof mockTrackings[0]): PriorityLevel => {
  if (t.status === "lost" || t.status === "delayed") return "critical";
  if (t.status === "fees_pending" || t.status === "customs_hold") return "at_risk";
  const hasIncident = mockIncidents.some((i) => i.trackingId === t.id && i.status !== "closed");
  if (hasIncident) return "at_risk";
  return "normal";
};

const priorityConfig: Record<PriorityLevel, { label: string; color: string; icon: typeof Flame }> = {
  critical: { label: "Critique", color: "bg-destructive text-destructive-foreground", icon: Flame },
  at_risk: { label: "À risque", color: "bg-warning text-warning-foreground", icon: ShieldAlert },
  normal: { label: "Normal", color: "bg-muted text-muted-foreground", icon: Clock },
};

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const carriers = useMemo(() => [...new Set(mockTrackings.map((t) => t.carrier))], []);

  const filteredTrackings = useMemo(() => {
    return mockTrackings.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (carrierFilter !== "all" && t.carrier !== carrierFilter) return false;
      if (priorityFilter !== "all" && getPriority(t) !== priorityFilter) return false;
      return true;
    });
  }, [statusFilter, carrierFilter, priorityFilter]);

  // Sort: critical first, then at_risk, then normal
  const sortedTrackings = useMemo(() => {
    const order: Record<PriorityLevel, number> = { critical: 0, at_risk: 1, normal: 2 };
    return [...filteredTrackings].sort((a, b) => order[getPriority(a)] - order[getPriority(b)]);
  }, [filteredTrackings]);

  const activeCount = mockTrackings.filter((t) => t.status !== "delivered").length;
  const openConversations = mockConversations.filter((c) => c.status !== "resolved").length;
  const delayedCount = mockTrackings.filter((t) => t.status === "delayed").length;
  const criticalCount = mockTrackings.filter((t) => getPriority(t) === "critical").length;
  const atRiskCount = mockTrackings.filter((t) => getPriority(t) === "at_risk").length;

  return (
    <DashboardLayout role="operator">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h1 className="font-display text-2xl font-bold">Espace Opérateur</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="p-4 flex items-center gap-3">
            <Package className="w-7 h-7 text-accent" />
            <div>
              <p className="text-xl font-display font-bold">{activeCount}</p>
              <p className="text-[11px] text-muted-foreground">Actifs</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-info" />
            <div>
              <p className="text-xl font-display font-bold">{openConversations}</p>
              <p className="text-[11px] text-muted-foreground">Conversations</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-destructive" />
            <div>
              <p className="text-xl font-display font-bold">{delayedCount}</p>
              <p className="text-[11px] text-muted-foreground">En retard</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3 border-destructive/30">
            <Flame className="w-7 h-7 text-destructive" />
            <div>
              <p className="text-xl font-display font-bold">{criticalCount}</p>
              <p className="text-[11px] text-muted-foreground">Critiques</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3 border-warning/30">
            <ShieldAlert className="w-7 h-7 text-warning" />
            <div>
              <p className="text-xl font-display font-bold">{atRiskCount}</p>
              <p className="text-[11px] text-muted-foreground">À risque</p>
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold">Carte globale</h2>
          </div>
          <div className="h-[350px]">
            <TrackingMap items={filteredTrackings} onSelect={(id) => navigate(`/dashboard/tracking/${id}`)} />
          </div>
        </Card>

        {/* Filters + List */}
        <Card>
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">
                Tous les objets ({sortedTrackings.length})
              </h2>
            </div>
            <OperatorFilters
              statusFilter={statusFilter}
              carrierFilter={carrierFilter}
              priorityFilter={priorityFilter}
              onStatusChange={setStatusFilter}
              onCarrierChange={setCarrierFilter}
              onPriorityChange={setPriorityFilter}
              onReset={() => { setStatusFilter("all"); setCarrierFilter("all"); setPriorityFilter("all"); }}
              carriers={carriers}
            />
          </div>
          <div className="divide-y divide-border">
            {sortedTrackings.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Aucun tracking ne correspond aux filtres sélectionnés.
              </div>
            )}
            {sortedTrackings.map((t) => {
              const priority = getPriority(t);
              const pConf = priorityConfig[priority];
              const PIcon = pConf.icon;
              return (
                <div key={t.id}>
                  <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <PIcon className={`w-4 h-4 ${priority === "critical" ? "text-destructive" : priority === "at_risk" ? "text-warning" : "text-muted-foreground"}`} />
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.trackingNumber} • {t.carrier}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${pConf.color} border-0 text-[10px]`}>{pConf.label}</Badge>
                      <StatusBadge status={t.status} />
                      <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}>
                        {expandedId === t.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/tracking/${t.id}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {expandedId === t.id && (
                    <div className="px-4 pb-4">
                      <StatusChanger currentStatus={t.status} trackingNumber={t.trackingNumber} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OperatorDashboard;
