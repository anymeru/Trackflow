import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = location.pathname === "/";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/track", label: "Track Shipment" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLanding ? "bg-transparent" : "bg-card/90 backdrop-blur-md border-b border-border/50"}`}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center shadow-md">
            <Package className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className={`font-display text-xl font-bold ${isLanding ? "text-accent-foreground" : "text-foreground"}`}>
            TrackFlow
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isLanding
                    ? `text-primary-foreground/80 hover:text-primary-foreground ${active ? "text-primary-foreground" : ""}`
                    : `text-foreground/70 hover:text-foreground ${active ? "text-accent" : ""}`
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3 ml-4">
          <ThemeToggle variant={isLanding ? "onDark" : "default"} />
          <Link to="/login">
            <Button variant={isLanding ? "hero-outline" : "ghost"} size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant={isLanding ? "hero" : "accent"} size="sm">Create Account</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X className={isLanding ? "text-accent-foreground" : "text-foreground"} />
          ) : (
            <Menu className={isLanding ? "text-accent-foreground" : "text-foreground"} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border p-4 flex flex-col gap-2 animate-slide-up">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">{l.label}</Button>
            </Link>
          ))}
          <div className="h-px bg-border my-1" />
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">Sign In</Button>
          </Link>
          <Link to="/register" onClick={() => setMobileOpen(false)}>
            <Button variant="accent" className="w-full">Create Account</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
