import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-[100dvh] bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-[1px] rounded-[2.5rem] bg-gradient-to-b from-black/[0.04] to-transparent">
        <div className="rounded-[calc(2.5rem-1px)] bg-white p-8 sm:p-10 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)]">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <img src="/trace-logo.svg" alt="TRACE" className="h-8 w-auto" />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-2">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em]">Email</Label>
              <div className="p-[1px] rounded-xl bg-black/[0.06] transition-all duration-500 ease-out-expo focus-within:bg-black/10">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 transition-all duration-500 ease-out-expo"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em]">Password</Label>
              <div className="p-[1px] rounded-xl bg-black/[0.06] transition-all duration-500 ease-out-expo focus-within:bg-black/10">
                <div className="relative rounded-xl bg-white">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl bg-transparent px-4 py-3 pr-12 text-sm outline-none placeholder:text-gray-400 transition-all duration-500 ease-out-expo"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full rounded-full bg-black text-white py-3.5 text-sm font-medium transition-all duration-500 ease-out-expo hover:bg-black/90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-gray-900 font-medium hover:underline">Create Account</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-black/[0.04]">
            <p className="text-[11px] text-gray-400 uppercase tracking-[0.15em] text-center mb-3">Demo access</p>
            <div className="space-y-1.5 text-xs text-gray-500 text-center">
              <p>Admin: admin@track-connect.com / admin123</p>
              <p>Client: client@example.com / client123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
