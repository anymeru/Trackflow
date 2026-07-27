import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, MessageSquare, Users, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Map, Headphones, User, Menu, X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "client" | "operator" | "admin";
}

const clientLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/trackings", icon: Package, label: "My Trackings" },
  { to: "/dashboard/messages", icon: MessageSquare, label: "Messages / Support" },
  { to: "/dashboard/profile", icon: User, label: "My Profile" },
];

const operatorLinks = [
  { to: "/operator", icon: LayoutDashboard, label: "Overview" },
  { to: "/operator/trackings", icon: Map, label: "All Items" },
  { to: "/operator/messages", icon: Headphones, label: "Support" },
];

const adminLinks = [
  { to: "/admin", icon: BarChart3, label: "Analytics" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/trackings", icon: Package, label: "Trackings" },
  { to: "/admin/messages", icon: MessageSquare, label: "Messages / Support" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const DashboardLayout = ({ children, role = "client" }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = role === "admin" ? adminLinks : role === "operator" ? operatorLinks : clientLinks;
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center px-4 gap-2.5 border-b border-black/[0.04]">
        <img src="/trace-logo.svg" alt="TRACE" className="h-7 w-auto" />
        {(!collapsed || isMobile) && <span className="font-display font-bold text-lg tracking-wide text-black">TRACE</span>}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-black/40">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-full text-sm transition-all duration-500 ease-out-expo ${
                isActive
                  ? "bg-black/5 text-black"
                  : "text-black/40 hover:text-black hover:bg-black/[0.02]"
              }`}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {(!collapsed || isMobile) && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/[0.04]">
        {(!collapsed || isMobile) && (
          <div className="px-4 py-3">
            <p className="text-[10px] text-black/20 tracking-widest uppercase">Everything in view.</p>
          </div>
        )}
        <div className="p-2 space-y-0.5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-full text-sm text-black/40 hover:text-black hover:bg-black/[0.02] w-full transition-all duration-500 ease-out-expo"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </button>
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center w-full py-2 text-black/20 hover:text-black/50 transition-all duration-500 ease-out-expo"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && (
        <aside className={`${collapsed ? "w-16" : "w-64"} bg-[#FAFAFA] text-black flex flex-col transition-all duration-500 ease-out-expo border-r border-black/[0.04] shrink-0`}>
          {sidebarContent}
        </aside>
      )}

      {isMobile && mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-[#FAFAFA] text-black flex flex-col z-50 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
            {sidebarContent}
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-14 border-b border-black/[0.04] bg-white/80 backdrop-blur-2xl flex items-center justify-between px-4 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button onClick={() => setMobileOpen(true)}>
                <Menu className="w-5 h-5 text-black/60" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <div className="w-8 h-8 rounded-full bg-black/[0.03] flex items-center justify-center">
              <User className="w-4 h-4 text-black/40" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
