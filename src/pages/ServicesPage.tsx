import Navbar from "@/components/layout/Navbar";
import { Link } from "react-router-dom";
import { Plane, Ship, Truck, Globe2, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
const airImg = { url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80" };
const seaImg = { url: "https://images.unsplash.com/photo-1712578585447-2bab142270b0?w=800&q=80" };
const roadImg = { url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80" };
const ieImg = { url: "https://images.unsplash.com/photo-1759389003827-2a214e4c73b4?w=800&q=80" };

const services = [
  {
    id: "air",
    icon: Plane,
    title: "Air Freight",
    image: airImg.url,
    tagline: "Speed when hours matter.",
    description:
      "Priority air cargo across major hubs worldwide. Ideal for time-sensitive, high-value, and perishable shipments with door-to-door express handling.",
    bullets: [
      "24 – 72h global transit",
      "Temperature-controlled options",
      "Dangerous goods certified",
      "Live flight tracking",
    ],
  },
  {
    id: "sea",
    icon: Ship,
    title: "Sea Freight",
    image: seaImg.url,
    tagline: "Volume, economy, reliability.",
    description:
      "FCL and LCL ocean freight backed by direct contracts with tier-1 carriers. The most cost-effective way to move heavy or oversized cargo across continents.",
    bullets: [
      "FCL, LCL & break-bulk",
      "Port-to-port & door-to-door",
      "Reefer & special equipment",
      "Consolidation warehousing",
    ],
  },
  {
    id: "road",
    icon: Truck,
    title: "Road Freight",
    image: roadImg.url,
    tagline: "The backbone of last-mile.",
    description:
      "Domestic and cross-border trucking with a modern fleet and vetted partners. Full loads, groupage, or express — all under one live tracking dashboard.",
    bullets: [
      "FTL & LTL nationwide",
      "Cross-border Europe & Africa",
      "Same-day express fleet",
      "GPS-tracked vehicles",
    ],
  },
  {
    id: "import-export",
    icon: Globe2,
    title: "Import & Export",
    image: ieImg.url,
    tagline: "Customs, paperwork, done right.",
    description:
      "End-to-end customs clearance, duty optimization, and compliance for import and export operations. Our licensed brokers handle every declaration and border formality.",
    bullets: [
      "Customs clearance & HS coding",
      "Duty & VAT advisory",
      "Bonded warehousing",
      "Trade compliance & permits",
    ],
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-gray-900 pt-32 pb-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-white/10 text-white/80 mb-6">
              Our Services
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Freight solutions <span className="text-white/60">by land, sea and sky</span>
            </h1>
            <p className="text-lg text-white/60 mt-6">
              Four core services, one unified platform. From urgent air cargo to full-container ocean freight,
              we design the route that fits your goods, your deadline and your budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="container mx-auto px-4 space-y-24 max-w-6xl">
          {services.map((s, i) => {
            const reverse = i % 2 === 1;
            return (
              <motion.div
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className={`grid md:grid-cols-2 gap-10 items-center ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}
              >
                <div className="relative overflow-hidden rounded-[2rem] shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] aspect-[4/3]">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-black/5 flex items-center justify-center shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
                    <s.icon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                <div className="space-y-5">
                  <p className="text-gray-600 font-medium text-[10px] uppercase tracking-[0.2em]">{s.tagline}</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{s.title}</h2>
                  <p className="text-gray-500 text-lg leading-relaxed">{s.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact">
                    <span className="inline-flex items-center gap-3 rounded-full bg-gray-900 text-white pl-6 pr-1 py-1 text-sm font-medium transition-all duration-700 ease-out-expo hover:bg-gray-800 active:scale-[0.97] mt-2">
                      <span>Request a quote</span>
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4 tracking-tight">
            Not sure which service you need?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Our logistics experts will design a custom multimodal route for your shipment.
          </p>
          <Link to="/contact">
            <span className="inline-flex items-center gap-3 rounded-full bg-white text-gray-900 pl-6 pr-1 py-1 text-sm font-medium transition-all duration-700 ease-out-expo hover:bg-white/90 active:scale-[0.97]">
              <span>Talk to an expert</span>
              <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
