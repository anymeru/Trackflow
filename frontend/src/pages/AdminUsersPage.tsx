import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getUsers, updateUserRole, deleteUser, User } from "@/api/users";
import {
  Users,
  Search,
  Shield,
  UserCog,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Eye,
  MapPin,
} from "lucide-react";

const ROLE_BADGES: Record<string, string> = {
  admin: "bg-black/5 text-gray-600 border-0",
  operator: "bg-[#f59e0b]/10 text-warning border-0",
  client: "bg-black/5 text-gray-600 border-0",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  operator: "Operator",
  client: "Client",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Role updated");
      setEditOpen(false);
    },
    onError: () => toast.error("Error updating role"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
    },
    onError: () => toast.error("Error deleting user"),
  });

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Delete user "${user.name}" ?`)) {
      deleteMutation.mutate(user.id);
    }
  };

  const handleSaveRole = () => {
    if (selectedUser && editRole) {
      updateMutation.mutate({ id: selectedUser.id, role: editRole });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage administrators, operators, and clients</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40 rounded-full">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* User list */}
        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-white shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
            <div className="divide-y divide-black/[0.02]">
              {filtered.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <UserCog className="w-8 h-8 mx-auto mb-2 opacity-30 text-gray-500" />
                  <p className="text-sm">No users found</p>
                </div>
              )}
              {filtered.map((user) => (
                <div
                  key={user.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-black/5 transition-all duration-500 ease-out-expo cursor-pointer"
                  onClick={() => { setSelectedUser(user); setDetailOpen(true); }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0 ring-1 ring-black/[0.04]">
                      <span className="font-display font-bold text-xs text-gray-500">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <Badge className={ROLE_BADGES[user.role] || "bg-black/5 text-gray-500 border-0"}>
                      {ROLE_LABELS[user.role] || user.role}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleEdit(user); }}
                      title="Change role"
                      className="text-gray-500 hover:text-foreground rounded-full"
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleDelete(user); }}
                      className="text-gray-500 hover:text-destructive rounded-full"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center shrink-0 ring-1 ring-black/[0.04]">
                  <span className="font-display font-bold text-xl text-gray-500">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-display font-semibold text-lg">{selectedUser.name}</p>
                  <Badge
                    className={`${ROLE_BADGES[selectedUser.role] || "bg-black/5 text-gray-500"} border-0 mt-1`}
                  >
                    {ROLE_LABELS[selectedUser.role] || selectedUser.role}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="text-sm flex items-center gap-2 mt-0.5">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {selectedUser.email}
                  </p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <p className="text-sm flex items-center gap-2 mt-0.5">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {selectedUser.phone}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-gray-500">Registration date</Label>
                  <p className="text-sm flex items-center gap-2 mt-0.5">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {new Date(selectedUser.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
                {selectedUser._count !== undefined && (
                  <div>
                    <Label className="text-xs text-gray-500">Messages sent</Label>
                    <p className="text-sm flex items-center gap-2 mt-0.5">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      {selectedUser._count.messages} messages
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() => { setDetailOpen(false); handleEdit(selectedUser); }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Edit Role
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 rounded-full"
                  onClick={() => { setDetailOpen(false); handleDelete(selectedUser); }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">{selectedUser.name}</p>
                <p className="text-xs text-gray-500">{selectedUser.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <button
                onClick={handleSaveRole}
                disabled={editRole === selectedUser.role}
                className="w-full rounded-full bg-gray-900 text-white px-6 py-2.5 text-sm font-medium transition-all duration-700 ease-out-expo hover:bg-gray-800 active:scale-[0.97] disabled:opacity-50"
              >
                Save
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
