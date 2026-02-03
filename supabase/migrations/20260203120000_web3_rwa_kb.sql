-- Enable pgvector for embeddings
create extension if not exists "vector";

-- Knowledge base chunks (pgvector)
create table if not exists public.agent_memory_chunks (
  id uuid primary key default gen_random_uuid(),
  uri text not null,
  title text not null,
  body text not null,
  content_type text not null default 'text/markdown',
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  chunk text not null,
  source_uri text not null,
  embedding vector(1536),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists agent_memory_chunks_uri_idx on public.agent_memory_chunks (uri);
create index if not exists agent_memory_chunks_created_at_idx
  on public.agent_memory_chunks (created_at desc);
create index if not exists agent_memory_chunks_embedding_idx
  on public.agent_memory_chunks using ivfflat (embedding vector_cosine_ops);

alter table public.agent_memory_chunks enable row level security;

-- Vector search
create or replace function public.match_kb_chunks(
  query_embedding vector(1536),
  match_count int,
  match_threshold float,
  filter_metadata jsonb default null
)
returns table (
  id uuid,
  similarity float,
  chunk text,
  source_uri text,
  metadata jsonb
)
language sql stable
as $$
  select
    id,
    1 - (embedding <=> query_embedding) as similarity,
    chunk,
    source_uri,
    metadata
  from public.agent_memory_chunks
  where embedding is not null
    and (filter_metadata is null or metadata @> filter_metadata)
    and (1 - (embedding <=> query_embedding)) >= match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

create or replace function public.list_kb_items(
  limit_count int default 20,
  cursor_id uuid default null
)
returns table (
  id uuid,
  uri text,
  title text,
  summary text,
  metadata jsonb
)
language sql stable
as $$
  with cursor_row as (
    select created_at from public.agent_memory_chunks where id = cursor_id
  )
  select id, uri, title, summary, metadata
  from public.agent_memory_chunks
  where cursor_id is null
     or created_at < coalesce((select created_at from cursor_row), now())
  order by created_at desc
  limit limit_count;
$$;

create or replace function public.get_kb_item(item_id uuid)
returns table (
  id uuid,
  uri text,
  title text,
  body text,
  content_type text,
  summary text,
  metadata jsonb,
  embedding vector(1536)
)
language sql stable
as $$
  select id, uri, title, body, content_type, summary, metadata, embedding
  from public.agent_memory_chunks
  where id = item_id
  limit 1;
$$;

-- Idempotency tracking
create table if not exists public.idempotency_keys (
  id text primary key,
  payload_hash text not null,
  created_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz not null
);

create index if not exists idempotency_keys_expires_at_idx
  on public.idempotency_keys (expires_at);

alter table public.idempotency_keys enable row level security;

create or replace function public.ensure_idempotency_key(
  idempotency_key_in text,
  payload_hash_in text,
  ttl_seconds int default 86400
)
returns table (was_processed boolean)
language plpgsql security definer
as $$
declare
  existing public.idempotency_keys%rowtype;
  expires_at timestamptz;
begin
  if idempotency_key_in is null or length(trim(idempotency_key_in)) = 0 then
    raise exception 'idempotency_key is required';
  end if;
  if payload_hash_in is null or length(trim(payload_hash_in)) = 0 then
    raise exception 'payload_hash is required';
  end if;
  if ttl_seconds is null or ttl_seconds < 60 then
    ttl_seconds := 86400;
  end if;

  select * into existing from public.idempotency_keys where id = idempotency_key_in;
  if found then
    if existing.payload_hash <> payload_hash_in then
      raise exception 'Idempotency key already used with different payload';
    end if;
    if existing.expires_at <= now() then
      expires_at := now() + make_interval(secs => ttl_seconds);
      update public.idempotency_keys
      set payload_hash = payload_hash_in,
          created_at = timezone('utc', now()),
          expires_at = expires_at
      where id = idempotency_key_in;
      return query select false;
    end if;
    return query select true;
  end if;

  expires_at := now() + make_interval(secs => ttl_seconds);
  insert into public.idempotency_keys (id, payload_hash, expires_at)
  values (idempotency_key_in, payload_hash_in, expires_at);
  return query select false;
end;
$$;

-- Allowlisted SQL runner (SELECT-only)
create or replace function public.run_allowlisted_sql(
  statement_id text,
  sql_text text,
  parameters jsonb default '{}'::jsonb,
  row_limit int default 50
)
returns jsonb
language plpgsql security definer
as $$
declare
  query text;
  rows jsonb;
begin
  if sql_text is null or length(trim(sql_text)) = 0 then
    raise exception 'sql_text is required';
  end if;
  if position(';' in sql_text) > 0 then
    raise exception 'Multiple statements are not allowed';
  end if;
  if lower(trim(sql_text)) not like 'select %' then
    raise exception 'Only SELECT statements are allowed';
  end if;

  query := sql_text;
  for key, value in select * from jsonb_each_text(parameters) loop
    query := replace(query, ':' || key, quote_literal(value));
  end loop;

  if row_limit is null or row_limit < 1 then
    row_limit := 50;
  end if;

  query := query || ' limit ' || row_limit;

  execute format('select jsonb_agg(row_to_json(t)) from (%s) t', query) into rows;
  return jsonb_build_object('statement_id', statement_id, 'rows', coalesce(rows, '[]'::jsonb));
end;
$$;

-- RWA registry
create table if not exists public.rwa_assets (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null,
  asset_identifier text not null,
  chain text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists rwa_assets_identifier_idx
  on public.rwa_assets (asset_type, asset_identifier);

alter table public.rwa_assets enable row level security;

create table if not exists public.rwa_attestations (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.rwa_assets(id) on delete cascade,
  issuer text not null,
  attestation_type text not null,
  attestation_hash text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists rwa_attestations_asset_idx
  on public.rwa_attestations (asset_id, created_at desc);

alter table public.rwa_attestations enable row level security;

create table if not exists public.rwa_compliance_checks (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null,
  subject_id text not null,
  rule_set text,
  status text not null check (status in ('approved', 'rejected', 'pending')),
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists rwa_compliance_subject_idx
  on public.rwa_compliance_checks (subject_type, subject_id, created_at desc);

alter table public.rwa_compliance_checks enable row level security;

create table if not exists public.rwa_audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  subject_type text not null,
  subject_id text not null,
  correlation_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists rwa_audit_logs_subject_idx
  on public.rwa_audit_logs (subject_type, subject_id, created_at desc);

alter table public.rwa_audit_logs enable row level security;

create or replace function public.rwa_create_compliance_check(
  subject_type text,
  subject_id text,
  rule_set text,
  status text,
  reason text,
  expires_at timestamptz,
  metadata jsonb default '{}'::jsonb
)
returns table (
  id uuid,
  status text,
  created_at timestamptz
)
language plpgsql security definer
as $$
begin
  return query
  insert into public.rwa_compliance_checks (
    subject_type,
    subject_id,
    rule_set,
    status,
    reason,
    expires_at,
    metadata
  )
  values (
    subject_type,
    subject_id,
    rule_set,
    status,
    reason,
    expires_at,
    coalesce(metadata, '{}'::jsonb)
  )
  returning id, status, created_at;
end;
$$;

create or replace function public.rwa_get_compliance_status(
  check_id uuid
)
returns table (
  status text,
  reason text,
  expires_at timestamptz
)
language sql stable
as $$
  select status, reason, expires_at
  from public.rwa_compliance_checks
  where id = check_id
  limit 1;
$$;

create or replace function public.rwa_audit_append(
  event_type text,
  subject_type text,
  subject_id text,
  correlation_id text,
  metadata jsonb default '{}'::jsonb
)
returns table (
  id uuid,
  created_at timestamptz
)
language plpgsql security definer
as $$
begin
  return query
  insert into public.rwa_audit_logs (
    event_type,
    subject_type,
    subject_id,
    correlation_id,
    metadata
  )
  values (
    event_type,
    subject_type,
    subject_id,
    correlation_id,
    coalesce(metadata, '{}'::jsonb)
  )
  returning id, created_at;
end;
$$;
