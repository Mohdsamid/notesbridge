import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, FileText, ArrowLeft, Star, Send, Trash2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/data/notes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Comment = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  display_name?: string;
};

const NoteDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [myStars, setMyStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");

  const loadRatings = async () => {
    if (!id) return;
    const { data } = await supabase.from("ratings").select("stars, user_id").eq("note_id", id);
    if (data?.length) {
      setAvgRating(Number((data.reduce((s, r: any) => s + r.stars, 0) / data.length).toFixed(1)));
      setRatingCount(data.length);
      if (user) {
        const mine = data.find((r: any) => r.user_id === user.id);
        setMyStars(mine?.stars ?? 0);
      }
    } else {
      setAvgRating(0); setRatingCount(0); setMyStars(0);
    }
  };

  const loadComments = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("comments").select("id, user_id, body, created_at")
      .eq("note_id", id).order("created_at", { ascending: false });
    if (!data) return;
    const ids = Array.from(new Set(data.map((c: any) => c.user_id)));
    const { data: profs } = await supabase.from("profiles").select("user_id, display_name").in("user_id", ids);
    const nameMap = new Map((profs ?? []).map((p: any) => [p.user_id, p.display_name]));
    setComments(data.map((c: any) => ({ ...c, display_name: nameMap.get(c.user_id) ?? "Student" })));
  };

  useEffect(() => {
    if (!id) return;
    supabase.from("notes").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      const n = data as Note | null;
      setNote(n);
      if (n) {
        const { data: urlData } = supabase.storage.from("note-files").getPublicUrl(n.file_path);
        setFileUrl(urlData.publicUrl);
      }
      setLoading(false);
    });
    loadRatings();
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id]);

  const isPdf = note?.file_name?.toLowerCase().endsWith(".pdf");

  const handleDownload = async () => {
    if (!note) return;
    await supabase.from("notes").update({ downloads: note.downloads + 1 }).eq("id", note.id);
    setNote({ ...note, downloads: note.downloads + 1 });
    window.open(fileUrl, "_blank");
  };

  const handleRate = async (stars: number) => {
    if (!user) return toast.error("Please log in to rate");
    if (!id) return;
    const { error } = await supabase.from("ratings").upsert(
      { note_id: id, user_id: user.id, stars },
      { onConflict: "note_id,user_id" }
    );
    if (error) toast.error(error.message);
    else { setMyStars(stars); toast.success("Thanks for rating!"); loadRatings(); }
  };

  const submitComment = async () => {
    if (!user) return toast.error("Please log in to comment");
    if (!id || !body.trim()) return;
    const { error } = await supabase.from("comments").insert({ note_id: id, user_id: user.id, body: body.trim() });
    if (error) toast.error(error.message);
    else { setBody(""); loadComments(); toast.success("Comment posted"); }
  };

  const deleteComment = async (cid: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", cid);
    if (error) toast.error(error.message);
    else loadComments();
  };

  if (loading) {
    return <Layout><div className="container max-w-5xl py-8"><Skeleton className="h-96 w-full rounded-2xl" /></div></Layout>;
  }
  if (!note) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="mb-4 text-muted-foreground">Note not found.</p>
          <Button asChild><Link to="/notes">Back to Notes</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container max-w-5xl py-8">
        <Link to="/notes" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-smooth hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to notes
        </Link>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-2xl glass">
              {isPdf && fileUrl ? (
                <iframe src={`${fileUrl}#toolbar=1&view=FitH`} title={note.title} className="h-[70vh] w-full border-0 bg-muted/40" />
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-muted/40 text-muted-foreground">
                  <FileText className="h-16 w-16" />
                  <p className="text-sm">{note.file_name}</p>
                  <p className="text-xs">Preview not available</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl glass p-5">
              <h1 className="mb-2 text-xl font-bold">{note.title}</h1>
              {note.description && <p className="mb-4 text-sm text-muted-foreground">{note.description}</p>}
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{note.subject}</Badge>
                <Badge variant="outline">{note.semester}</Badge>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                {note.downloads} downloads · {new Date(note.created_at).toLocaleDateString()}
              </p>
              <Button onClick={handleDownload} className="w-full bg-gradient-hero text-primary-foreground shadow-glow transition-spring hover:scale-105">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>

            <div className="rounded-2xl glass p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Rating</h3>
                <span className="text-sm text-muted-foreground">
                  {ratingCount > 0 ? <><span className="font-bold text-foreground">{avgRating}</span> · {ratingCount} {ratingCount === 1 ? "vote" : "votes"}</> : "No ratings yet"}
                </span>
              </div>
              <div className="flex gap-1" onMouseLeave={() => setHoverStars(0)}>
                {[1, 2, 3, 4, 5].map((s) => {
                  const filled = (hoverStars || myStars) >= s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverStars(s)}
                      onClick={() => handleRate(s)}
                      className="transition-spring hover:scale-125"
                      aria-label={`${s} star${s > 1 ? "s" : ""}`}
                    >
                      <Star className={`h-7 w-7 ${filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                    </button>
                  );
                })}
              </div>
              {!user && <p className="mt-2 text-xs text-muted-foreground"><Link to="/login" className="text-gradient font-semibold hover:underline">Log in</Link> to rate</p>}
            </div>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="mt-10 rounded-2xl glass p-6">
          <h2 className="mb-4 text-lg font-bold">Comments ({comments.length})</h2>

          {user ? (
            <div className="mb-6 space-y-2">
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your thoughts on this note..."
                maxLength={1000}
                className="glass"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{body.length}/1000</span>
                <Button onClick={submitComment} disabled={!body.trim()} size="sm" className="bg-gradient-hero text-primary-foreground">
                  <Send className="mr-1.5 h-4 w-4" /> Post
                </Button>
              </div>
            </div>
          ) : (
            <p className="mb-6 text-sm text-muted-foreground">
              <Link to="/login" className="text-gradient font-semibold hover:underline">Log in</Link> to leave a comment
            </p>
          )}

          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="rounded-xl glass p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-hero text-xs font-bold text-primary-foreground">
                        {(c.display_name ?? "S")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{c.display_name}</div>
                        <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                    {user?.id === c.user_id && (
                      <Button size="icon" variant="ghost" onClick={() => deleteComment(c.id)} className="h-7 w-7">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{c.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NoteDetail;
