import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-lg">B</span>
            </div>
            <span className="font-black text-2xl">BlinkBuy</span>
          </Link>
          <h1 className="text-2xl font-black text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your BlinkBuy account</p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-lg">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-4 border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Register free
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          Admin login: otechy8@gmail.com
        </div>
      </div>
    </div>
  );
}
