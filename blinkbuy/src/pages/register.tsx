import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const CITIES = ["Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu", "Mangochi", "Dedza", "Salima"];

export default function RegisterPage() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
    role: "customer" as "customer" | "worker" | "both",
    location: "Lilongwe",
  });

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-lg">B</span>
            </div>
            <span className="font-black text-2xl">BlinkBuy</span>
          </Link>
          <h1 className="text-2xl font-black text-foreground">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join thousands of Malawians on BlinkBuy</p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-lg">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-4 border border-destructive/20">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="mb-5">
            <label className="text-sm font-medium text-foreground block mb-2">I want to:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "customer", label: "Hire Workers", desc: "Find & book services" },
                { value: "worker", label: "Offer Services", desc: "List my skills" },
                { value: "both", label: "Both", desc: "Hire and offer" },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("role", opt.value)}
                  className={`p-3 rounded-xl border text-center transition-all ${form.role === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  required
                  placeholder="James Phiri"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Location *</label>
                <select
                  value={form.location}
                  onChange={e => set("location", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                >
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  required
                  placeholder="0999123456"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">WhatsApp (optional)</label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={e => set("whatsapp", e.target.value)}
                  placeholder="0999123456"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
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
                <><UserPlus size={16} /> Create Account</>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
