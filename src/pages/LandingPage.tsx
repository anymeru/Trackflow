import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSettings } from "@/api/settings";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/tracking/StatusBadge";
import StatusGuide from "@/components/tracking/StatusGuide";
import RecentTrackings, { addRecentTracking } from "@/components/tracking/RecentTrackings";
import { getPublicTracking, Tracking } from "@/api/trackings";
import { Search, Truck, MapPin, Shield, ArrowRight, Clock, Globe, Plane, Ship, Globe2, CheckCircle2, Quote } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-freight.jpg.asset.json";
import airImg from "@/assets/service-air.jpg.asset.json";
import seaImg from "@/assets/service-sea.jpg.asset.json";
import roadImg from "@/assets/service-road.jpg.asset.json";
import ieImg from "@/assets/service-import-export.jpg.asset.json";

const LandingPage = () => {
  const [trackingInput, setTrackingInput] = useState("");
  const [searchResults, setSearchResults] = useState<Tracking[]>([]);
  const [notFoundNumbers, setNotFoundNumbers] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [contactEmail, setContactEmail] = useState("hello@trace.tech");
  const [contactPhone, setContactPhone] = useState("+33 1 84 88 42 00");
  const navigate = useNavigate();

  useEffect(() => {
    getSettings().then((s) => {
      if (s.supportEmail) setContactEmail(s.supportEmail);
      if (s.supportPhone) setContactPhone(s.supportPhone);
    }).catch(() => {});
  }, []);

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

  const services = [
    { icon: Plane, title: "Air Freight", desc: "Express global air cargo when hours matter — 24–72h transit to major hubs.", image: airImg.url, to: "/services#air" },
    { icon: Ship, title: "Sea Freight", desc: "FCL & LCL ocean shipping with direct tier-1 carrier contracts.", image: seaImg.url, to: "/services#sea" },
    { icon: Truck, title: "Road Freight", desc: "Domestic and cross-border trucking with a live-tracked modern fleet.", image: roadImg.url, to: "/services#road" },
    { icon: Globe2, title: "Import & Export", desc: "Licensed customs brokers handling clearance, HS coding and compliance.", image: ieImg.url, to: "/services#import-export" },
  ];

  const testimonials = [
    { name: "Amélie Rousseau", role: "Head of Ops, Maison Verte", quote: "TRACE turned our shipping black box into a live dashboard. Support tickets dropped 60% in a month." },
    { name: "David Okonkwo", role: "Import Manager, Baobab Trading", quote: "Customs clearance used to be our worst headache. Their brokers handle everything — we just watch it move." },
    { name: "Yuki Tanaka", role: "Founder, Lumen Studio", quote: "The ETA accuracy is genuinely uncanny. Our clients trust us more because we finally trust our own timeline." },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg.url} alt="Global freight and logistics" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
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
                Global Freight & Live Tracking
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
                Freight that moves. <br />
                <span className="text-gradient-accent">Visibility that stays.</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/70 mt-4 max-w-xl mx-auto">
                Air, sea, and road freight across 120+ countries — with live tracking, real ETAs and dedicated support on every shipment.
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
                Try: TRK-2024-001847, TRK-2024-003105
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

      {/* Services showcase */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">Our services</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">One partner, every mode of transport</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              From urgent air cargo to full container ocean freight, we design the route that fits your goods and your deadline.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={s.to}>
                  <Card className="overflow-hidden group h-full hover:shadow-xl transition-all border-border/50">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={s.image} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                      <div className="absolute top-3 left-3 w-10 h-10 rounded-lg gradient-accent flex items-center justify-center shadow-lg">
                        <s.icon className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <h3 className="absolute bottom-3 left-4 font-display text-xl font-bold text-primary-foreground">{s.title}</h3>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                      <div className="flex items-center gap-1 text-sm text-accent font-medium mt-3 group-hover:gap-2 transition-all">
                        Learn more <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split: image + why */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl"
          >
            <img src={seaImg.url} alt="Ocean freight container ship" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <p className="text-accent font-medium text-sm uppercase tracking-wider">Why TRACE</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Old-school reliability, modern visibility
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Fifteen years of freight-forwarding expertise combined with a tracking platform your team will actually enjoy using.
              No black-box shipments. No last-minute surprises.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "98.6% on-time delivery across all lanes",
                "Dedicated account manager per client",
                "Customs clearance & duty advisory included",
                "Real-time ETA with confidence scoring",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="inline-block pt-2">
              <Button variant="accent">About our company <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </motion.div>
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

      {/* Testimonials */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">Trusted worldwide</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">What our clients say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="p-6 h-full">
                  <Quote className="w-8 h-8 text-accent mb-3" />
                  <p className="text-muted-foreground italic leading-relaxed">"{t.quote}"</p>
                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="font-display font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
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
            Ready to ship smarter?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Create your free account or talk to our team about your next shipment.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="hero" size="lg" onClick={() => navigate("/register")}>
              Create a free account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="hero-outline" size="lg" onClick={() => navigate("/contact")}>
              Talk to us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="#00b4d8"/>
                <rect x="11" y="6" width="4" height="20" rx="1" fill="white"/>
                <rect x="7" y="6" width="14" height="4" rx="1" fill="white"/>
                <path d="M 13,12 Q 15,11 15,14 Q 15,16 13,17" stroke="#00b4d8" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                <circle cx="20" cy="18" r="2.5" fill="#ff6b6b"/>
                <circle cx="20" cy="18" r="1" fill="white"/>
              </svg>
              <span className="font-display font-bold">TRACE</span>
            </div>
            <p className="text-sm text-muted-foreground">Enterprise tracking — everything in view.</p>
          </div>
          <div>
            <p className="font-display font-semibold mb-3 text-sm">Services</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services#air" className="hover:text-accent">Air Freight</Link></li>
              <li><Link to="/services#sea" className="hover:text-accent">Sea Freight</Link></li>
              <li><Link to="/services#road" className="hover:text-accent">Road Freight</Link></li>
              <li><Link to="/services#import-export" className="hover:text-accent">Import & Export</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display font-semibold mb-3 text-sm">Company</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
              <li><Link to="/track" className="hover:text-accent">Track Shipment</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display font-semibold mb-3 text-sm">Get in touch</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{contactEmail}</li>
              <li>{contactPhone}</li>
              <li>Paris · Rotterdam · Lagos</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-10 pt-6 border-t border-border text-sm text-muted-foreground text-center">
          © 2026 TRACE. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
