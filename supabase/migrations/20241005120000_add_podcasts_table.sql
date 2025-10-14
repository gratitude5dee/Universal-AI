-- Create podcasts table for generated audio content
create extension if not exists "uuid-ossp";

create table if not exists public.podcasts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    audio_url text,
    audio_base64 text,
    voice_id text,
    style text,
    duration integer,
    created_at timestamptz not null default timezone('utc', now())
);

alter table public.podcasts enable row level security;

create policy "Users can view their own podcasts" on public.podcasts
    for select using (auth.uid() = user_id);

create policy "Users can create their own podcasts" on public.podcasts
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own podcasts" on public.podcasts
    for update using (auth.uid() = user_id);

create policy "Users can delete their own podcasts" on public.podcasts
    for delete using (auth.uid() = user_id);

create index if not exists podcasts_user_created_at_idx
    on public.podcasts (user_id, created_at desc);
