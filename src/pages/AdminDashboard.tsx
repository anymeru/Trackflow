import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/tracking/StatusBadge";
import TrackingMap from "@/components/tracking/TrackingMap";
import { mockTrackings, mockUsers, mockConversations, mockIncidents, statusLabels } from "@/data/mockData";
import { Users, Package, MessageSquare, BarChart3, Shield, UserX, TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const AdminDashboard = () => {
  const [period, setPeriod] = useState("month");

  const roleColors: Record<string, string> = {
    client: "bg-info text-info-foreground",
    operator: "bg-accent text-accent-foreground",
    admin: "bg-primary text-primary-foreground",
  };

  // Analytics data
  const deliveredCount = mockTrackings.filter((t) => t.status === "delivered").length;
  const delayedCount = mockTrackings.filter((t) => t.status === "delayed").length;
  const inTransitCount = mockTrackings.filter((t) => t.status === "in_transit").length;
  const totalCount = mockTrackings.length;
  const deliveryRate = Math.round((deliveredCount / totalCount) * 100);
  const onTimeRate = Math.round((deliveredCount / ((deliveredCount + delayedCount) || 1)) * 100);

  const statusDistribution = Object.entries(
    mockTrackings.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({ name: statusLabels[status] || status, value: count, status }));

  const carrierPerformance = Object.entries(
    mockTrackings.reduce((acc, t) => {
      if (!acc[t.carrier]) acc[t.carrier] = { total: 0, delivered: 0, delayed: 0 };
      acc[t.carrier].total++;
      if (t.status === "delivered") acc[t.carrier].delivered++;
      if (t.status === "delayed") acc[t.carrier].delayed++;
      return acc;
    }, {} as Record<string, { total: number; delivered: number; delayed: number }>)
  ).map(([carrier, data]) => ({
    carrier,
    total: data.total,
    delivered: data.delivered,
    delayed: data.delayed,
    rate: Math.round((data.delivered / data.total) * 100),
  }));

  const volumeByDay = [
    { day: "Lun", colis: 12, vehicules: 3 },
    { day: "Mar", colis: 18, vehicules: 5 },
    { day: "Mer", colis: 15, vehicules: 4 },
    { day: "Jeu", colis: 22, vehicules: 6 },
    { day: "Ven", colis: 28, vehicules: 8 },
    { day: "Sam", colis: 8, vehicules: 2 },
    { day: "Dim", colis: 4, vehicules: 1 },
  ];

  const deliveryTrend = [
    { month: "Jan", taux: 82 },
    { month: "Fév", taux: 85 },
    { month: "Mar", taux: 78 },
    { month: "Avr", taux: 88 },
    { month: "Mai", taux: 91 },
    { month: "Jun", taux: 87 },
  ];

  const PIE_COLORS = [
    "hsl(25, 95%, 53%)",   // accent
    "hsl(210, 80%, 55%)",  // info
    "hsl(152, 60%, 42%)",  // success
    "hsl(0, 84%, 60%)",    // destructive
    "hsl(38, 92%, 50%)",   // warning
    "hsl(220, 60%, 22%)",  // primary
  ];

  return (
    <DashboardLayout role="admin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Administration</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Package className="w-6 h-6 text-accent" />
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-2xl font-display font-bold mt-2">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Trackings totaux</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <BarChart3 className="w-6 h-6 text-success" />
              <span className="text-xs text-success font-medium">+{deliveryRate}%</span>
            </div>
            <p className="text-2xl font-display font-bold mt-2">{deliveryRate}%</p>
            <p className="text-xs text-muted-foreground">Taux de livraison</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="w-6 h-6 text-info" />
              <span className="text-xs text-info font-medium">{onTimeRate}%</span>
            </div>
            <p className="text-2xl font-display font-bold mt-2">{onTimeRate}%</p>
            <p className="text-xs text-muted-foreground">Livraison à l'heure</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <TrendingDown className="w-4 h-4 text-destructive" />
            </div>
            <p className="text-2xl font-display font-bold mt-2">{mockIncidents.length}</p>
            <p className="text-xs text-muted-foreground">Incidents ouverts</p>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="trackings">Trackings</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Volume par jour */}
              <Card className="p-5">
                <h3 className="font-display font-semibold mb-4">Volume par jour</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 88%)" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="colis" name="Colis" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="vehicules" name="Véhicules" fill="hsl(210, 80%, 55%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Distribution des statuts */}
              <Card className="p-5">
                <h3 className="font-display font-semibold mb-4">Distribution des statuts</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        dataKey="value"
                        nameKey="name"
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

              {/* Tendance livraison */}
              <Card className="p-5">
                <h3 className="font-display font-semibold mb-4">Tendance taux de livraison</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deliveryTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 88%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[70, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="taux" name="Taux (%)" stroke="hsl(152, 60%, 42%)" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Performance transporteurs */}
              <Card className="p-5">
                <h3 className="font-display font-semibold mb-4">Performance transporteurs</h3>
                <div className="space-y-3">
                  {carrierPerformance.map((c) => (
                    <div key={c.carrier} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{c.carrier}</p>
                        <p className="text-xs text-muted-foreground">{c.total} tracking{c.total > 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-success">{c.delivered} livrés</p>
                          {c.delayed > 0 && <p className="text-xs text-destructive">{c.delayed} retards</p>}
                        </div>
                        <Badge className={`border-0 ${c.rate >= 80 ? "bg-success text-success-foreground" : c.rate >= 50 ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}`}>
                          {c.rate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-semibold">Utilisateurs ({mockUsers.length})</h2>
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
          </TabsContent>

          <TabsContent value="trackings">
            <Card>
              <div className="p-4 border-b border-border">
                <h2 className="font-display font-semibold">Tous les trackings ({mockTrackings.length})</h2>
              </div>
              <div className="divide-y divide-border">
                {mockTrackings.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.trackingNumber} • {t.carrier}</p>
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
                <h2 className="font-display font-semibold">Carte globale</h2>
              </div>
              <div className="h-[400px]">
                <TrackingMap items={mockTrackings} />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
