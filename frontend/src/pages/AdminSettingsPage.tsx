import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings, Bell, Shield, Globe, Clock, Save, Loader2 } from "lucide-react";
import { getSettings, updateSetting } from "@/api/settings";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    appName: "TRACE",
    supportEmail: "support@trace.tech",
    supportPhone: "+33 1 23 45 67 89",
    defaultAvgSpeed: "60",
    positionInterval: "30",
    enableNotifications: "true",
    enablePositionSimulation: "true",
    maintenanceMode: "false",
  });

  useEffect(() => {
    getSettings()
      .then((settings) => {
        setForm((prev) => ({ ...prev, ...settings }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(form)) {
        await updateSetting(key, value);
      }
      toast.success("Configuration saved");
    } catch {
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 max-w-2xl space-y-6">
        <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-700" />
          Settings
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
              <div className="rounded-[calc(2rem-1px)] bg-white p-6 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] space-y-4">
                <h2 className="font-display font-semibold tracking-tight flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-700" />
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
                      onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Phone</Label>
                    <Input
                      value={form.supportPhone}
                      onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
              <div className="rounded-[calc(2rem-1px)] bg-white p-6 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] space-y-4">
                <h2 className="font-display font-semibold tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-700" />
                  Simulation
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Speed (km/h)</Label>
                    <Input
                      type="number"
                      value={form.defaultAvgSpeed}
                      onChange={(e) => setForm({ ...form, defaultAvgSpeed: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position Interval (s)</Label>
                    <Input
                      type="number"
                      value={form.positionInterval}
                      onChange={(e) => setForm({ ...form, positionInterval: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
              <div className="rounded-[calc(2rem-1px)] bg-white p-6 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] space-y-4">
                <h2 className="font-display font-semibold tracking-tight flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-700" />
                  Notifications
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Notifications Enabled</p>
                      <p className="text-xs text-gray-500">Send emails on status changes</p>
                    </div>
                    <Switch
                      checked={form.enableNotifications === "true"}
                      onCheckedChange={(v) => setForm({ ...form, enableNotifications: String(v) })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Position Simulation</p>
                      <p className="text-xs text-gray-500">Automatically move packages along the route</p>
                    </div>
                    <Switch
                      checked={form.enablePositionSimulation === "true"}
                      onCheckedChange={(v) => setForm({ ...form, enablePositionSimulation: String(v) })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
              <div className="rounded-[calc(2rem-1px)] bg-white p-6 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] space-y-4">
                <h2 className="font-display font-semibold tracking-tight flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-700" />
                  Maintenance
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Maintenance Mode</p>
                    <p className="text-xs text-gray-500">Disable access for non-admin users</p>
                  </div>
                  <Switch
                    checked={form.maintenanceMode === "true"}
                    onCheckedChange={(v) => setForm({ ...form, maintenanceMode: String(v) })}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-full bg-gray-900 text-white px-6 py-2.5 text-sm font-medium transition-all duration-700 ease-out-expo hover:bg-gray-800 active:scale-[0.97] disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Configuration"}
            </button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
