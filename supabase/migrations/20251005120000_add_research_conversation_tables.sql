-- Create table to store research sessions
create table if not exists public.research_sessions (
  id uuid primary key default gen_random_uuid(),
  session_identifier text not null unique,
  user_id uuid references auth.users (id),
  title text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  last_message_at timestamptz
);

-- Create table to store messages within a research session
create table if not exists public.research_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.research_sessions (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  sources jsonb,
  tokens_used integer,
  model text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists research_messages_session_id_created_at_idx
  on public.research_messages (session_id, created_at);

-- Enable row level security and allow read access for all clients
alter table public.research_sessions enable row level security;
alter table public.research_messages enable row level security;

create policy if not exists "Allow read access to research sessions"
  on public.research_sessions for select
  using (true);

create policy if not exists "Allow read access to research messages"
  on public.research_messages for select
  using (true);
