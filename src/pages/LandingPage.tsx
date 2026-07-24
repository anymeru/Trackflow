import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/tracking/StatusBadge";
import StatusGuide from "@/components/tracking/StatusGuide";
import RecentTrackings, { addRecentTracking } from "@/components/tracking/RecentTrackings";
import { getPublicTracking, Tracking } from "@/api/trackings";
import { Search, Package, Truck, MapPin, Shield, ArrowRight, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [trackingInput, setTrackingInput] = useState("");
  const [searchResults, setSearchResults] = useState<Tracking[]>([]);
  const [notFoundNumbers, setNotFoundNumbers] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const numbers = trackingInput
      .split(/[\n,;]+/)
      .map((n) => n.trim().toUpperCase())
      .filter((n) => n.length > 0)
      .slice(0, 10);

    if (numbers.length === 0) return;

    setSearching(true);
    const found: Tracking[] = [];
    const notFound: string[] = [];

    for (const num of numbers) {
      try {
        const tracking = await getPublicTracking(num);
        found.push(tracking);
        addRecentTracking({ trackingNumber: tracking.trackingNumber, name: tracking.clientName, status: tracking.status });
      } catch {
        notFound.push(num);
      }
    }

    setSearchResults(found);
    setNotFoundNumbers(notFound);
    setHasSearched(true);
    setSearching(false);
  };

  const handleRecentSelect = async (trackingNumber: string) => {
    setTrackingInput(trackingNumber);
    try {
      const tracking = await getPublicTracking(trackingNumber);
      setSearchResults([tracking]);
      setNotFoundNumbers([]);
      setHasSearched(true);
    } catch {
      setNotFoundNumbers([trackingNumber]);
    }
  };

  const features = [
    { icon: MapPin, title: "Real-time Tracking", desc: "View the exact location of your packages and vehicles on an interactive map." },
    { icon: Shield, title: "Secure & Reliable", desc: "Your data is protected. Complete history of every movement recorded." },
    { icon: Clock, title: "Instant Updates", desc: "Receive notifications at every status change of your shipments." },
    { icon: Globe, title: "National Coverage", desc: "Track your shipments anywhere in France with our carrier partners." },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero min-h-[80vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/50 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 pt-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-1.5 mb-6 text-sm text-accent-foreground border border-accent/20">
                <Truck className="w-4 h-4" />
                Professional Tracking Platform
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
                Track your shipments <br />
                <span className="text-gradient-accent">in real time</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/70 mt-4 max-w-xl mx-auto">
                Packages, vehicles, equipment — locate and manage all your items from a single platform.
              </p>
            </motion.div>

            {/* Multi-tracking Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-lg mx-auto"
            >
              <div className="glass-card rounded-2xl p-3 space-y-2">
                <Textarea
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder={"Enter your tracking numbers...\nUp to 10 numbers (one per line)"}
                  className="min-h-[48px] max-h-[120px] border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 resize-none"
                  rows={2}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-primary-foreground/40 pl-1">
                    Separate by line, comma, or semicolon
                  </span>
                  <Button variant="accent" size="lg" onClick={handleSearch} className="shrink-0">
                    <Search className="w-5 h-5 mr-2" />
                    Track
                  </Button>
                </div>
              </div>
              <p className="text-xs text-primary-foreground/50 mt-2">
                Essayez: TRK-2024-001847, TRK-2024-003105
              </p>

              {/* Recent Trackings */}
              <div className="mt-4">
                <RecentTrackings onSelect={handleRecentSelect} />
              </div>
            </motion.div>

            {/* Search Results */}
            {hasSearched && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto space-y-3"
              >
                {searchResults.length > 1 && (
                  <p className="text-sm text-primary-foreground/60 text-left">
                    {searchResults.length} packages found
                  </p>
                )}
                {searchResults.map((result) => (
                  <Card key={result.id} className="p-4 text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-sm text-muted-foreground">{result.trackingNumber}</p>
                        <p className="font-display font-semibold">{result.clientName}</p>
                      </div>
                      <StatusBadge status={result.status} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {(result.originAddress || "Origin")} → {(result.destinationAddress || "Destination")}
                    </div>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => navigate(`/track/${result.id}`)}
                      className="w-full"
                    >
                      View detailed tracking
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Card>
                ))}
              </motion.div>
            )}

            {hasSearched && notFoundNumbers.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="max-w-lg mx-auto p-4 text-left space-y-2">
                  <p className="text-sm font-medium text-destructive">Numbers not found:</p>
                  {notFoundNumbers.map((num) => (
                    <p key={num} className="text-sm text-muted-foreground font-mono">{num}</p>
                  ))}
                  <p className="text-xs text-muted-foreground">Check the spelling or contact your sender.</p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Status Guide */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4 max-w-2xl">
          <StatusGuide />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Everything you need
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              A complete solution for tracking your shipments and vehicles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow border-border/50 group">
                  <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <f.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Ready to track your shipments?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Create your account for free and start tracking your packages in minutes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="hero" size="lg" onClick={() => navigate("/register")}>
              Create a free account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="hero-outline" size="lg" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            <span className="font-display font-bold">TrackFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 TrackFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
