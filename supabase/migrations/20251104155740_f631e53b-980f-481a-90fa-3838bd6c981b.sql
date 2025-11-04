-- Create translations table to store translation history
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_translations_user_id ON public.translations(user_id);
CREATE INDEX idx_translations_created_at ON public.translations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies for translations (public access for now, can be restricted later)
CREATE POLICY "Allow public read access to translations" 
ON public.translations 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to translations" 
ON public.translations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public delete own translations" 
ON public.translations 
FOR DELETE 
USING (true);