import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Database, Code, Coffee, Upload, Download, Sparkles,
  ShieldCheck, Zap, GraduationCap, Star, ArrowRight, FileText,
  Globe, Cpu, Network, MessageSquare, Filter, UserCircle, TrendingUp,
} from "lucide-react";
import Layout from "@/components/Layout";
import NoteCard from "@/components/NoteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Note } from "@/data/notes";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { name: "DSA", icon: Code },
  { name: "DBMS", icon: Database },
  { name: "Java", icon: Coffee },
  { name: "Web Development", icon: Globe },
  { name: "Operating Systems", icon: Cpu },
  { name: "Computer Networks", icon: Network },
];

const features = [
  { icon: Star, title: "Ratings & Reviews", desc: "Rate notes and read what others think — quality you can trust." },
  { icon: Filter, title: "Smart Filters", desc: "Sort by popularity, recency, or rating. Find gold in seconds." },
  { icon: UserCircle, title: "Personal Profiles", desc: "Track your uploads, downloads and contributions in one place." },
  { icon: ShieldCheck, title: "Cloud Storage", desc: "Encrypted, fast and reliable file delivery — no broken links." },
  { icon: Zap, title: "Lightning Fast", desc: "Optimized search and previews built for exam-week pressure." },
  { icon: Sparkles, title: "Always Free", desc: "No paywalls, no ads, no spam. Built for students." },
];

const steps = [
  { n: "01", title: "Sign Up", desc: "Free account in 10 seconds — just email and password." },
  { n: "02", title: "Discover & Rate", desc: "Search smart, filter fast, and rate notes that helped you." },
  { n: "03", title: "Share Back", desc: "Upload your notes and earn appreciation from juniors." },
];

const testimonials = [
  { name: "Priya S.", role: "BCA 5th Sem", text: "The rating system is genius — I always pick top-rated notes. Saved me hours.", rating: 5 },
  { name: "Rohit K.", role: "BCA 3rd Sem", text: "Way smoother than WhatsApp groups. The filter by semester is so handy.", rating: 5 },
  { name: "Anjali M.", role: "BCA 6th Sem", text: "My profile shows 250+ downloads on my notes. Feels good to actually help people.", rating: 5 },
];

const Home = () => {
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ notes: 0, downloads: 0, ratings: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("notes").select("*").order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => { setRecent((data as Note[]) ?? []); setLoading(false); });

    supabase.from("notes").select("downloads").then(({ data }) => {
      if (data) setStats((s) => ({ ...s, notes: data.length, downloads: data.reduce((a, n: any) => a + (n.downloads ?? 0), 0) }));
    });
    supabase.from("ratings").select("id", { count: "exact", head: true }).then(({ count }) => {
      setStats((s) => ({ ...s, ratings: count ?? 0 }));
    });
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/notes?q=${encodeURIComponent(q)}`);
  };

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-32 top-10 h-96 w-96 animate-blob rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -right-32 top-40 h-96 w-96 animate-blob rounded-full bg-accent/30 blur-3xl" style={{ animationDelay: "5s" }} />
          <div className="absolute left-1/2 bottom-0 h-72 w-72 -translate-x-1/2 animate-blob rounded-full bg-primary-glow/20 blur-3xl" style={{ animationDelay: "10s" }} />
        </div>

        <div className="container py-24 text-center">
          <div className="mx-auto mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Now with ratings, reviews &amp; smart filters</span>
          </div>
          <h1 className="mb-5 animate-fade-in-up text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
            Your <span className="text-gradient">smartest</span> study
            <br />companion is here
          </h1>
          <p className="mx-auto mb-10 max-w-2xl animate-fade-in text-base text-muted-foreground sm:text-lg">
            Discover top-rated college notes, share what you know, and grow with a community
            that actually cares about quality.
          </p>

          <form onSubmit={onSearch} className="mx-auto mb-6 flex max-w-xl animate-scale-in gap-2 rounded-2xl glass-strong p-2 shadow-elegant">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Try DBMS, Web Dev, Operating Systems..."
                className="h-12 border-0 bg-transparent pl-11 text-base focus-visible:ring-0"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 bg-gradient-hero text-primary-foreground shadow-glow transition-spring hover:scale-105">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="outline" className="glass">
              <Link to="/notes">Browse Notes <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground shadow-glow transition-spring hover:scale-105">
              <Link to="/upload"><Upload className="mr-2 h-4 w-4" /> Share Notes</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4">
            {[
              { label: "Notes Live", value: stats.notes || "—", icon: FileText },
              { label: "Downloads", value: stats.downloads || "—", icon: Download },
              { label: "Ratings", value: stats.ratings || "—", icon: Star },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 transition-spring hover:-translate-y-1 hover:shadow-glow">
                <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <div className="text-3xl font-bold text-gradient">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-20">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-block rounded-full glass px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Subjects</div>
          <h2 className="mb-2 text-3xl font-bold sm:text-4xl">Pick your subject</h2>
          <p className="text-muted-foreground">Curated by semester &amp; difficulty</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link
              key={c.name}
              to={`/notes?subject=${encodeURIComponent(c.name)}`}
              style={{ animationDelay: `${i * 60}ms` }}
              className="group flex flex-col items-center gap-3 rounded-2xl glass p-6 text-center animate-fade-in-up transition-spring hover:-translate-y-2 hover:shadow-glow"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-glow transition-spring group-hover:rotate-12 group-hover:scale-110">
                <c.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-block rounded-full glass px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Features</div>
            <h2 className="mb-2 text-3xl font-bold sm:text-4xl">Built for serious students</h2>
            <p className="text-muted-foreground">Everything you need, beautifully designed</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                style={{ animationDelay: `${i * 80}ms` }}
                className="group relative animate-fade-in-up rounded-2xl glass p-6 transition-spring hover:-translate-y-2 hover:shadow-elegant"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-hero opacity-0 blur-3xl transition-smooth group-hover:opacity-30" />
                <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-glow transition-spring group-hover:rotate-6 group-hover:scale-110">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT */}
      <section className="container py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <TrendingUp className="h-3 w-3" /> Trending
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">Fresh from the nest</h2>
          </div>
          <Link to="/notes" className="group inline-flex items-center gap-1 text-sm font-semibold text-gradient hover:underline">
            View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="rounded-2xl glass p-12 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="mb-1 font-semibold">No notes yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first — <Link to="/upload" className="text-gradient font-semibold hover:underline">upload a note</Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((n) => <NoteCard key={n.id} note={n} />)}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-block rounded-full glass px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">How it works</div>
            <h2 className="text-3xl font-bold sm:text-4xl">Three simple steps</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.n} style={{ animationDelay: `${i * 100}ms` }} className="relative animate-fade-in-up rounded-2xl glass p-8 transition-spring hover:-translate-y-2 hover:shadow-glow">
                <div className="mb-4 text-5xl font-black text-gradient">{s.n}</div>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-20">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-block rounded-full glass px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Loved by students</div>
          <h2 className="text-3xl font-bold sm:text-4xl">What our community says</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={t.name} style={{ animationDelay: `${i * 80}ms` }} className="animate-fade-in-up rounded-2xl glass p-6 transition-spring hover:-translate-y-2 hover:shadow-elegant">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="mb-5 text-sm leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-hero text-sm font-bold text-primary-foreground shadow-glow">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEVELOPER */}
      <section className="container py-20">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 shadow-elegant md:p-14">
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 animate-blob rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 animate-blob rounded-full bg-accent/30 blur-3xl" style={{ animationDelay: "5s" }} />

          <div className="relative grid items-center gap-10 md:grid-cols-[auto,1fr]">
            <div className="mx-auto md:mx-0">
              <div className="relative">
                <div className="absolute inset-0 animate-blob rounded-3xl bg-gradient-hero blur-2xl opacity-50" />
                <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl bg-gradient-hero shadow-glow">
                  <span className="text-5xl font-black text-primary-foreground">A</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-sm font-medium text-primary">
                <Code className="h-3.5 w-3.5" /> About the developer
              </div>
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">
                Crafted by <span className="text-gradient">Alisha Naaz &amp; Punam Sarode</span>
              </h2>
              <p className="mb-2 text-lg font-medium text-muted-foreground">Full Stack Developer</p>
              <p className="mb-5 max-w-xl leading-relaxed text-muted-foreground">
                CampusNote is a final-year solo project by a{" "}
                <span className="font-semibold text-foreground">BCA 6th Semester</span> student at{" "}
                <span className="font-semibold text-foreground">IPS College, Chhindwara (M.P.)</span>.
                Designed, engineered and shipped end-to-end with a focus on craft, clarity, and real student value.
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {["React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Cloud", "Glassmorphism"].map((t) => (
                  <span key={t} className="rounded-full glass px-3 py-1 text-xs font-semibold">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 text-center shadow-elegant sm:p-16">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-10 -top-10 h-48 w-48 animate-blob rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-48 w-48 animate-blob rounded-full bg-white blur-3xl" style={{ animationDelay: "5s" }} />
          </div>
          <div className="relative">
            <MessageSquare className="mx-auto mb-4 h-10 w-10 text-primary-foreground" />
            <h2 className="mb-3 text-3xl font-bold text-primary-foreground sm:text-4xl">Ready to make studying easier?</h2>
            <p className="mx-auto mb-7 max-w-xl text-primary-foreground/90">
              Join the smart way to share, rate and discover study notes.
            </p>
            <Button asChild size="lg" variant="secondary" className="glass-strong text-foreground shadow-elegant transition-spring hover:-translate-y-0.5 hover:scale-105">
              <Link to="/signup"><Sparkles className="mr-2 h-4 w-4" /> Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
