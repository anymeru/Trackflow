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
import { getTrackings } from "@/api/trackings";
import { Package, Search, Eye, ArrowUpDown } from "lucide-react";

export default function ClientTrackingsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"createdAt" | "updatedAt" | "status">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data: trackings = [] } = useQuery({
    queryKey: ["my-trackings"],
    queryFn: () => getTrackings(),
    refetchInterval: 10000,
  });

  const filtered = trackings.filter((t) => {
    const matchSearch =
      t.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (t.originAddress?.toLowerCase().includes(search.toLowerCase())) ||
      (t.destinationAddress?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal as string) : Number(aVal) - Number(bVal);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const stats = {
    total: trackings.length,
    inTransit: trackings.filter((t) => t.status === "in_transit" || t.status === "out_for_delivery").length,
    delivered: trackings.filter((t) => t.status === "delivered").length,
    attention: trackings.filter((t) =>
      ["delayed", "customs_hold", "fees_pending"].includes(t.status)
    ).length,
  };

  return (
    <DashboardLayout role="client">
      <div className="p-6 space-y-6">
        <h1 className="font-display text-2xl font-bold">My Trackings</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-2xl font-display font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </Card>
          <Card className="p-4">
            <p className="text-2xl font-display font-bold text-cyan-500">{stats.inTransit}</p>
            <p className="text-xs text-muted-foreground">In Transit</p>
          </Card>
          <Card className="p-4">
            <p className="text-2xl font-display font-bold text-green-500">{stats.delivered}</p>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </Card>
          <Card className="p-4">
            <p className="text-2xl font-display font-bold text-destructive">{stats.attention}</p>
            <p className="text-xs text-muted-foreground">Attention</p>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
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

        <Card>
          <div className="divide-y divide-border">
            {sorted.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No trackings found</p>
              </div>
            )}
            {sorted.map((t) => (
              <div
                key={t.id}
                className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/dashboard/tracking/${t.id}`)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{t.clientName}</p>
                    <span className="text-xs text-muted-foreground font-mono">{t.trackingNumber}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {t.originAddress || ""}{t.originAddress && t.destinationAddress ? " → " : ""}{t.destinationAddress || ""}
                    {t.eta && ` • ETA: ${new Date(t.eta).toLocaleDateString("fr-FR")}`}
                  </p>
                  {t.weight && (
                    <p className="text-xs text-muted-foreground mt-0.5">{t.weight} kg</p>
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
      </div>
    </DashboardLayout>
  );
}
