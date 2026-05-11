import { Link } from "react-router-dom";
import { Sparkles, Github, Linkedin, Instagram, Mail, GraduationCap } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border/50">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-glow">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Notes<span className="text-gradient">Bridge</span></span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A smart note-sharing platform with ratings, reviews and lightning-fast filters.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="transition-smooth hover:text-primary">Home</Link></li>
              <li><Link to="/notes" className="transition-smooth hover:text-primary">Browse Notes</Link></li>
              <li><Link to="/upload" className="transition-smooth hover:text-primary">Upload</Link></li>
              <li><Link to="/about" className="transition-smooth hover:text-primary">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/notes?subject=DSA" className="transition-smooth hover:text-primary">DSA</Link></li>
              <li><Link to="/notes?subject=DBMS" className="transition-smooth hover:text-primary">DBMS</Link></li>
              <li><Link to="/notes?subject=Java" className="transition-smooth hover:text-primary">Java</Link></li>
              <li><Link to="/notes?subject=Web Development" className="transition-smooth hover:text-primary">Web Dev</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Developer</h3>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="text-base font-semibold text-foreground">Alisha Naaz</p>
              <p className="text-xs">Full Stack Developer</p>
              <p className="flex items-center gap-1.5 pt-1">
                <GraduationCap className="h-4 w-4" /> BCA — 6th Semester
              </p>
              <p>IPS College, Chhindwara</p>
            </div>
            <div className="mt-3 flex gap-2">
              {[
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Mail, href: "mailto:alisha@example.com", label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg glass transition-spring hover:scale-110 hover:bg-gradient-hero hover:text-primary-foreground hover:shadow-glow"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/50 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {year} NotesBridge — Crafted with <span className="text-gradient font-semibold">passion</span> by Alisha Naaz</p>
          <p>Built on React, TypeScript &amp; Cloud</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
