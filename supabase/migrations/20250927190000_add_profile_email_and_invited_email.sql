BEGIN;

-- Add email column to profiles and backfill from auth.users
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

UPDATE public.profiles AS p
SET email = u.email
FROM auth.users AS u
WHERE p.id = u.id
  AND u.email IS NOT NULL
  AND p.email IS DISTINCT FROM u.email;

DO $$
BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE (email);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Ensure signup trigger captures the email value
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
  SET username = COALESCE(EXCLUDED.username, public.profiles.username),
      email = COALESCE(EXCLUDED.email, public.profiles.email);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rename collaborator email column and refresh unique constraint
ALTER TABLE public.board_collaborators
  RENAME COLUMN email TO invited_email;

ALTER TABLE public.board_collaborators
  DROP CONSTRAINT IF EXISTS board_collaborators_board_id_email_key;

ALTER TABLE public.board_collaborators
  ADD CONSTRAINT board_collaborators_board_id_invited_email_key UNIQUE (board_id, invited_email);

COMMIT;
