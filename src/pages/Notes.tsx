import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import Layout from "@/components/Layout";
import NoteCard from "@/components/NoteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subjects, semesters, Note } from "@/data/notes";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

type SortKey = "recent" | "popular" | "oldest" | "title";

const Notes = () => {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const subject = params.get("subject") ?? "all";
  const semester = params.get("semester") ?? "all";
  const sort = (params.get("sort") as SortKey) || "recent";
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("notes").select("*").then(({ data }) => {
      setNotes((data as Note[]) ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let arr = notes.filter((n) => {
      const matchQ = q ? (n.title + " " + n.subject + " " + (n.description ?? "")).toLowerCase().includes(q.toLowerCase()) : true;
      const matchS = subject === "all" ? true : n.subject === subject;
      const matchSem = semester === "all" ? true : n.semester === semester;
      return matchQ && matchS && matchSem;
    });
    switch (sort) {
      case "popular": arr = [...arr].sort((a, b) => b.downloads - a.downloads); break;
      case "oldest": arr = [...arr].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)); break;
      case "title": arr = [...arr].sort((a, b) => a.title.localeCompare(b.title)); break;
      default: arr = [...arr].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    }
    return arr;
  }, [q, subject, semester, sort, notes]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const clearAll = () => {
    setQ("");
    setParams(new URLSearchParams());
  };

  const activeFilters = [
    subject !== "all" && { key: "subject", val: subject },
    semester !== "all" && { key: "semester", val: semester },
    q && { key: "q", val: `"${q}"` },
  ].filter(Boolean) as { key: string; val: string }[];

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-20 top-0 h-64 w-64 animate-blob rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-20 top-0 h-64 w-64 animate-blob rounded-full bg-accent/20 blur-3xl" style={{ animationDelay: "5s" }} />
        </div>
        <div className="container py-12">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Filter className="h-3 w-3" /> Smart Search
          </div>
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Browse all notes</h1>
          <p className="mb-8 text-muted-foreground">Filter, sort and discover the best study material.</p>

          <div className="mb-5 grid gap-3 rounded-2xl glass-strong p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => { setQ(e.target.value); setParam("q", e.target.value); }}
                placeholder="Search notes..."
                className="h-11 pl-10 glass"
              />
            </div>
            <Select value={subject} onValueChange={(v) => setParam("subject", v)}>
              <SelectTrigger className="h-11 glass"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={semester} onValueChange={(v) => setParam("semester", v)}>
              <SelectTrigger className="h-11 glass"><SelectValue placeholder="Semester" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setParam("sort", v)}>
              <SelectTrigger className="h-11 glass"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Downloaded</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title (A–Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {activeFilters.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active:</span>
              {activeFilters.map((f) => (
                <span key={f.key} className="inline-flex items-center gap-1 rounded-full glass px-3 py-1 text-xs">
                  {f.val}
                </span>
              ))}
              <Button size="sm" variant="ghost" onClick={clearAll} className="h-7 text-xs">
                <X className="mr-1 h-3 w-3" /> Clear all
              </Button>
            </div>
          )}

          <p className="mb-5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> note{filtered.length !== 1 ? "s" : ""} found
          </p>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
              No notes found. {notes.length === 0 ? "Be the first to upload!" : "Try changing the filters."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((n) => <NoteCard key={n.id} note={n} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Notes;
