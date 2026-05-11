-- Notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  semester TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notes are viewable by everyone"
  ON public.notes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload notes"
  ON public.notes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON public.notes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.notes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_notes_subject ON public.notes(subject);
CREATE INDEX idx_notes_semester ON public.notes(semester);
CREATE INDEX idx_notes_created_at ON public.notes(created_at DESC);

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket (public so files can be downloaded directly)
INSERT INTO storage.buckets (id, name, public)
VALUES ('note-files', 'note-files', true);

CREATE POLICY "Note files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'note-files');

CREATE POLICY "Authenticated users can upload note files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'note-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own note files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'note-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own note files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'note-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );