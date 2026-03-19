import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Package } from "lucide-react";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <Package className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display text-2xl font-bold">TrackFlow</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">Créer un compte</h1>
          <p className="text-muted-foreground text-sm mt-1">Commencez à suivre vos envois</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nom complet</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jean Dupont" required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" required />
          </div>
          <div className="space-y-2">
            <Label>Téléphone (optionnel)</Label>
            <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+33 6 12 34 56 78" />
          </div>
          <div className="space-y-2">
            <Label>Mot de passe</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
          </div>
          <div className="space-y-2">
            <Label>Confirmer le mot de passe</Label>
            <Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" required />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="cgu" checked={accepted} onCheckedChange={(v) => setAccepted(v === true)} />
            <label htmlFor="cgu" className="text-sm text-muted-foreground leading-tight">
              J'accepte les <a href="#" className="text-accent hover:underline">conditions générales d'utilisation</a>
            </label>
          </div>
          <Button type="submit" variant="accent" className="w-full" size="lg" disabled={!accepted}>
            Créer mon compte
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">Se connecter</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
