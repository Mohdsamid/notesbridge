import Layout from "@/components/Layout";
import { GraduationCap, MapPin, Code2, Database, Server, Palette, Sparkles, Users, Target, Lightbulb, Star, Filter, UserCircle } from "lucide-react";

const About = () => {
  const techStack = [
    { name: "React + TS", icon: Code2, desc: "Type-safe UI" },
    { name: "Tailwind CSS", icon: Palette, desc: "Glassmorphism design" },
    { name: "PostgreSQL", icon: Database, desc: "Relational data" },
    { name: "Cloud Backend", icon: Server, desc: "Auth, storage, API" },
  ];

  const features = [
    { icon: Star, title: "Ratings & Reviews", desc: "Crowd-sourced quality signal on every note." },
    { icon: Filter, title: "Smart Filters", desc: "Sort and search by subject, semester, popularity." },
    { icon: UserCircle, title: "User Profiles", desc: "Personal page with uploads & contributions." },
  ];

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-20 top-10 h-72 w-72 animate-blob rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-80 w-80 animate-blob rounded-full bg-accent/30 blur-3xl" style={{ animationDelay: "5s" }} />
        </div>
        <div className="container py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-3 text-4xl font-bold sm:text-5xl">About <span className="text-gradient">NotesBridge</span></h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A modern note-sharing platform with ratings, reviews, smart filters and user profiles —
            built solo as a BCA final-year project.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Target, title: "Our Goal", desc: "Make quality study material discoverable and trustworthy." },
            { icon: Users, title: "For Students", desc: "Built solo by a student, for students. No bloat." },
            { icon: Lightbulb, title: "Final Year Project", desc: "Showcasing modern full-stack engineering skills." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl glass p-6 transition-spring hover:-translate-y-1 hover:shadow-glow">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-glow">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 font-semibold text-lg">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-10">
        <h2 className="mb-6 text-2xl font-bold">What makes NotesBridge different</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl glass p-6 transition-spring hover:-translate-y-1 hover:shadow-glow">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-10">
        <h2 className="mb-6 text-2xl font-bold">Tech Stack</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techStack.map((t) => (
            <div key={t.name} className="rounded-2xl glass p-5 transition-spring hover:-translate-y-1 hover:shadow-glow">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-glow">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>
          {/*Alishaa  */}
      <section className="container py-10 pb-16">
        <h2 className="mb-6 text-2xl font-bold">Meet the Developer</h2>
        <div className="rounded-3xl glass-strong p-8 shadow-elegant md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[auto,1fr]">
            <div className="relative mx-auto md:mx-0">
              <div className="absolute inset-0 animate-blob rounded-3xl bg-gradient-hero blur-2xl opacity-50" />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-hero shadow-glow">
                <span className="text-5xl font-black text-primary-foreground">A</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold">Alisha Naaz</h3>
              <p className="mb-3 text-lg font-medium text-gradient">Full Stack Developer</p>
              <div className="mb-4 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground md:justify-start">
                <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> BCA — 6th Semester</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> IPS College, Chhindwara</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Passionate about building thoughtful, beautiful and useful web apps.
                NotesBridge reflects a love for clean UI, solid engineering and tools that
                actually solve real problems for fellow students.
              </p>
            </div>
          </div>
        </div>
      </section>
            {/* Punam */}
         <section className="container  pb-16">
        {/* <h2 className="mb-6 text-2xl font-bold">Meet the Developer</h2> */}
        <div className="rounded-3xl glass-strong p-8 shadow-elegant md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[auto,1fr]">
            <div className="relative mx-auto md:mx-0">
              <div className="absolute inset-0 animate-blob rounded-3xl bg-gradient-hero blur-2xl opacity-50" />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-hero shadow-glow">
                <span className="text-5xl font-black text-primary-foreground">A</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold">Punam Sarode</h3>
              <p className="mb-3 text-lg font-medium text-gradient">Developer &amp; Presentator</p>
              <div className="mb-4 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground md:justify-start">
                <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> BCA — 6th Semester</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> IPS College, Chhindwara</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Passionate about building thoughtful, beautiful and useful web apps.
                NotesBridge reflects a love for clean UI, solid engineering and tools that
                actually solve real problems for fellow students.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
