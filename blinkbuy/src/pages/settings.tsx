import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Save, User, Phone, MapPin, FileText, Camera } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { getLanguage, setLanguage } from "@/lib/auth";

const CITIES = ["Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu", "Mangochi", "Dedza", "Salima"];

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"en" | "ny">(getLanguage());

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    whatsapp: user?.whatsapp || "",
    location: user?.location || "Lilongwe",
    bio: user?.bio || "",
    profilePhoto: user?.profilePhoto || "",
  });

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const data = await api.put(`/users/${user.id}`, form);
      setUser(data.user || { ...user, ...form });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleLangChange = (l: "en" | "ny") => {
    setLang(l);
    setLanguage(l);
  };

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black mb-6">Settings</h1>

      {success && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-xl px-4 py-3 text-green-700 dark:text-green-300 text-sm mb-4">
          Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Profile photo */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
        <h2 className="text-sm font-bold mb-4">Profile Photo</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-black text-primary overflow-hidden">
            {form.profilePhoto ? (
              <img src={form.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user.name?.charAt(0)
            )}
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium block mb-1">Photo URL</label>
            <input
              type="url"
              value={form.profilePhoto}
              onChange={e => set("profilePhoto", e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">Enter a URL to your profile photo</p>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
        <h2 className="text-sm font-bold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-1 block">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="Your full name"
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => set("phone", e.target.value)}
                placeholder="0999123456"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">WhatsApp Number</label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={e => set("whatsapp", e.target.value)}
                placeholder="0999123456"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block">Location</label>
            <select
              value={form.location}
              onChange={e => set("location", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block">Bio / About You</label>
            <textarea
              value={form.bio}
              onChange={e => set("bio", e.target.value)}
              placeholder="Tell customers about yourself and your skills..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
        <h2 className="text-sm font-bold mb-4">Appearance</h2>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium">Dark Mode</div>
            <div className="text-xs text-muted-foreground">Switch between light and dark theme</div>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-all ${theme === "dark" ? "bg-primary" : "bg-muted"} relative`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all ${theme === "dark" ? "left-6" : "left-0.5"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Language</div>
            <div className="text-xs text-muted-foreground">English or Chichewa</div>
          </div>
          <div className="flex rounded-lg border border-input overflow-hidden">
            <button
              onClick={() => handleLangChange("en")}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${lang === "en" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              English
            </button>
            <button
              onClick={() => handleLangChange("ny")}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${lang === "ny" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              Chichewa
            </button>
          </div>
        </div>
      </div>

      {/* Account info (read-only) */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
        <h2 className="text-sm font-bold mb-3">Account Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Verified</span>
            <span className={user.isVerified ? "text-green-600 font-medium" : "text-muted-foreground"}>
              {user.isVerified ? "Yes" : "No — MK 10,000/mo"}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <><Save size={16} /> Save Changes</>
        )}
      </button>
    </div>
  );
}
