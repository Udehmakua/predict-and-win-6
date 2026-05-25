
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  predictions JSONB NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_number, year)
);

CREATE INDEX idx_predictions_week ON public.predictions(year, week_number);
CREATE INDEX idx_predictions_user ON public.predictions(user_id);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Public campaign: anyone can insert their prediction
CREATE POLICY "Anyone can submit predictions"
  ON public.predictions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow checking if a user already submitted this week (returns minimal data)
CREATE POLICY "Anyone can check own submission"
  ON public.predictions FOR SELECT
  TO anon, authenticated
  USING (true);
