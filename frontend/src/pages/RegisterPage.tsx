import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="min-h-[100dvh] bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-[1px] rounded-[2.5rem] bg-gradient-to-b from-black/[0.04] to-transparent">
        <div className="rounded-[calc(2.5rem-1px)] bg-white p-8 sm:p-10 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)]">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <img src="/trace-logo.svg" alt="TRACE" className="h-8 w-auto" />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Create Account</h1>
            <p className="text-gray-500 text-sm mt-2">Start tracking your shipments</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em]">Full name</Label>
              <div className="p-[1px] rounded-xl bg-black/[0.06] transition-all duration-500 ease-out-expo focus-within:bg-black/10">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 transition-all duration-500 ease-out-expo"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em]">Email</Label>
              <div className="p-[1px] rounded-xl bg-black/[0.06] transition-all duration-500 ease-out-expo focus-within:bg-black/10">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 transition-all duration-500 ease-out-expo"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em]">Phone (optional)</Label>
              <div className="p-[1px] rounded-xl bg-black/[0.06] transition-all duration-500 ease-out-expo focus-within:bg-black/10">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 transition-all duration-500 ease-out-expo"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em]">Password</Label>
              <div className="p-[1px] rounded-xl bg-black/[0.06] transition-all duration-500 ease-out-expo focus-within:bg-black/10">
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 transition-all duration-500 ease-out-expo"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-[0.1em]">Confirm password</Label>
              <div className="p-[1px] rounded-xl bg-black/[0.06] transition-all duration-500 ease-out-expo focus-within:bg-black/10">
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 transition-all duration-500 ease-out-expo"
                />
              </div>
            </div>
            <div className="flex items-start gap-3 pt-1">
              <Checkbox id="cgu" checked={accepted} onCheckedChange={(v) => setAccepted(v === true)} />
              <label htmlFor="cgu" className="text-xs text-gray-500 leading-tight pt-0.5">
                I accept the <a href="#" className="text-gray-900 font-medium hover:underline">terms and conditions</a>
              </label>
            </div>
            <button
              type="submit"
              disabled={!accepted || loading}
              className="relative w-full rounded-full bg-black text-white py-3.5 text-sm font-medium transition-all duration-500 ease-out-expo hover:bg-black/90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create my account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
