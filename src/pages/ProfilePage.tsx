import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, changePassword } from "@/api/profile";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, phone: phone || undefined });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChanging(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed — you will need to log in again");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Failed to change password";
      toast.error(msg || "Failed to change password");
    } finally {
      setChanging(false);
    }
  };

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
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} type="email" disabled />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
            </div>
          </div>
          <Button variant="accent" size="sm" onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" /> Security
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current password</Label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>New password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Confirm</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <Button variant="accent" size="sm" onClick={handleChangePassword} disabled={changing || !currentPassword || !newPassword}>
            {changing ? "Changing..." : "Change password"}
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
