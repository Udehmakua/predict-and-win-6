CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS public.predictions CASCADE;

CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  predictions JSONB NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT predictions_pkey PRIMARY KEY (id),
  CONSTRAINT predictions_user_id_week_number_year_key UNIQUE (user_id, week_number, year)
);

CREATE INDEX idx_predictions_week
  ON public.predictions(year, week_number);

CREATE INDEX idx_predictions_user
  ON public.predictions(user_id);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit predictions"
  ON public.predictions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can check own submission"
  ON public.predictions
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT USAGE ON SCHEMA public
  TO anon, authenticated, service_role;

GRANT INSERT, SELECT
  ON TABLE public.predictions
  TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.predictions
  TO service_role;
