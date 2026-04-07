
-- Add photo_url column to students table
ALTER TABLE public.students ADD COLUMN photo_url TEXT;

-- Create storage bucket for student photos
INSERT INTO storage.buckets (id, name, public) VALUES ('student-photos', 'student-photos', true);

-- Allow public read access
CREATE POLICY "Student photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-photos');

-- Allow anyone to upload student photos (no auth yet)
CREATE POLICY "Anyone can upload student photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'student-photos');

-- Allow anyone to update student photos
CREATE POLICY "Anyone can update student photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'student-photos');

-- Allow anyone to delete student photos
CREATE POLICY "Anyone can delete student photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'student-photos');
