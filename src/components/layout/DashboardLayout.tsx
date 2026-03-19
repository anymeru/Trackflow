import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, MessageSquare, Users, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Map, Headphones, User
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "client" | "operator" | "admin";
}

const clientLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/dashboard/trackings", icon: Package, label: "Mes trackings" },
  { to: "/dashboard/messages", icon: MessageSquare, label: "Messagerie" },
  { to: "/dashboard/profile", icon: User, label: "Mon profil" },
];

const operatorLinks = [
  { to: "/operator", icon: LayoutDashboard, label: "Vue globale" },
  { to: "/operator/trackings", icon: Map, label: "Tous les objets" },
  { to: "/operator/messages", icon: Headphones, label: "Support" },
];

const adminLinks = [
  { to: "/admin", icon: BarChart3, label: "Statistiques" },
  { to: "/admin/users", icon: Users, label: "Utilisateurs" },
  { to: "/admin/trackings", icon: Package, label: "Trackings" },
  { to: "/admin/settings", icon: Settings, label: "Configuration" },
];

const DashboardLayout = ({ children, role = "client" }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = role === "admin" ? adminLinks : role === "operator" ? operatorLinks : clientLinks;

  return (
    <div className="flex h-screen bg-background">
      <aside className={`${collapsed ? "w-16" : "w-64"} bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 border-r border-sidebar-border`}>
        <div className="h-16 flex items-center px-4 gap-2 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-accent-foreground" />
          </div>
          {!collapsed && <span className="font-display font-bold text-lg">TrackFlow</span>}
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <link.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-sidebar-border space-y-1">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent w-full transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
