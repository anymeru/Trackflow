import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone, Bell, Lock } from "lucide-react";
import { useState } from "react";

const ProfilePage = () => {
  const [notifications, setNotifications] = useState({ email: true, sms: false, web: true });

  return (
    <DashboardLayout role="client">
      <div className="p-6 max-w-2xl space-y-6">
        <h1 className="font-display text-2xl font-bold">My Profile</h1>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-accent" /> Personal Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="jean@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue="+33 6 12 34 56 78" type="tel" />
            </div>
          </div>
          <Button variant="accent" size="sm">Save</Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" /> Notification Preferences
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Email notifications</span>
              </div>
              <Switch checked={notifications.email} onCheckedChange={(v) => setNotifications({ ...notifications, email: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">SMS notifications</span>
              </div>
              <Switch checked={notifications.sms} onCheckedChange={(v) => setNotifications({ ...notifications, sms: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Browser notifications</span>
              </div>
              <Switch checked={notifications.web} onCheckedChange={(v) => setNotifications({ ...notifications, web: v })} />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" /> Security
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>New password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Confirm</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button variant="accent" size="sm">Change password</Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
