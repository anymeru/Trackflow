import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/tracking/StatusBadge";
import TrackingMap from "@/components/tracking/TrackingMap";
import { getTrackings, createTracking } from "@/api/trackings";
import { getNotificationLog, getStats, DashboardStats } from "@/api/notifications";
import { Package, BarChart3, Clock, AlertTriangle, Plus, Route, Activity, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  delayed: "Delayed",
  customs_hold: "Customs Hold",
  fees_pending: "Fees Pending",
  returned: "Returned",
  lost: "Lost",
};

const PIE_COLORS = [
  "#06B6D4",
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#F97316",
  "#D97706",
  "#8B5CF6",
  "#EF4444",
];

interface AdminDashboardProps {
  initialTab?: string;
}

export default function AdminDashboard({ initialTab = "analytics" }: AdminDashboardProps) {
  const [tab, setTab] = useState(initialTab === "notifications" ? "notifications" : "analytics");
  const navigate = useNavigate();

  const { data: trackings = [] } = useQuery({
    queryKey: ["trackings"],
    queryFn: () => getTrackings(),
    refetchInterval: 10000,
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getStats(),
  });

  const { data: notifLog, refetch: refetchNotifs } = useQuery({
    queryKey: ["notification-log"],
    queryFn: () => getNotificationLog(),
    enabled: tab === "notifications",
    refetchInterval: 10000,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    clientName: "",
    clientEmail: "",
    packageDescription: "",
    weight: "",
    originAddress: "",
    destinationAddress: "",
    avgSpeedKmh: "60",
  });

  const handleCreate = async () => {
    try {
      await createTracking({
        clientName: createForm.clientName,
        clientEmail: createForm.clientEmail,
        packageDescription: createForm.packageDescription || undefined,
        weight: createForm.weight ? parseFloat(createForm.weight) : undefined,
        originAddress: createForm.originAddress,
        destinationAddress: createForm.destinationAddress,
        avgSpeedKmh: parseFloat(createForm.avgSpeedKmh),
      });
      toast.success("Tracking created successfully");
      setCreateOpen(false);
      setCreateForm({
        clientName: "",
        clientEmail: "",
        packageDescription: "",
        weight: "",
        originAddress: "",
        destinationAddress: "",
        avgSpeedKmh: "60",
      });
    } catch (err) {
      toast.error("Error during creation");
    }
  };

  const statusCounts = trackings.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
  }));

  const volumeByDay = [
    { day: "Lun", colis: 12 }, { day: "Mar", colis: 18 },
    { day: "Mer", colis: 15 }, { day: "Jeu", colis: 22 },
    { day: "Ven", colis: 28 }, { day: "Sam", colis: 8 },
    { day: "Dim", colis: 4 },
  ];

  const totalCount = trackings.length;
  const deliveredCount = trackings.filter((t) => t.status === "delivered").length;
  const deliveryRate = totalCount > 0 ? Math.round((deliveredCount / totalCount) * 100) : 0;
  const disputesOpen = stats?.disputesOpen ?? 0;

  return (
    <DashboardLayout role="admin">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Administration</h1>
            <p className="text-sm text-muted-foreground mt-0.5">System overview and oversight</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="accent" className="gap-1.5">
                <Plus className="w-4 h-4" />
                Create Tracking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>New Tracking</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Client name</Label>
                  <Input value={createForm.clientName} onChange={(e) => setCreateForm({ ...createForm, clientName: e.target.value })} />
                </div>
                <div>
                  <Label>Client email</Label>
                  <Input type="email" value={createForm.clientEmail} onChange={(e) => setCreateForm({ ...createForm, clientEmail: e.target.value })} />
                </div>
                <div>
                  <Label>Package description</Label>
                  <Input value={createForm.packageDescription} onChange={(e) => setCreateForm({ ...createForm, packageDescription: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input type="number" value={createForm.weight} onChange={(e) => setCreateForm({ ...createForm, weight: e.target.value })} />
                  </div>
                  <div>
                    <Label>Speed (km/h)</Label>
                    <Input type="number" value={createForm.avgSpeedKmh} onChange={(e) => setCreateForm({ ...createForm, avgSpeedKmh: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Origin address</Label>
                  <Input value={createForm.originAddress} onChange={(e) => setCreateForm({ ...createForm, originAddress: e.target.value })} placeholder="Ex: Paris, France" />
                </div>
                <div>
                  <Label>Destination address</Label>
                  <Input value={createForm.destinationAddress} onChange={(e) => setCreateForm({ ...createForm, destinationAddress: e.target.value })} placeholder="Ex: Douala, Cameroun" />
                </div>
                <Button className="w-full" onClick={handleCreate} disabled={!createForm.clientName || !createForm.clientEmail || !createForm.originAddress || !createForm.destinationAddress}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tracking
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-card border-border/50 hover:border-accent/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#00b4d8]/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#00b4d8]" />
              </div>
              <span className="text-[10px] text-muted-foreground/50 tracking-wider uppercase">Total</span>
            </div>
            <p className="text-2xl font-display font-bold tracking-tight">{totalCount}</p>
            <div className="mt-1.5 w-8 h-0.5 rounded-full bg-[#00b4d8]/40" />
            <p className="text-xs text-muted-foreground mt-2">Active trackings</p>
          </Card>
          <Card className="p-5 bg-card border-border/50 hover:border-accent/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#4ecdc4]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#4ecdc4]" />
              </div>
              <span className="text-[10px] text-muted-foreground/50 tracking-wider uppercase">Rate</span>
            </div>
            <p className="text-2xl font-display font-bold tracking-tight">{deliveryRate}%</p>
            <div className="mt-1.5 w-8 h-0.5 rounded-full bg-[#4ecdc4]/40" />
            <p className="text-xs text-muted-foreground mt-2">Delivery rate</p>
          </Card>
          <Card className="p-5 bg-card border-border/50 hover:border-accent/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#00b4d8]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#00b4d8]" />
              </div>
              <span className="text-[10px] text-muted-foreground/50 tracking-wider uppercase">In transit</span>
            </div>
            <p className="text-2xl font-display font-bold tracking-tight">{trackings.filter((t) => t.status === "in_transit" || t.status === "out_for_delivery").length}</p>
            <div className="mt-1.5 w-8 h-0.5 rounded-full bg-[#00b4d8]/40" />
            <p className="text-xs text-muted-foreground mt-2">Currently moving</p>
          </Card>
          <Card className="p-5 bg-card border-border/50 hover:border-destructive/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#ff6b6b]/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#ff6b6b]" />
              </div>
              <span className="text-[10px] text-muted-foreground/50 tracking-wider uppercase">Issues</span>
            </div>
            <p className="text-2xl font-display font-bold tracking-tight">{disputesOpen}</p>
            <div className="mt-1.5 w-8 h-0.5 rounded-full bg-[#ff6b6b]/40" />
            <p className="text-xs text-muted-foreground mt-2">Open disputes</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="bg-muted/50 p-0.5 gap-0">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-card data-[state=active]:text-[#00b4d8] data-[state=active]:shadow-sm rounded-md mx-0.5">Analytics</TabsTrigger>
            <TabsTrigger value="trackings" className="data-[state=active]:bg-card data-[state=active]:text-[#00b4d8] data-[state=active]:shadow-sm rounded-md mx-0.5">Trackings</TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-card data-[state=active]:text-[#00b4d8] data-[state=active]:shadow-sm rounded-md mx-0.5">Map</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-card data-[state=active]:text-[#00b4d8] data-[state=active]:shadow-sm rounded-md mx-0.5">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-5 border-border/50">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                  <h3 className="font-display font-semibold text-sm">Daily Volume</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }}
                      />
                      <Bar dataKey="colis" name="Packages" fill="#00b4d8" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-5 border-border/50">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ecdc4]" />
                  <h3 className="font-display font-semibold text-sm">Status Distribution</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%" cy="50%"
                        innerRadius={50} outerRadius={90}
                        dataKey="value" nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={false}
                      >
                        {statusDistribution.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trackings">
            <Card className="border-border/50 overflow-hidden">
              <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                  <h2 className="font-display font-semibold text-sm">All Trackings</h2>
                  <span className="text-xs text-muted-foreground">({trackings.length})</span>
                </div>
              </div>
              <div className="divide-y divide-border/30">
                {trackings.length === 0 && (
                  <div className="p-8 text-center">
                    <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No trackings yet</p>
                  </div>
                )}
                {trackings.map((t, i) => (
                  <div
                    key={t.id}
                    className="px-5 py-3.5 flex items-center justify-between hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/trackings/${t.id}`)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col items-center gap-0.5 shrink-0">
                        <div className={`w-1.5 h-1.5 rounded-full ${i > 0 ? 'bg-border' : 'bg-[#00b4d8]'}`} />
                        {i < trackings.length - 1 && <div className="w-px h-4 bg-border/50" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.clientName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {t.trackingNumber}
                          {t.originAddress && t.destinationAddress
                            ? ` · ${t.originAddress} → ${t.destinationAddress}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card className="border-border/50 overflow-hidden">
              <div className="px-5 py-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                  <h2 className="font-display font-semibold text-sm">Global Map</h2>
                </div>
              </div>
              <div className="h-[400px]">
                <TrackingMap items={trackings} showRoute={false} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-border/50 overflow-hidden">
              <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                  <h2 className="font-display font-semibold text-sm">Notification History</h2>
                  <span className="text-xs text-muted-foreground">({notifLog?.pagination.total ?? 0})</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => refetchNotifs()} className="text-xs text-muted-foreground">
                  Refresh
                </Button>
              </div>
              <div className="divide-y divide-border/30">
                {(notifLog?.data ?? []).length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">No notifications sent yet</div>
                )}
                {(notifLog?.data ?? []).map((n) => (
                  <div key={n.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{n.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {n.recipientEmail} · {new Date(n.sentAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 ml-3 text-[10px] uppercase tracking-wider border-border/50">{n.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
