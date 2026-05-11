import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Save, FileText, Download, Star, MessageSquare, GraduationCap } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import NoteCard from "@/components/NoteCard";
import { Note } from "@/data/notes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [myNotes, setMyNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState({ uploads: 0, downloads: 0, ratings: 0, comments: 0 });

  useEffect(() => {
    if (!user) return;

    const init = async () => {
      const { data: prof } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (prof) {
        setDisplayName(prof.display_name ?? "");
        setBio(prof.bio ?? "");
        setCollege(prof.college ?? "");
      } else {
        // create empty profile if missing (rare)
        await supabase.from("profiles").insert({ user_id: user.id, display_name: user.email?.split("@")[0] ?? "" });
        setDisplayName(user.email?.split("@")[0] ?? "");
      }

      const { data: notes } = await supabase
        .from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      const list = (notes as Note[]) ?? [];
      setMyNotes(list);

      const { count: rCount } = await supabase.from("ratings").select("id", { count: "exact", head: true }).eq("user_id", user.id);
      const { count: cCount } = await supabase.from("comments").select("id", { count: "exact", head: true }).eq("user_id", user.id);

      setStats({
        uploads: list.length,
        downloads: list.reduce((s, n) => s + (n.downloads ?? 0), 0),
        ratings: rCount ?? 0,
        comments: cCount ?? 0,
      });
      setLoading(false);
    };
    init();
  }, [user]);

  if (authLoading) return <Layout><div className="container py-20"><Skeleton className="h-96 rounded-2xl" /></div></Layout>;
  if (!user) return <Navigate to="/login" replace />;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert(
      { user_id: user.id, display_name: displayName, bio, college },
      { onConflict: "user_id" }
    );
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated!");
  };

  const initial = (displayName || user.email || "U")[0].toUpperCase();
  const statCards = [
    { icon: FileText, label: "Uploads", value: stats.uploads },
    { icon: Download, label: "Total Downloads", value: stats.downloads },
    { icon: Star, label: "Ratings Given", value: stats.ratings },
    { icon: MessageSquare, label: "Comments", value: stats.comments },
  ];

  return (
    <Layout>
      <section className="container max-w-5xl py-10">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden rounded-3xl glass-strong p-8 shadow-elegant">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 animate-blob rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 animate-blob rounded-full bg-accent/30 blur-3xl" style={{ animationDelay: "5s" }} />
          <div className="relative flex flex-col items-center gap-6 md:flex-row">
            <div className="relative">
              <div className="absolute inset-0 animate-blob rounded-3xl bg-gradient-hero blur-2xl opacity-50" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-hero shadow-glow">
                <span className="text-4xl font-black text-primary-foreground">{initial}</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{displayName || "Your Profile"}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {college && <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground"><GraduationCap className="h-4 w-4" /> {college}</p>}
              {bio && <p className="mt-3 max-w-xl text-sm text-foreground/80">{bio}</p>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-2xl glass p-5 transition-spring hover:-translate-y-1 hover:shadow-glow">
              <s.icon className="mb-2 h-5 w-5 text-primary" />
              <div className="text-2xl font-bold text-gradient">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Edit form */}
        <div className="mb-10 rounded-2xl glass p-6">
          <h2 className="mb-4 text-lg font-bold">Edit Profile</h2>
          {loading ? <Skeleton className="h-40" /> : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="dn">Display Name</Label>
                <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="glass" maxLength={60} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="college">College / Institution</Label>
                <Input id="college" value={college} onChange={(e) => setCollege(e.target.value)} className="glass" maxLength={120} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short intro about you..." className="glass" maxLength={300} />
                <p className="text-xs text-muted-foreground">{bio.length}/300</p>
              </div>
              <Button onClick={save} disabled={saving} className="bg-gradient-hero text-primary-foreground shadow-glow">
                <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        {/* My uploads */}
        <div>
          <h2 className="mb-4 text-lg font-bold">My Uploads</h2>
          {myNotes.length === 0 ? (
            <div className="rounded-2xl glass p-10 text-center text-sm text-muted-foreground">
              You haven't uploaded any notes yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {myNotes.map((n) => <NoteCard key={n.id} note={n} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
