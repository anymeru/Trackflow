import Navbar from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Users, Globe2, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-freight.jpg.asset.json";

const values = [
  { icon: Target, title: "Precision", desc: "Every shipment tracked to the minute, every document filed to the letter." },
  { icon: Heart, title: "Care", desc: "Your cargo is treated as if it were our own — from pickup to proof of delivery." },
  { icon: Globe2, title: "Reach", desc: "A network of partners spanning 120+ countries across four continents." },
  { icon: Award, title: "Excellence", desc: "ISO-certified processes and a 98.6% on-time delivery rate." },
];

const stats = [
  { value: "15+", label: "Years of expertise" },
  { value: "120", label: "Countries served" },
  { value: "50k", label: "Shipments / year" },
  { value: "98.6%", label: "On-time delivery" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg.url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/50" />
        </div>
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 text-sm text-accent-foreground mb-6">
              About TrackFlow
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
              Moving what matters, <span className="text-gradient-accent">everywhere</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 mt-6 max-w-2xl">
              We are a global freight-forwarding company blending seasoned logistics expertise with modern tracking
              technology — because in freight, transparency is the new speed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">Our story</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              From a single truck to a global tracking platform
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              TrackFlow was born in 2010 out of a simple frustration: shippers were flying blind. Cargo would leave
              a warehouse and reappear only when it arrived — or when something went wrong.
            </p>
            <p>
              We started with a fleet of five trucks and one obsession: give clients real-time visibility on every
              parcel, container and pallet. Fifteen years later we operate across air, sea and road, with offices in
              12 countries and a platform trusted by thousands of businesses.
            </p>
            <p>
              Our mission has not changed. Every shipment should be traceable, every ETA should be trustworthy, and
              every client should sleep at night.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, title: "Our Mission", text: "To make global freight simple, transparent and reliable — one shipment at a time." },
            { icon: Eye, title: "Our Vision", text: "A world where every shipper, from a small business to a Fortune 500, has real-time visibility on their supply chain." },
          ].map((b) => (
            <Card key={b.title} className="p-8">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4">
                <b.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">{b.title}</h3>
              <p className="text-muted-foreground">{b.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-accent">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">What drives us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Our values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="p-6 h-full">
                  <div className="w-11 h-11 rounded-lg gradient-accent flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-10 h-10 text-accent mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">Let's move something great together</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Get a personalized quote or talk to one of our logistics experts.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="lg">
              Contact us <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;