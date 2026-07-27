import Navbar from "@/components/layout/Navbar";
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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg.url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-white/10 text-white/80 mb-6">
              About TRACE
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Moving what matters, <span className="text-white/60">everywhere</span>
            </h1>
            <p className="text-lg text-white/60 mt-6 max-w-2xl">
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
            <p className="text-gray-600 font-medium text-[10px] uppercase tracking-[0.2em] mb-3">Our story</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-6">
              From a single truck to a global tracking platform
            </h2>
          </div>
          <div className="space-y-4 text-gray-500 leading-relaxed">
            <p>
              TRACE was born in 2010 out of a simple frustration: shippers were flying blind. Cargo would leave
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
      <section className="py-16 bg-white border-y border-black/[0.04]">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, title: "Our Mission", text: "To make global freight simple, transparent and reliable — one shipment at a time." },
            { icon: Eye, title: "Our Vision", text: "A world where every shipper, from a small business to a Fortune 500, has real-time visibility on their supply chain." },
          ].map((b) => (
            <div key={b.title} className="p-[1px] rounded-[2rem] bg-black/[0.03] shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
              <div className="rounded-[calc(2rem-1px)] bg-white p-8">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-3 tracking-tight">{b.title}</h3>
                <p className="text-gray-500">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-sm text-gray-500 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-gray-600 font-medium text-[10px] uppercase tracking-[0.2em] mb-2">What drives us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Our values</h2>
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
                <div className="p-[1px] rounded-[2rem] bg-black/[0.03] shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] h-full">
                  <div className="rounded-[calc(2rem-1px)] bg-white p-6 h-full">
                    <div className="w-11 h-11 rounded-full bg-black/5 flex items-center justify-center mb-4">
                      <v.icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <h3 className="font-display font-semibold text-gray-900 mb-2 tracking-tight">{v.title}</h3>
                    <p className="text-sm text-gray-500">{v.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-10 h-10 text-white/50 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white mb-4 tracking-tight">Let's move something great together</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Get a personalized quote or talk to one of our logistics experts.
          </p>
          <Link to="/contact">
            <span className="inline-flex items-center gap-3 rounded-full bg-white text-gray-900 pl-6 pr-1 py-1 text-sm font-medium transition-all duration-700 ease-out-expo hover:bg-white/90 active:scale-[0.97]">
              <span>Contact us</span>
              <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
