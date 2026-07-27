import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/tracking/StatusBadge";
import StatusChanger from "@/components/operator/StatusChanger";
import OperatorFilters from "@/components/operator/OperatorFilters";
import TrackingMap from "@/components/tracking/TrackingMap";
import { getTrackings } from "@/api/trackings";
import { getConversations } from "@/api/conversations";
import { Package, MessageSquare, AlertTriangle, Eye, ChevronDown, ChevronUp, Flame, Clock, ShieldAlert, Activity, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PriorityLevel = "critical" | "at_risk" | "normal";

const CRITICAL_STATUSES = ["lost", "delayed"];
const AT_RISK_STATUSES = ["fees_pending", "customs_hold"];

const getPriority = (status: string): PriorityLevel => {
  if (CRITICAL_STATUSES.includes(status)) return "critical";
  if (AT_RISK_STATUSES.includes(status)) return "at_risk";
  return "normal";
};

const priorityConfig: Record<PriorityLevel, { label: string; color: string; icon: typeof Flame }> = {
  critical: { label: "Critical", color: "bg-destructive text-destructive-foreground", icon: Flame },
  at_risk: { label: "At Risk", color: "bg-warning text-warning-foreground", icon: ShieldAlert },
  normal: { label: "Normal", color: "bg-muted text-muted-foreground", icon: Clock },
};

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const { data: trackings = [] } = useQuery({
    queryKey: ["operator-trackings"],
    queryFn: () => getTrackings(),
    refetchInterval: 10000,
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    refetchInterval: 10000,
  });

  const carriers = useMemo(() => {
    const refs = trackings.map((t) => t.carrierRef).filter(Boolean) as string[];
    return [...new Set(refs)];
  }, [trackings]);

  const filteredTrackings = useMemo(() => {
    return trackings.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (carrierFilter !== "all" && t.carrierRef !== carrierFilter) return false;
      if (priorityFilter !== "all" && getPriority(t.status) !== priorityFilter) return false;
      return true;
    });
  }, [trackings, statusFilter, carrierFilter, priorityFilter]);

  const sortedTrackings = useMemo(() => {
    const order: Record<PriorityLevel, number> = { critical: 0, at_risk: 1, normal: 2 };
    return [...filteredTrackings].sort((a, b) => order[getPriority(a.status)] - order[getPriority(b.status)]);
  }, [filteredTrackings]);

  const activeCount = trackings.filter((t) => t.status !== "delivered").length;
  const openConversations = conversations.filter((c) => c.status !== "resolved").length;
  const delayedCount = trackings.filter((t) => t.status === "delayed").length;
  const criticalCount = trackings.filter((t) => getPriority(t.status) === "critical").length;
  const atRiskCount = trackings.filter((t) => getPriority(t.status) === "at_risk").length;

  return (
    <DashboardLayout role="operator">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Operations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage active shipments and client support</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="p-4 bg-card border-border/50 hover:border-accent/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#00b4d8]/10 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-[#00b4d8]" />
              </div>
              <div>
                <p className="text-xl font-display font-bold tracking-tight">{activeCount}</p>
                <p className="text-[11px] text-muted-foreground">Active</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-card border-border/50 hover:border-accent/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#4ecdc4]/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-[#4ecdc4]" />
              </div>
              <div>
                <p className="text-xl font-display font-bold tracking-tight">{openConversations}</p>
                <p className="text-[11px] text-muted-foreground">Conversations</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-card border-border/50 hover:border-destructive/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ff6b6b]/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-[#ff6b6b]" />
              </div>
              <div>
                <p className="text-xl font-display font-bold tracking-tight">{delayedCount}</p>
                <p className="text-[11px] text-muted-foreground">Delayed</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-card border-border/50 border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ff6b6b]/15 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-[#ff6b6b]" />
              </div>
              <div>
                <p className="text-xl font-display font-bold tracking-tight">{criticalCount}</p>
                <p className="text-[11px] text-muted-foreground">Critical</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-card border-border/50 border-warning/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-xl font-display font-bold tracking-tight">{atRiskCount}</p>
                <p className="text-[11px] text-muted-foreground">At Risk</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="border-border/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
              <h2 className="font-display font-semibold text-sm">Live Map</h2>
            </div>
          </div>
          <div className="h-[300px]">
            <TrackingMap items={filteredTrackings} onSelect={(id) => navigate(`/dashboard/tracking/${id}`)} />
          </div>
        </Card>

        {/* Tracking list */}
        <Card className="border-border/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
              <h2 className="font-display font-semibold text-sm">All Items</h2>
              <span className="text-xs text-muted-foreground">({sortedTrackings.length})</span>
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
          <div className="divide-y divide-border/30">
            {sortedTrackings.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No trackings match the selected filters.
              </div>
            )}
            {sortedTrackings.map((t) => {
              const priority = getPriority(t.status);
              const pConf = priorityConfig[priority];
              const PIcon = pConf.icon;
              return (
                <div key={t.id}>
                  <div className="px-5 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        priority === "critical" ? "bg-[#ff6b6b]" : priority === "at_risk" ? "bg-warning" : "bg-border"
                      }`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.clientName}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.trackingNumber} {t.carrierRef ? `· ${t.carrierRef}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <Badge className={`${pConf.color} border-0 text-[10px]`}>{pConf.label}</Badge>
                      <StatusBadge status={t.status} />
                      <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === t.id ? null : t.id)} className="text-muted-foreground hover:text-foreground">
                        {expandedId === t.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/tracking/${t.id}`)} className="text-muted-foreground hover:text-foreground">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {expandedId === t.id && (
                    <div className="px-5 pb-4 pt-1">
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
