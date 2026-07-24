import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
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
import AnimatedStatCard from "@/components/tracking/AnimatedStatCard";
import TrackingMap from "@/components/tracking/TrackingMap";
import { getTrackings } from "@/api/trackings";
import { Package, Truck, CheckCircle, AlertTriangle, Eye, Search } from "lucide-react";

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
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatedStatCard
            icon={<Package className="w-6 h-6" />}
            value={trackings.length}
            label="Total"
            iconColor="text-info"
            delay={0}
          />
          <AnimatedStatCard
            icon={<Truck className="w-6 h-6" />}
            value={inTransit}
            label="In Transit"
            iconColor="text-cyan-500"
            delay={0.1}
          />
          <AnimatedStatCard
            icon={<CheckCircle className="w-6 h-6" />}
            value={delivered}
            label="Delivered"
            iconColor="text-success"
            delay={0.2}
          />
          <AnimatedStatCard
            icon={<AlertTriangle className="w-6 h-6" />}
            value={delayed}
            label="Attention"
            iconColor="text-destructive"
            delay={0.3}
          />
        </div>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">My Packages ({trackings.length})</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by number, name, address..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44">
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
          <div className="divide-y divide-border">
            {filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No packages found</p>
              </div>
            )}
            {filtered.map((t) => (
              <div
                key={t.id}
                className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-all duration-300 hover:shadow-md border-l-4 border-l-transparent hover:border-l-accent"
                onClick={() => navigate(`/dashboard/tracking/${t.id}`)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{t.clientName}</p>
                    <span className="text-xs text-muted-foreground font-mono">{t.trackingNumber}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {t.originAddress || ""}{t.originAddress && t.destinationAddress ? " → " : ""}{t.destinationAddress || ""}
                    {t.eta ? ` • ETA: ${new Date(t.eta).toLocaleDateString("fr-FR")}` : ""}
                  </p>
                  {t.packageDescription && (
                    <p className="text-xs text-muted-foreground mt-0.5">{t.packageDescription}{t.weight ? ` (${t.weight} kg)` : ""}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <StatusBadge status={t.status} />
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {filtered.length > 0 && (
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-display font-semibold">Map</h2>
            </div>
            <div className="h-[300px]">
              <TrackingMap items={filtered} showRoute={false} />
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
