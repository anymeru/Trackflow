import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Settings,
  Bell,
  Shield,
  Globe,
  Clock,
  Save,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    appName: "TrackFlow",
    supportEmail: "support@trackflow.com",
    supportPhone: "+33 1 23 45 67 89",
    defaultAvgSpeed: "60",
    positionInterval: "30",
    enableNotifications: true,
    enablePositionSimulation: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    toast.success("Configuration saved");
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 max-w-2xl space-y-6">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-accent" />
          Settings
        </h1>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            General Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Application Name</Label>
              <Input
                value={form.appName}
                onChange={(e) => setForm({ ...form, appName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input
                type="email"
                value={form.supportEmail}
                onChange={(e) =>
                  setForm({ ...form, supportEmail: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Support Phone</Label>
              <Input
                value={form.supportPhone}
                onChange={(e) =>
                  setForm({ ...form, supportPhone: e.target.value })
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Simulation
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Speed (km/h)</Label>
              <Input
                type="number"
                value={form.defaultAvgSpeed}
                onChange={(e) =>
                  setForm({ ...form, defaultAvgSpeed: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Position Interval (s)</Label>
              <Input
                type="number"
                value={form.positionInterval}
                onChange={(e) =>
                  setForm({ ...form, positionInterval: e.target.value })
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notifications Enabled</p>
                <p className="text-xs text-muted-foreground">
                  Send emails on status changes
                </p>
              </div>
              <Switch
                checked={form.enableNotifications}
                onCheckedChange={(v) =>
                  setForm({ ...form, enableNotifications: v })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Position Simulation</p>
                <p className="text-xs text-muted-foreground">
                  Automatically move packages along the route
                </p>
              </div>
              <Switch
                checked={form.enablePositionSimulation}
                onCheckedChange={(v) =>
                  setForm({ ...form, enablePositionSimulation: v })
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Maintenance
          </h2>
          <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">
                  Disable access for non-admin users
                </p>
            </div>
            <Switch
              checked={form.maintenanceMode}
              onCheckedChange={(v) =>
                setForm({ ...form, maintenanceMode: v })
              }
            />
          </div>
        </Card>

        <Button variant="accent" className="w-full" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </DashboardLayout>
  );
}
