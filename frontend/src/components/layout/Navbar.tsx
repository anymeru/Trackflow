import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/track", label: "Track Shipment" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLanding = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "operator" ? "/operator" : "/dashboard";

  return (
    <>
      {/* Floating Island — visible state */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 px-4 transition-all duration-700 ease-out-expo ${
          open ? "opacity-0 pointer-events-none translate-y-[-20px]" : "opacity-100"
        }`}
      >
        <div
          className={`flex items-center justify-between px-5 py-2 rounded-full transition-all duration-700 ease-out-expo ${
            isLanding && !scrolled
              ? "bg-white/10 backdrop-blur-2xl border border-white/20"
              : "bg-white/80 backdrop-blur-2xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
          }`}
          style={{ minWidth: "max-content" }}
        >
          <Link to="/" className="flex items-center gap-2.5 pr-6 group">
            <img src="/trace-logo.svg" alt="TRACE" className="h-7 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-out-expo ${
                    active
                      ? "bg-black/5 text-black"
                      : "text-black/50 hover:text-black hover:bg-black/[0.03]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3 pl-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate(dashboardPath)}
                className="w-9 h-9 rounded-full bg-black/5 border border-black/10 flex items-center justify-center hover:bg-black/10 transition-all duration-500 ease-out-expo active:scale-[0.95]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-full text-sm font-medium text-black/60 hover:text-black hover:bg-black/5 px-5 transition-all duration-500 ease-out-expo">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <button className="relative rounded-full px-5 py-2 text-sm font-medium text-white bg-black hover:bg-black/90 transition-all duration-500 ease-out-expo active:scale-[0.97]">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden flex flex-col gap-[5px] p-2 ml-2"
            aria-label="Open menu"
          >
            <span className="block w-5 h-[1.5px] rounded-full bg-black/60 transition-all duration-300 ease-out-expo" />
            <span className="block w-5 h-[1.5px] rounded-full bg-black/60 transition-all duration-300 ease-out-expo" />
          </button>
        </div>
      </nav>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-700 ease-out-expo ${
          open
            ? "opacity-100 pointer-events-auto backdrop-blur-3xl bg-white/95"
            : "opacity-0 pointer-events-none backdrop-blur-0 bg-white/0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-all duration-500 ease-out-expo active:scale-[0.95]"
          aria-label="Close menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* Navigation links */}
        <div className="flex flex-col items-center gap-2">
          {NAV_ITEMS.map((item, i) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`text-4xl md:text-6xl font-light tracking-tight transition-all duration-700 ease-out-expo ${
                  active ? "text-black" : "text-black/20 hover:text-black/60"
                }`}
                style={{
                  transform: open ? "translateY(0)" : "translateY(48px)",
                  opacity: open ? 1 : 0,
                  transitionDelay: open ? `${100 + i * 80}ms` : "0ms",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Auth links at bottom */}
        <div
          className="absolute bottom-12 flex items-center gap-4 transition-all duration-700 ease-out-expo"
          style={{
            transform: open ? "translateY(0)" : "translateY(32px)",
            opacity: open ? 1 : 0,
            transitionDelay: open ? "500ms" : "0ms",
          }}
        >
          {isAuthenticated ? (
            <button
              onClick={() => { setOpen(false); navigate(dashboardPath); }}
              className="rounded-full px-8 py-3 text-sm font-medium bg-black text-white hover:bg-black/90 transition-all duration-500 ease-out-expo active:scale-[0.97]"
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="rounded-full text-sm px-8 py-3">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                <button className="rounded-full px-8 py-3 text-sm font-medium bg-black text-white hover:bg-black/90 transition-all duration-500 ease-out-expo active:scale-[0.97]">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
