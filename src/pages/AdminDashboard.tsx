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
import { Package, BarChart3, Clock, AlertTriangle, Plus } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Administration</h1>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="accent">
                <Plus className="w-4 h-4 mr-2" />
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
                  Create Tracking
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Package className="w-6 h-6 text-cyan-500" />
            </div>
            <p className="text-2xl font-display font-bold mt-2">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total Trackings</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <BarChart3 className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-display font-bold mt-2">{deliveryRate}%</p>
            <p className="text-xs text-muted-foreground">Delivery Rate</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-display font-bold mt-2">{stats?.deliveryRate ?? 0}%</p>
            <p className="text-xs text-muted-foreground">On Time</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-2xl font-display font-bold mt-2">{disputesOpen}</p>
            <p className="text-xs text-muted-foreground">Open Disputes</p>
          </Card>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="trackings">Trackings</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="font-display font-semibold mb-4">Daily Volume</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="colis" name="Packages" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-semibold mb-4">Status Distribution</h3>
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trackings">
            <Card>
              <div className="p-4 border-b border-border">
                <h2 className="font-display font-semibold">
                  All Trackings ({trackings.length})
                </h2>
              </div>
              <div className="divide-y divide-border">
                {trackings.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/admin/trackings/${t.id}`)}
                  >
                    <div>
                      <p className="font-medium text-sm">{t.clientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.trackingNumber}
                        {t.originAddress && t.destinationAddress
                          ? ` • ${t.originAddress} → ${t.destinationAddress}`
                          : ""}
                      </p>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-display font-semibold">Global Map</h2>
              </div>
              <div className="h-[400px]">
                <TrackingMap items={trackings} showRoute={false} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-semibold">
                  Notification History ({notifLog?.pagination.total ?? 0})
                </h2>
                <Button variant="outline" size="sm" onClick={() => refetchNotifs()}>
                  Refresh
                </Button>
              </div>
              <div className="divide-y divide-border">
                {(notifLog?.data ?? []).map((n) => (
                  <div key={n.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{n.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {n.recipientEmail} • {new Date(n.sentAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <Badge variant="outline">{n.type}</Badge>
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
