import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/tracking/StatusBadge";
import { mockTrackings } from "@/data/mockData";
import { Search, Package, Truck, MapPin, Shield, ArrowRight, Clock, Globe } from "lucide-react";
import { motion } from "motion/react";

const LandingPage = () => {
  const [trackingInput, setTrackingInput] = useState("");
  const [searchResult, setSearchResult] = useState<typeof mockTrackings[0] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    const found = mockTrackings.find(
      (t) => t.trackingNumber.toLowerCase() === trackingInput.trim().toLowerCase()
    );
    if (found) {
      setSearchResult(found);
      setNotFound(false);
    } else {
      setSearchResult(null);
      setNotFound(true);
    }
  };

  const features = [
    { icon: MapPin, title: "Suivi en temps réel", desc: "Visualisez la position exacte de vos colis et véhicules sur une carte interactive." },
    { icon: Shield, title: "Sécurisé & fiable", desc: "Vos données sont protégées. Historique complet de chaque mouvement enregistré." },
    { icon: Clock, title: "Mises à jour instantanées", desc: "Recevez des notifications à chaque changement de statut de vos envois." },
    { icon: Globe, title: "Couverture nationale", desc: "Suivez vos expéditions partout en France avec nos partenaires transporteurs." },
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
                Plateforme de tracking professionnelle
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
                Suivez vos envois <br />
                <span className="text-gradient-accent">en temps réel</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/70 mt-4 max-w-xl mx-auto">
                Colis, véhicules, équipements — localisez et gérez tous vos objets depuis une seule plateforme.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-lg mx-auto"
            >
              <div className="glass-card rounded-2xl p-2 flex gap-2">
                <Input
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Entrez votre numéro de tracking..."
                  className="h-12 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                />
                <Button variant="accent" size="lg" onClick={handleSearch} className="shrink-0">
                  <Search className="w-5 h-5 mr-2" />
                  Suivre
                </Button>
              </div>
              <p className="text-xs text-primary-foreground/50 mt-2">
                Essayez: TRK-2024-001847
              </p>
            </motion.div>

            {/* Search Result */}
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto"
              >
                <Card className="p-5 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">{searchResult.trackingNumber}</p>
                      <p className="font-display font-semibold text-lg">{searchResult.name}</p>
                    </div>
                    <StatusBadge status={searchResult.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {searchResult.origin} → {searchResult.destination}
                  </div>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="w-full"
                  >
                    Connectez-vous pour plus de détails
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            )}

            {notFound && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="max-w-lg mx-auto p-4 text-center">
                  <p className="text-muted-foreground">Aucun résultat trouvé pour ce numéro.</p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Une solution complète pour le suivi de vos expéditions et véhicules.
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
            Prêt à suivre vos envois ?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Créez votre compte gratuitement et commencez à suivre vos colis en quelques minutes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="hero" size="lg" onClick={() => navigate("/register")}>
              Créer un compte gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="hero-outline" size="lg" onClick={() => navigate("/login")}>
              Se connecter
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
          <p className="text-sm text-muted-foreground">© 2024 TrackFlow. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
