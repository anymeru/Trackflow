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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center px-4 gap-2.5 border-b border-sidebar-border">
        <img src="/trace-logo.svg" alt="TRACE" className="h-8 shrink-0" />
        {(!collapsed || isMobile) && <span className="font-display font-bold text-lg tracking-wide">TRACE</span>}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-sidebar-foreground/70">
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
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? "text-sidebar-primary-foreground bg-sidebar-accent/60 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-5 before:rounded-full before:bg-[#00b4d8]"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
              }`}
            >
              <span className={`relative shrink-0 ${isActive ? "text-[#00b4d8]" : ""}`}>
                <link.icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00b4d8]">
                    <span className="absolute inset-0 rounded-full bg-[#00b4d8] animate-ping opacity-40" />
                  </span>
                )}
              </span>
              {(!collapsed || isMobile) && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border">
        {(!collapsed || isMobile) && (
          <div className="px-4 py-3">
            <p className="text-[10px] text-sidebar-foreground/30 tracking-widest uppercase">Everything in view.</p>
          </div>
        )}
        <div className="p-2 space-y-0.5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 w-full transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </button>
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center w-full py-2 text-sidebar-foreground/30 hover:text-sidebar-foreground/70 transition-colors"
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
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside className={`${collapsed ? "w-16" : "w-64"} bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 border-r border-sidebar-border shrink-0 trace-sidebar-grid`}>
          {sidebarContent}
        </aside>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50 shadow-xl trace-sidebar-grid">
            {sidebarContent}
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-14 border-b border-border bg-card/50 flex items-center justify-between px-4 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button onClick={() => setMobileOpen(true)}>
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
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
