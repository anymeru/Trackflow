import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      toast.success("Login successful");
      if (res.user.role === "admin") navigate("/admin");
      else if (res.user.role === "operator") navigate("/operator");
      else navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Login error";
      toast.error(msg || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/trace-logo.svg" alt="TRACE" className="h-10" />
            <span className="font-display text-2xl font-bold tracking-wide">TRACE</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground text-sm mt-1">Access your tracking dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" variant="accent" className="w-full" size="lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent font-medium hover:underline">Create Account</Link>
        </p>

        <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
          <p className="font-medium mb-1">Demo access:</p>
          <p>Admin: admin@track-connect.com / admin123</p>
          <p>Client: client@example.com / client123</p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
