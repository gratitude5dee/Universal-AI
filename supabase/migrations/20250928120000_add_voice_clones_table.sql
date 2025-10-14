-- Create voice_clones table to store user-owned ElevenLabs voice clones
create table if not exists public.voice_clones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  voice_id text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure each ElevenLabs voice is only associated once in this table
create unique index if not exists voice_clones_voice_id_key on public.voice_clones(voice_id);
create index if not exists voice_clones_user_id_idx on public.voice_clones(user_id);

-- Enable row level security and allow users to manage their own voice clones
alter table public.voice_clones enable row level security;

create policy if not exists "Users can select their voice clones"
  on public.voice_clones
  for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their voice clones"
  on public.voice_clones
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their voice clones"
  on public.voice_clones
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "Users can delete their voice clones"
  on public.voice_clones
  for delete
  using (auth.uid() = user_id);

-- Reuse shared trigger for keeping updated_at current
drop trigger if exists update_voice_clones_updated_at on public.voice_clones;
create trigger update_voice_clones_updated_at
  before update on public.voice_clones
  for each row
  execute function public.update_updated_at_column();
