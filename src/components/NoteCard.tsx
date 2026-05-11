import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileText, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Note } from "@/data/notes";
import { supabase } from "@/integrations/supabase/client";

const NoteCard = ({ note }: { note: Note }) => {
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    supabase.from("ratings").select("stars").eq("note_id", note.id).then(({ data }) => {
      if (data && data.length) {
        const avg = data.reduce((s, r: any) => s + r.stars, 0) / data.length;
        setAvgRating(Number(avg.toFixed(1)));
        setRatingCount(data.length);
      }
    });
  }, [note.id]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { data } = supabase.storage.from("note-files").getPublicUrl(note.file_path);
    await supabase.from("notes").update({ downloads: note.downloads + 1 }).eq("id", note.id);
    window.open(data.publicUrl, "_blank");
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl glass p-5 transition-spring hover:-translate-y-2 hover:shadow-elegant">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-hero opacity-0 blur-3xl transition-smooth group-hover:opacity-30" />

      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-glow transition-spring group-hover:rotate-6 group-hover:scale-110">
          <FileText className="h-5 w-5" />
        </div>
        {avgRating !== null && (
          <div className="flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs font-semibold">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {avgRating}
            <span className="text-muted-foreground">({ratingCount})</span>
          </div>
        )}
      </div>

      <Link to={`/notes/${note.id}`} className="mb-2 line-clamp-2 text-base font-semibold transition-smooth hover:text-gradient">
        {note.title}
      </Link>
      <p className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Download className="h-3 w-3" /> {note.downloads} downloads
      </p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{note.subject}</Badge>
        <Badge variant="outline">{note.semester}</Badge>
      </div>
      <div className="mt-auto flex gap-2">
        <Button asChild size="sm" variant="outline" className="flex-1 glass">
          <Link to={`/notes/${note.id}`}>View</Link>
        </Button>
        <Button
          size="sm"
          onClick={handleDownload}
          className="flex-1 bg-gradient-hero text-primary-foreground shadow-soft transition-spring hover:shadow-glow"
        >
          <Download className="mr-1.5 h-4 w-4" /> Get
        </Button>
      </div>
    </div>
  );
};

export default NoteCard;
