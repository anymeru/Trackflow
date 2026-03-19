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
        <h1 className="font-display text-2xl font-bold">Mon profil</h1>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-accent" /> Informations personnelles
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input defaultValue="Jean Dupont" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="jean@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input defaultValue="+33 6 12 34 56 78" type="tel" />
            </div>
          </div>
          <Button variant="accent" size="sm">Sauvegarder</Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" /> Notifications
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Notifications par email</span>
              </div>
              <Switch checked={notifications.email} onCheckedChange={(v) => setNotifications({ ...notifications, email: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Notifications SMS</span>
              </div>
              <Switch checked={notifications.sms} onCheckedChange={(v) => setNotifications({ ...notifications, sms: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Notifications web</span>
              </div>
              <Switch checked={notifications.web} onCheckedChange={(v) => setNotifications({ ...notifications, web: v })} />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" /> Sécurité
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mot de passe actuel</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Confirmer</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button variant="accent" size="sm">Changer le mot de passe</Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
