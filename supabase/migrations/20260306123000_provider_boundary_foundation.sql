do $$
begin
  if not exists (select 1 from pg_type where typname = 'wallet_provider') then
    create type public.wallet_provider as enum (
      'thirdweb_evm',
      'solana_wallet_standard',
      'crossmint_custodial'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'execution_provider') then
    create type public.execution_provider as enum (
      'thirdweb_engine',
      'crossmint',
      'bags',
      'clanker',
      'bankr'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'launch_provider') then
    create type public.launch_provider as enum (
      'clanker',
      'bags',
      'bankr'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'custody_mode') then
    create type public.custody_mode as enum (
      'external_user',
      'delegated_server',
      'custodial_agent'
    );
  end if;
end
$$;

create table if not exists public.provider_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider_id text not null,
  status text not null default 'pending',
  secret_type text,
  connection_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider_id)
);

create table if not exists public.custodial_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wallet_provider public.wallet_provider not null default 'crossmint_custodial',
  custody_mode public.custody_mode not null default 'custodial_agent',
  chain text not null,
  wallet_id text,
  wallet_address text not null,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_tokens (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  symbol text not null,
  description text,
  chain text not null,
  launch_provider public.launch_provider not null,
  wallet_provider public.wallet_provider not null,
  execution_provider public.execution_provider not null,
  token_address text,
  launch_job_id uuid,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.token_launch_jobs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  creator_token_id uuid references public.creator_tokens(id) on delete set null,
  launch_provider public.launch_provider not null,
  wallet_provider public.wallet_provider not null,
  execution_provider public.execution_provider not null,
  custody_mode public.custody_mode not null default 'external_user',
  chain text not null,
  wallet_address text,
  status text not null default 'pending',
  request_payload jsonb not null default '{}'::jsonb,
  response_payload jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.token_launch_steps (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.token_launch_jobs(id) on delete cascade,
  provider public.execution_provider not null,
  step_key text not null,
  step_order integer not null default 0,
  status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.fee_claim_jobs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  creator_token_id uuid references public.creator_tokens(id) on delete set null,
  execution_provider public.execution_provider not null,
  chain text not null,
  wallet_address text,
  status text not null default 'pending',
  claim_amount numeric(38, 18),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.distribution_campaigns (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  creator_token_id uuid references public.creator_tokens(id) on delete set null,
  name text not null,
  status text not null default 'draft',
  launch_provider public.launch_provider,
  distribution_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists provider_connections_user_id_idx
  on public.provider_connections (user_id, updated_at desc);

create index if not exists custodial_wallets_user_id_idx
  on public.custodial_wallets (user_id, created_at desc);

create index if not exists creator_tokens_creator_id_idx
  on public.creator_tokens (creator_id, created_at desc);

create index if not exists token_launch_jobs_creator_id_idx
  on public.token_launch_jobs (creator_id, created_at desc);

create index if not exists token_launch_jobs_status_idx
  on public.token_launch_jobs (status, launch_provider);

create index if not exists token_launch_steps_job_id_idx
  on public.token_launch_steps (job_id, step_order);

create index if not exists fee_claim_jobs_creator_id_idx
  on public.fee_claim_jobs (creator_id, created_at desc);

create index if not exists distribution_campaigns_creator_id_idx
  on public.distribution_campaigns (creator_id, created_at desc);

alter table if exists public.wallet_transactions
  add column if not exists provider text,
  add column if not exists custody_mode public.custody_mode,
  add column if not exists chain text,
  add column if not exists subject_type text;

create index if not exists wallet_transactions_provider_idx
  on public.wallet_transactions (provider, chain);

alter table public.provider_connections enable row level security;
alter table public.custodial_wallets enable row level security;
alter table public.creator_tokens enable row level security;
alter table public.token_launch_jobs enable row level security;
alter table public.token_launch_steps enable row level security;
alter table public.fee_claim_jobs enable row level security;
alter table public.distribution_campaigns enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'provider_connections'
      and policyname = 'Users manage their provider connections'
  ) then
    create policy "Users manage their provider connections"
      on public.provider_connections
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'custodial_wallets'
      and policyname = 'Users manage their custodial wallets'
  ) then
    create policy "Users manage their custodial wallets"
      on public.custodial_wallets
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'creator_tokens'
      and policyname = 'Users manage their creator tokens'
  ) then
    create policy "Users manage their creator tokens"
      on public.creator_tokens
      for all
      using (auth.uid() = creator_id)
      with check (auth.uid() = creator_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'token_launch_jobs'
      and policyname = 'Users manage their launch jobs'
  ) then
    create policy "Users manage their launch jobs"
      on public.token_launch_jobs
      for all
      using (auth.uid() = creator_id)
      with check (auth.uid() = creator_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'token_launch_steps'
      and policyname = 'Users manage launch steps via parent jobs'
  ) then
    create policy "Users manage launch steps via parent jobs"
      on public.token_launch_steps
      for all
      using (
        exists (
          select 1
          from public.token_launch_jobs jobs
          where jobs.id = token_launch_steps.job_id
            and jobs.creator_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.token_launch_jobs jobs
          where jobs.id = token_launch_steps.job_id
            and jobs.creator_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'fee_claim_jobs'
      and policyname = 'Users manage their fee claim jobs'
  ) then
    create policy "Users manage their fee claim jobs"
      on public.fee_claim_jobs
      for all
      using (auth.uid() = creator_id)
      with check (auth.uid() = creator_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'distribution_campaigns'
      and policyname = 'Users manage their distribution campaigns'
  ) then
    create policy "Users manage their distribution campaigns"
      on public.distribution_campaigns
      for all
      using (auth.uid() = creator_id)
      with check (auth.uid() = creator_id);
  end if;
end
$$;
