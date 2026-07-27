import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/tracking/StatusBadge";
import TrackingMap from "@/components/tracking/TrackingMap";
import { getTrackings } from "@/api/trackings";
import { Package, Truck, CheckCircle, AlertTriangle, Eye, Search, Activity, MapPin } from "lucide-react";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: trackings = [] } = useQuery({
    queryKey: ["my-trackings"],
    queryFn: () => getTrackings(),
    refetchInterval: 10000,
  });

  const inTransit = trackings.filter((t) => t.status === "in_transit" || t.status === "out_for_delivery").length;
  const delivered = trackings.filter((t) => t.status === "delivered").length;
  const delayed = trackings.filter((t) =>
    ["delayed", "customs_hold", "fees_pending"].includes(t.status)
  ).length;

  const filtered = trackings.filter((t) => {
    const matchSearch =
      t.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (t.originAddress?.toLowerCase().includes(search.toLowerCase())) ||
      (t.destinationAddress?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout role="client">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your shipments at a glance</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-[1px] rounded-[2rem] bg-black/[0.03] hover:bg-black/5 transition-all duration-500 ease-out-expo">
            <div className="rounded-[calc(2rem-1px)] bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-[10px] text-gray-400 tracking-wider uppercase">Total</span>
              </div>
              <p className="text-2xl font-display font-bold tracking-tight">{trackings.length}</p>
              <div className="mt-1.5 w-8 h-0.5 rounded-full bg-black/5" />
              <p className="text-xs text-gray-500 mt-2">Shipments</p>
            </div>
          </div>
          <div className="p-[1px] rounded-[2rem] bg-black/[0.03] hover:bg-black/5 transition-all duration-500 ease-out-expo">
            <div className="rounded-[calc(2rem-1px)] bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-[10px] text-gray-400 tracking-wider uppercase">Active</span>
              </div>
              <p className="text-2xl font-display font-bold tracking-tight">{inTransit}</p>
              <div className="mt-1.5 w-8 h-0.5 rounded-full bg-black/5" />
              <p className="text-xs text-gray-500 mt-2">In transit</p>
            </div>
          </div>
          <div className="p-[1px] rounded-[2rem] bg-black/[0.03] hover:bg-black/5 transition-all duration-500 ease-out-expo">
            <div className="rounded-[calc(2rem-1px)] bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-[10px] text-gray-400 tracking-wider uppercase">Done</span>
              </div>
              <p className="text-2xl font-display font-bold tracking-tight">{delivered}</p>
              <div className="mt-1.5 w-8 h-0.5 rounded-full bg-black/5" />
              <p className="text-xs text-gray-500 mt-2">Delivered</p>
            </div>
          </div>
          <div className="p-[1px] rounded-[2rem] bg-black/[0.03] hover:bg-black/5 transition-all duration-500 ease-out-expo">
            <div className="rounded-[calc(2rem-1px)] bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-[10px] text-gray-400 tracking-wider uppercase">Alerts</span>
              </div>
              <p className="text-2xl font-display font-bold tracking-tight">{delayed}</p>
              <div className="mt-1.5 w-8 h-0.5 rounded-full bg-black/5" />
              <p className="text-xs text-gray-500 mt-2">Needs attention</p>
            </div>
          </div>
        </div>

        {/* Tracking list */}
        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-white">
            <div className="px-5 py-4 border-b border-black/[0.04] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <h2 className="font-display font-semibold text-sm tracking-tight">My Shipments</h2>
                  <span className="text-xs text-gray-500">({trackings.length})</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search by number, name, address..."
                    className="pl-9 rounded-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44 rounded-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="customs_hold">Customs Hold</SelectItem>
                    <SelectItem value="fees_pending">Fees Pending</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="divide-y divide-black/[0.04]">
              {filtered.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No packages found</p>
                </div>
              )}
              {filtered.map((t, i) => (
                <div
                  key={t.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-black/5 cursor-pointer transition-all duration-500 ease-out-expo"
                  onClick={() => navigate(`/dashboard/tracking/${t.id}`)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-gray-900' : 'bg-black/5'}`} />
                      {i < filtered.length - 1 && <div className="w-px h-4 bg-black/[0.04]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{t.clientName}</p>
                        <span className="text-xs text-gray-500 font-mono shrink-0">{t.trackingNumber}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        <MapPin className="w-3 h-3 inline mr-0.5" />
                        {t.originAddress || ""}{t.originAddress && t.destinationAddress ? " → " : ""}{t.destinationAddress || ""}
                        {t.eta ? ` · ETA: ${new Date(t.eta).toLocaleDateString("fr-FR")}` : ""}
                      </p>
                      {t.packageDescription && (
                        <p className="text-xs text-gray-500 mt-0.5">{t.packageDescription}{t.weight ? ` (${t.weight} kg)` : ""}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <StatusBadge status={t.status} />
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-foreground rounded-full">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        {filtered.length > 0 && (
          <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
            <div className="rounded-[calc(2rem-1px)] bg-white">
              <div className="px-5 py-4 border-b border-black/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <h2 className="font-display font-semibold text-sm tracking-tight">Map</h2>
                </div>
              </div>
              <div className="h-[300px]">
                <TrackingMap items={filtered} showRoute={false} />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
