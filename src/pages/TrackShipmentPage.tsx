import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/tracking/StatusBadge";
import StatusGuide from "@/components/tracking/StatusGuide";
import RecentTrackings, { addRecentTracking } from "@/components/tracking/RecentTrackings";
import { getPublicTracking, Tracking } from "@/api/trackings";
import { Search, MapPin, ArrowRight, Package } from "lucide-react";
import { motion } from "framer-motion";

const TrackShipmentPage = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Tracking[]>([]);
  const [notFound, setNotFound] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const numbers = input
      .split(/[\n,;]+/)
      .map((n) => n.trim().toUpperCase())
      .filter((n) => n.length > 0)
      .slice(0, 10);
    if (!numbers.length) return;

    setLoading(true);
    const found: Tracking[] = [];
    const missing: string[] = [];
    for (const num of numbers) {
      try {
        const t = await getPublicTracking(num);
        found.push(t);
        addRecentTracking({ trackingNumber: t.trackingNumber, name: t.clientName, status: t.status });
      } catch {
        missing.push(num);
      }
    }
    setResults(found);
    setNotFound(missing);
    setSearched(true);
    setLoading(false);
  };

  const handleRecent = async (trackingNumber: string) => {
    setInput(trackingNumber);
    try {
      const t = await getPublicTracking(trackingNumber);
      setResults([t]);
      setNotFound([]);
      setSearched(true);
    } catch {
      setNotFound([trackingNumber]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="gradient-hero pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 text-sm text-accent-foreground mb-6">
              Live Tracking
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
              Track your shipment
            </h1>
            <p className="text-lg text-primary-foreground/70 mt-6">
              Enter up to 10 tracking numbers to get real-time status, location and ETA.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-xl mx-auto mt-10"
          >
            <div className="glass-card rounded-2xl p-3 space-y-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder={"Enter your tracking numbers...\nUp to 10 numbers (one per line)"}
                className="min-h-[48px] max-h-[140px] border-0 bg-transparent focus-visible:ring-0 resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-primary-foreground/50 pl-1">
                  Separate by line, comma or semicolon
                </span>
                <Button variant="accent" size="lg" onClick={handleSearch} disabled={loading}>
                  <Search className="w-5 h-5 mr-2" />
                  {loading ? "Searching..." : "Track"}
                </Button>
              </div>
            </div>
            <p className="text-xs text-primary-foreground/50 mt-2">
              Try: TRK-2024-001847, TRK-2024-003105
            </p>
            <div className="mt-4">
              <RecentTrackings onSelect={handleRecent} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl space-y-4">
          {searched && results.length === 0 && notFound.length === 0 && (
            <p className="text-center text-muted-foreground">No results.</p>
          )}
          {results.length > 1 && (
            <p className="text-sm text-muted-foreground">{results.length} shipments found</p>
          )}
          {results.map((r) => (
            <Card key={r.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground truncate">{r.trackingNumber}</p>
                  <p className="font-display font-semibold truncate">{r.clientName}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {(r.originAddress || "Origin")} → {(r.destinationAddress || "Destination")}
                </span>
              </div>
              <Button variant="accent" size="sm" onClick={() => navigate(`/track/${r.id}`)} className="w-full">
                View detailed tracking
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
          {notFound.length > 0 && (
            <Card className="p-5 space-y-1">
              <p className="text-sm font-medium text-destructive flex items-center gap-2">
                <Package className="w-4 h-4" /> Numbers not found:
              </p>
              {notFound.map((n) => (
                <p key={n} className="text-sm font-mono text-muted-foreground">{n}</p>
              ))}
              <p className="text-xs text-muted-foreground pt-1">Check the spelling or contact your sender.</p>
            </Card>
          )}
        </div>
      </section>

      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 max-w-2xl">
          <StatusGuide />
        </div>
      </section>
    </div>
  );
};

export default TrackShipmentPage;