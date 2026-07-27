import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import client from "@/api/client";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/trace-logo.svg" alt="TRACE" className="h-10" />
            <span className="font-display text-2xl font-bold tracking-wide">TRACE</span>
          </Link>
          <h1 className="font-display text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">If that email exists, a reset link has been sent.</p>
            <Link to="/login">
              <Button variant="accent" className="w-full">Back to Sign In</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
            <Button type="submit" variant="accent" className="w-full" size="lg" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="text-accent font-medium hover:underline">Sign In</Link>
            </p>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
