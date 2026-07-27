import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
  critical: { label: "Critical", color: "bg-red-400 text-white", icon: Flame },
  at_risk: { label: "At Risk", color: "bg-gray-700 text-white", icon: ShieldAlert },
  normal: { label: "Normal", color: "bg-black/5 text-gray-500", icon: Clock },
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
          <p className="text-sm text-gray-500 mt-0.5">Manage active shipments and client support</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-[1px] rounded-[2rem] bg-black/[0.03] hover:bg-black/5 transition-all duration-500 ease-out-expo">
            <div className="rounded-[calc(2rem-1px)] bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold tracking-tight">{activeCount}</p>
                  <p className="text-[11px] text-gray-500">Active</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-[1px] rounded-[2rem] bg-black/[0.03] hover:bg-black/5 transition-all duration-500 ease-out-expo">
            <div className="rounded-[calc(2rem-1px)] bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold tracking-tight">{openConversations}</p>
                  <p className="text-[11px] text-gray-500">Conversations</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-[1px] rounded-[2rem] bg-black/[0.03] hover:bg-black/5 transition-all duration-500 ease-out-expo">
            <div className="rounded-[calc(2rem-1px)] bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold tracking-tight">{delayedCount}</p>
                  <p className="text-[11px] text-gray-500">Delayed</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-[1px] rounded-[2rem] bg-black/[0.03] hover:bg-black/5 transition-all duration-500 ease-out-expo">
            <div className="rounded-[calc(2rem-1px)] bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold tracking-tight">{criticalCount}</p>
                  <p className="text-[11px] text-gray-500">Critical</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-[1px] rounded-[2rem] bg-black/[0.03] hover:bg-black/5 transition-all duration-500 ease-out-expo">
            <div className="rounded-[calc(2rem-1px)] bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold tracking-tight">{atRiskCount}</p>
                  <p className="text-[11px] text-gray-500">At Risk</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-white">
            <div className="px-5 py-4 border-b border-black/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                <h2 className="font-display font-semibold text-sm tracking-tight">Live Map</h2>
              </div>
            </div>
            <div className="h-[300px]">
              <TrackingMap items={filteredTrackings} onSelect={(id) => navigate(`/dashboard/tracking/${id}`)} />
            </div>
          </div>
        </div>

        {/* Tracking list */}
        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-white">
            <div className="px-5 py-4 border-b border-black/[0.04] space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                <h2 className="font-display font-semibold text-sm tracking-tight">All Items</h2>
                <span className="text-xs text-gray-500">({sortedTrackings.length})</span>
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
            <div className="divide-y divide-black/[0.04]">
              {sortedTrackings.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No trackings match the selected filters.
                </div>
              )}
              {sortedTrackings.map((t) => {
                const priority = getPriority(t.status);
                const pConf = priorityConfig[priority];
                const PIcon = pConf.icon;
                return (
                  <div key={t.id}>
                    <div className="px-5 py-3 flex items-center justify-between hover:bg-black/5 transition-all duration-500 ease-out-expo">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          priority === "critical" ? "bg-red-400" : priority === "at_risk" ? "bg-gray-700" : "bg-black/5"
                        }`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{t.clientName}</p>
                          <p className="text-xs text-gray-500 truncate">{t.trackingNumber} {t.carrierRef ? `· ${t.carrierRef}` : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <Badge className={`${pConf.color} border-0 text-[10px]`}>{pConf.label}</Badge>
                        <StatusBadge status={t.status} />
                        <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === t.id ? null : t.id)} className="text-gray-500 hover:text-foreground rounded-full">
                          {expandedId === t.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/tracking/${t.id}`)} className="text-gray-500 hover:text-foreground rounded-full">
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OperatorDashboard;
