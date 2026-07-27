import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import client from "@/api/client";
import { getSettings } from "@/api/settings";

const ContactPage = () => {
  const [settings, setSettings] = useState({ supportEmail: "hello@trace.tech", supportPhone: "+33 1 84 88 42 00" });

  useEffect(() => {
    getSettings().then((s) => {
      if (s.supportEmail) setSettings((prev) => ({ ...prev, supportEmail: s.supportEmail }));
      if (s.supportPhone) setSettings((prev) => ({ ...prev, supportPhone: s.supportPhone }));
    }).catch(() => {});
  }, []);

  const contactInfo = [
    { icon: Mail, label: "Email", value: settings.supportEmail, href: `mailto:${settings.supportEmail}` },
    { icon: Phone, label: "Phone", value: settings.supportPhone, href: `tel:${settings.supportPhone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Headquarters", value: "24 Rue de la Logistique, 75008 Paris, France" },
    { icon: Clock, label: "Hours", value: "Mon – Fri · 08:00 – 19:00 CET" },
  ];
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await client.post("/contact", form);
      toast.success("Message sent — we'll get back to you within 24h.");
      setForm({ name: "", email: "", company: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="gradient-hero pt-32 pb-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 text-sm text-accent-foreground mb-6">
              Contact us
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
              Let's talk <span className="text-gradient-accent">freight</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 mt-6">
              A quote, a question, a partnership — our team replies within one business day.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl grid lg:grid-cols-5 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((c) => (
              <Card key={c.label} className="p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg gradient-accent flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="font-medium hover:text-accent transition-colors">
                      {c.value}
                    </a>
                  ) : (
                    <p className="font-medium">{c.value}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Form */}
          <Card className="lg:col-span-3 p-8">
            <h2 className="font-display text-2xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name *</Label>
                  <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" variant="accent" size="lg" disabled={sending} className="w-full sm:w-auto">
                {sending ? "Sending..." : (<><Send className="w-4 h-4 mr-2" /> Send message</>)}
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;