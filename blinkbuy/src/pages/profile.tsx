import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { MapPin, Star, CheckCircle, Award, MessageCircle, Phone, Briefcase, Edit, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { formatMK } from "@/lib/auth";
import { ServiceCard } from "@/components/ServiceCard";

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [uData, sData, rData] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/services?workerId=${id}&limit=6`),
          api.get(`/users/${id}/reviews`),
        ]);
        setProfile(uData.user || uData);
        setServices(sData.services || []);
        setReviews(rData.reviews || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-24 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-2">User not found</h2>
        <Link href="/" className="text-primary hover:underline">Go home</Link>
      </div>
    );
  }

  const isOwnProfile = user?.id === id;

  const strengthPct = Math.min(100, [
    profile.name ? 20 : 0,
    profile.bio ? 20 : 0,
    profile.profilePhoto ? 20 : 0,
    profile.phone ? 20 : 0,
    profile.location ? 20 : 0,
  ].reduce((a, b) => a + b, 0));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden mb-4">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-[hsl(215,55%,12%)] to-[hsl(210,100%,40%)]" />
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-10 mb-3">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-card bg-primary/10 flex items-center justify-center text-2xl font-black text-primary">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  profile.name?.charAt(0)
                )}
              </div>
              {profile.isOnline && (
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex gap-2 items-center mt-2">
              {isOwnProfile && (
                <Link href="/settings" className="flex items-center gap-1 text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-all">
                  <Edit size={12} /> Edit Profile
                </Link>
              )}
              {!isOwnProfile && profile.whatsapp && (
                <a
                  href={`https://wa.me/265${profile.whatsapp.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-all"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              )}
              {!isOwnProfile && profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-1 text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-all"
                >
                  <Phone size={12} /> Call
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-black">{profile.name}</h1>
            {profile.isVerified && <CheckCircle size={16} className="text-primary" />}
            {profile.isTrusted && <Award size={16} className="text-amber-500" />}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1"><MapPin size={13} />{profile.location || "Malawi"}</div>
            {profile.role && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full capitalize">{profile.role}</span>
            )}
            {profile.isOnline ? (
              <span className="flex items-center gap-1 text-xs text-green-600"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" />Online</span>
            ) : (
              <span className="text-xs text-muted-foreground">Offline</span>
            )}
          </div>

          {profile.bio && <p className="text-sm text-muted-foreground mb-3">{profile.bio}</p>}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted rounded-lg p-2 text-center">
              <div className="text-lg font-black">{profile.jobsCompleted || 0}</div>
              <div className="text-xs text-muted-foreground">Jobs Done</div>
            </div>
            <div className="bg-muted rounded-lg p-2 text-center">
              <div className="text-lg font-black flex items-center justify-center gap-1">
                {(profile.rating || 0).toFixed(1)}
                <Star size={13} className="fill-amber-400 text-amber-400" />
              </div>
              <div className="text-xs text-muted-foreground">{profile.reviewCount || 0} Reviews</div>
            </div>
            <div className="bg-muted rounded-lg p-2 text-center">
              <div className="text-lg font-black">{services.length}</div>
              <div className="text-xs text-muted-foreground">Services</div>
            </div>
          </div>
        </div>

        {/* Profile strength — own profile only */}
        {isOwnProfile && (
          <div className="px-5 pb-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Profile Strength</span>
              <span className="text-xs text-muted-foreground">{strengthPct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full strength-gradient rounded-full transition-all"
                style={{ width: `${strengthPct}%` }}
              />
            </div>
            {strengthPct < 100 && (
              <p className="text-xs text-muted-foreground mt-1">Complete your profile to get more bookings</p>
            )}
          </div>
        )}
      </div>

      {/* Services */}
      {services.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-black mb-3">Services Offered</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map(s => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div>
        <h2 className="text-base font-black mb-3">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <div className="bg-card border border-card-border rounded-xl p-5 text-center text-muted-foreground text-sm">
            No reviews yet
          </div>
        ) : (
          <div className="bg-card border border-card-border rounded-xl divide-y divide-border">
            {reviews.map(review => (
              <div key={review.id} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {review.reviewer?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{review.reviewer?.name}</div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={10} className={s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
