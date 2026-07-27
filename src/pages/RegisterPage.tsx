import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await register(form.email, form.password, form.name, form.phone);
      toast.success("Account created successfully");
      if (res.user.role === "admin") navigate("/admin");
      else if (res.user.role === "operator") navigate("/operator");
      else navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Registration error";
      toast.error(msg || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/trace-logo.svg" alt="TRACE" className="h-10" />
            <span className="font-display text-2xl font-bold tracking-wide">TRACE</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Start tracking your shipments</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
          </div>
          <div className="space-y-2">
            <Label>Phone (optional)</Label>
            <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+33 6 12 34 56 78" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
          </div>
          <div className="space-y-2">
            <Label>Confirm password</Label>
            <Input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" required />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="cgu" checked={accepted} onCheckedChange={(v) => setAccepted(v === true)} />
            <label htmlFor="cgu" className="text-sm text-muted-foreground leading-tight">
              I accept the <a href="#" className="text-accent hover:underline">terms and conditions</a>
            </label>
          </div>
          <Button type="submit" variant="accent" className="w-full" size="lg" disabled={!accepted || loading}>
            {loading ? "Creating account..." : "Create my account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">Sign In</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
