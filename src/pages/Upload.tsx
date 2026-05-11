import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileText } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { subjects, semesters } from "@/data/notes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const Upload = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to upload notes");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!file) return toast.error("Please choose a file");
    if (file.size > MAX_FILE_SIZE) return toast.error("File too large (max 20MB)");
    if (!subject || !semester) return toast.error("Select subject and semester");

    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop() ?? "pdf";
      const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("note-files")
        .upload(filePath, file, { contentType: file.type });
      if (uploadErr) throw uploadErr;

      const { error: insertErr } = await supabase.from("notes").insert({
        user_id: user.id,
        title: title.trim(),
        subject,
        semester,
        description: description.trim() || null,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
      });
      if (insertErr) throw insertErr;

      toast.success("Notes uploaded successfully!");
      navigate("/notes");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="container max-w-2xl py-10">
        <h1 className="mb-1 text-2xl font-bold text-foreground">Upload Notes</h1>
        <p className="mb-6 text-sm text-muted-foreground">Share your notes with fellow students.</p>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. DBMS Unit 1 Notes" required maxLength={150} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Subject</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Semester</Label>
                  <Select value={semester} onValueChange={setSemester} required>
                    <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                    <SelectContent>
                      {semesters.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="desc">Short Description (optional)</Label>
                <Textarea id="desc" rows={3} maxLength={500} placeholder="What do these notes cover?" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label>File</Label>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 p-8 text-center hover:bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {file ? file.name : "Click to choose a PDF file"}
                  </span>
                  <span className="text-xs text-muted-foreground">PDF, DOCX up to 20MB</span>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                <UploadIcon className="mr-2 h-4 w-4" /> {submitting ? "Uploading..." : "Upload Notes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default Upload;
