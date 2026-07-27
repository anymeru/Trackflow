import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
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
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gray-900 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-white/10 text-white/80 mb-6">
              Live Tracking
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Track your shipment
            </h1>
            <p className="text-lg text-white/60 mt-6">
              Enter up to 10 tracking numbers to get real-time status, location and ETA.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-xl mx-auto mt-10"
          >
            <div className="p-[1px] rounded-[2rem] bg-white/[0.08] shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
              <div className="rounded-[calc(2rem-1px)] bg-white/95 backdrop-blur-xl p-3 space-y-2">
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
                  className="min-h-[48px] max-h-[140px] border-0 bg-transparent focus-visible:ring-0 resize-none text-gray-900 placeholder:text-gray-400 text-sm"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-medium pl-1">
                    Separate by line, comma or semicolon
                  </span>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="inline-flex items-center gap-3 rounded-full bg-gray-900 text-white pl-6 pr-1 py-1 text-sm font-medium transition-all duration-700 ease-out-expo hover:bg-gray-800 active:scale-[0.97] disabled:opacity-50"
                  >
                    <span>{loading ? "Searching..." : "Track"}</span>
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <Search className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mt-3">
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
            <p className="text-center text-gray-500">No results.</p>
          )}
          {results.length > 1 && (
            <p className="text-sm text-gray-500">{results.length} shipments found</p>
          )}
          {results.map((r) => (
            <div key={r.id} className="p-[1px] rounded-[2rem] bg-black/[0.03] shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
              <div className="rounded-[calc(2rem-1px)] bg-white p-5 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-gray-400 truncate">{r.trackingNumber}</p>
                    <p className="font-display font-semibold text-gray-900 truncate">{r.clientName}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {(r.originAddress || "Origin")} → {(r.destinationAddress || "Destination")}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/track/${r.id}`)}
                  className="inline-flex items-center justify-between gap-3 rounded-full bg-gray-900 text-white pl-6 pr-1 py-1 text-sm font-medium transition-all duration-700 ease-out-expo hover:bg-gray-800 active:scale-[0.97] w-full"
                >
                  <span>View detailed tracking</span>
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          ))}
          {notFound.length > 0 && (
            <div className="p-[1px] rounded-[2rem] bg-black/[0.03] shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
              <div className="rounded-[calc(2rem-1px)] bg-white p-5 space-y-1">
                <p className="text-sm font-medium text-red-400 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Numbers not found:
                </p>
                {notFound.map((n) => (
                  <p key={n} className="text-sm font-mono text-gray-500">{n}</p>
                ))}
                <p className="text-xs text-gray-400 pt-1">Check the spelling or contact your sender.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white border-t border-black/[0.04]">
        <div className="container mx-auto px-4 max-w-2xl">
          <StatusGuide />
        </div>
      </section>
    </div>
  );
};

export default TrackShipmentPage;
