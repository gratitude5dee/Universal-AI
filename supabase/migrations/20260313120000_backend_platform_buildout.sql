create extension if not exists pgcrypto;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

alter table if exists public.user_secrets
  add column if not exists ciphertext text,
  add column if not exists nonce text,
  add column if not exists key_version smallint not null default 1;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'user_secrets'
      and column_name = 'encrypted_value'
  ) then
    execute $sql$
      update public.user_secrets
      set ciphertext = coalesce(ciphertext, encrypted_value)
      where encrypted_value is not null
    $sql$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'user_secrets'
      and column_name = 'encryption_iv'
  ) then
    execute $sql$
      update public.user_secrets
      set nonce = coalesce(nonce, encryption_iv)
      where encryption_iv is not null
    $sql$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'user_secrets'
      and column_name = 'encryption_version'
  ) then
    execute $sql$
      update public.user_secrets
      set key_version = coalesce(key_version, encryption_version::smallint)
      where encryption_version is not null
    $sql$;
  end if;
end
$$;

create or replace function public.ensure_owner_policy(
  p_table_name text,
  p_owner_column text default 'creator_id'
)
returns void
language plpgsql
as $$
begin
  execute format('alter table public.%I enable row level security', p_table_name);
  execute format('drop policy if exists %I on public.%I', p_table_name || '_owner_manage', p_table_name);
  execute format(
    'create policy %I on public.%I for all using (auth.uid() = %I) with check (auth.uid() = %I)',
    p_table_name || '_owner_manage',
    p_table_name,
    p_owner_column,
    p_owner_column
  );
end;
$$;

create table if not exists public.job_queue (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  job_type text not null,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'succeeded', 'failed', 'cancelled', 'needs_review')),
  subject_type text not null,
  subject_id text,
  payload jsonb not null default '{}'::jsonb,
  result jsonb,
  error_message text,
  attempts integer not null default 0,
  max_attempts integer not null default 5,
  scheduled_at timestamptz not null default timezone('utc', now()),
  started_at timestamptz,
  completed_at timestamptz,
  correlation_id text not null default encode(gen_random_bytes(12), 'hex'),
  idempotency_key text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists job_queue_creator_idempotency_idx
  on public.job_queue (creator_id, idempotency_key)
  where idempotency_key is not null;

create index if not exists job_queue_creator_status_idx
  on public.job_queue (creator_id, status, created_at desc);

create table if not exists public.domain_events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  domain text not null,
  event_type text not null,
  subject_type text not null,
  subject_id text,
  job_id uuid references public.job_queue(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists domain_events_creator_domain_idx
  on public.domain_events (creator_id, domain, created_at desc);

create index if not exists domain_events_subject_idx
  on public.domain_events (subject_type, subject_id, created_at desc);

create table if not exists public.system_alerts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  severity text not null check (severity in ('info', 'warning', 'error', 'critical')),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved')),
  source text not null,
  title text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz
);

create index if not exists system_alerts_creator_status_idx
  on public.system_alerts (creator_id, status, created_at desc);

create table if not exists public.workflow_failures (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  workflow_type text not null,
  subject_type text not null,
  subject_id text,
  failure_stage text not null,
  failure_reason text not null,
  retryable boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz
);

create index if not exists workflow_failures_creator_idx
  on public.workflow_failures (creator_id, workflow_type, created_at desc);

create table if not exists public.integration_accounts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  provider_id text not null,
  external_account_id text,
  display_name text,
  status text not null default 'connected'
    check (status in ('pending', 'connected', 'degraded', 'error', 'disconnected')),
  scopes text[] not null default '{}'::text[],
  account_metadata jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (creator_id, provider_id, external_account_id)
);

create table if not exists public.integration_tokens (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  integration_account_id uuid references public.integration_accounts(id) on delete cascade,
  provider_id text not null,
  token_type text not null default 'oauth',
  ciphertext text not null,
  nonce text not null,
  key_version smallint not null default 1,
  expires_at timestamptz,
  refreshed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists integration_tokens_creator_provider_idx
  on public.integration_tokens (creator_id, provider_id, expires_at);

create table if not exists public.integration_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  integration_account_id uuid references public.integration_accounts(id) on delete cascade,
  provider_id text not null,
  sync_type text not null,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'succeeded', 'failed')),
  request_payload jsonb not null default '{}'::jsonb,
  result_payload jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists integration_sync_jobs_creator_idx
  on public.integration_sync_jobs (creator_id, provider_id, created_at desc);

create table if not exists public.webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users(id) on delete cascade,
  provider_id text not null,
  event_type text not null,
  status text not null default 'received'
    check (status in ('received', 'validated', 'processed', 'failed', 'ignored')),
  request_headers jsonb not null default '{}'::jsonb,
  request_body jsonb not null default '{}'::jsonb,
  response_body jsonb,
  error_message text,
  received_at timestamptz not null default timezone('utc', now()),
  processed_at timestamptz
);

create index if not exists webhook_deliveries_provider_idx
  on public.webhook_deliveries (provider_id, received_at desc);

create table if not exists public.external_objects (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  provider_id text not null,
  external_type text not null,
  external_id text not null,
  local_table text,
  local_id text,
  object_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (provider_id, external_type, external_id)
);

create index if not exists external_objects_creator_idx
  on public.external_objects (creator_id, provider_id, external_type);

create table if not exists public.sync_errors (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users(id) on delete cascade,
  integration_sync_job_id uuid references public.integration_sync_jobs(id) on delete cascade,
  provider_id text not null,
  error_code text,
  error_message text not null,
  error_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists sync_errors_provider_idx
  on public.sync_errors (provider_id, created_at desc);

create table if not exists public.oauth_states (
  state text primary key,
  creator_id uuid references auth.users(id) on delete cascade,
  provider_id text not null,
  redirect_uri text not null,
  requested_scopes text[] not null default '{}'::text[],
  status text not null default 'issued'
    check (status in ('issued', 'consumed', 'expired', 'cancelled')),
  code_verifier text,
  metadata jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  consumed_at timestamptz
);

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  version_number integer not null,
  storage_path text,
  checksum text,
  version_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (content_item_id, version_number)
);

create index if not exists content_versions_creator_idx
  on public.content_versions (creator_id, content_item_id, created_at desc);

create table if not exists public.content_derivatives (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  source_version_id uuid references public.content_versions(id) on delete cascade,
  derivative_version_id uuid references public.content_versions(id) on delete cascade,
  derivative_kind text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists content_derivatives_item_idx
  on public.content_derivatives (creator_id, content_item_id, created_at desc);

create table if not exists public.asset_tags (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (content_item_id, tag)
);

create index if not exists asset_tags_creator_tag_idx
  on public.asset_tags (creator_id, tag);

create table if not exists public.asset_links (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  link_type text not null default 'external',
  label text not null,
  url text not null,
  is_primary boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists asset_links_creator_item_idx
  on public.asset_links (creator_id, content_item_id, created_at desc);

create table if not exists public.content_publications (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  provider_id text not null,
  external_id text,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'queued', 'published', 'failed', 'archived')),
  url text,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists content_publications_creator_idx
  on public.content_publications (creator_id, provider_id, created_at desc);

create table if not exists public.asset_permissions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  grantee_email text,
  grantee_wallet text,
  permission_type text not null,
  status text not null default 'active' check (status in ('active', 'revoked', 'expired')),
  metadata jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists asset_permissions_creator_idx
  on public.asset_permissions (creator_id, content_item_id, permission_type);

create table if not exists public.ip_assets (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  title text not null,
  network text not null default 'story',
  registration_status text not null default 'draft'
    check (registration_status in ('draft', 'queued', 'registered', 'failed', 'transferred')),
  story_ip_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists ip_assets_creator_idx
  on public.ip_assets (creator_id, created_at desc);

create table if not exists public.ip_asset_versions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  ip_asset_id uuid not null references public.ip_assets(id) on delete cascade,
  content_version_id uuid references public.content_versions(id) on delete set null,
  version_label text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists ip_asset_versions_asset_idx
  on public.ip_asset_versions (creator_id, ip_asset_id, created_at desc);

create table if not exists public.ip_lineage_edges (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  parent_ip_asset_id uuid not null references public.ip_assets(id) on delete cascade,
  child_ip_asset_id uuid not null references public.ip_assets(id) on delete cascade,
  relationship_type text not null default 'derivative',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (parent_ip_asset_id, child_ip_asset_id, relationship_type)
);

create index if not exists ip_lineage_edges_creator_idx
  on public.ip_lineage_edges (creator_id, created_at desc);

create table if not exists public.ip_agreements (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  ip_asset_id uuid references public.ip_assets(id) on delete set null,
  agreement_type text not null,
  title text not null,
  counterparty_name text,
  counterparty_email text,
  status text not null default 'draft'
    check (status in ('draft', 'pending_signature', 'active', 'expired', 'terminated')),
  effective_at timestamptz,
  expires_at timestamptz,
  signed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists ip_agreements_creator_idx
  on public.ip_agreements (creator_id, status, created_at desc);

create table if not exists public.ip_license_templates (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  template_body text,
  template_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ip_licenses (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  ip_asset_id uuid not null references public.ip_assets(id) on delete cascade,
  license_template_id uuid references public.ip_license_templates(id) on delete set null,
  licensee_name text,
  licensee_wallet text,
  scope text not null default 'commercial',
  status text not null default 'draft'
    check (status in ('draft', 'queued', 'active', 'revoked', 'expired', 'failed')),
  price_amount numeric(18, 6) not null default 0,
  currency text not null default 'USD',
  minted_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists ip_licenses_creator_idx
  on public.ip_licenses (creator_id, status, created_at desc);

create table if not exists public.ip_transfers (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  ip_asset_id uuid not null references public.ip_assets(id) on delete cascade,
  from_wallet text,
  to_wallet text not null,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  transfer_tx_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create index if not exists ip_transfers_creator_idx
  on public.ip_transfers (creator_id, status, created_at desc);

create table if not exists public.rights_audit (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  ip_asset_id uuid references public.ip_assets(id) on delete set null,
  event_type text not null,
  subject_type text not null,
  subject_id text,
  job_id uuid references public.job_queue(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists rights_audit_creator_idx
  on public.rights_audit (creator_id, created_at desc);

create table if not exists public.asset_launches (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  ip_asset_id uuid references public.ip_assets(id) on delete set null,
  launch_provider text not null,
  chain text,
  venue text,
  status text not null default 'draft'
    check (status in ('draft', 'checklist', 'countdown', 'published', 'failed', 'archived')),
  launch_mode text not null default 'marketplace',
  metadata jsonb not null default '{}'::jsonb,
  launched_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists asset_launches_creator_idx
  on public.asset_launches (creator_id, status, created_at desc);

create table if not exists public.asset_mints (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  asset_launch_id uuid not null references public.asset_launches(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  chain text not null,
  token_address text,
  token_id text,
  mint_status text not null default 'queued'
    check (mint_status in ('queued', 'submitted', 'confirmed', 'failed')),
  owner_address text,
  tx_hash text,
  revenue_amount numeric(18, 6) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists asset_mints_creator_idx
  on public.asset_mints (creator_id, chain, created_at desc);

create table if not exists public.bridge_routes (
  id uuid primary key default gen_random_uuid(),
  source_chain text not null,
  destination_chain text not null,
  bridge_provider text not null,
  route_key text generated always as (source_chain || ':' || destination_chain || ':' || bridge_provider) stored,
  status text not null default 'active' check (status in ('active', 'inactive', 'degraded')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (source_chain, destination_chain, bridge_provider)
);

create table if not exists public.bridge_jobs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  bridge_route_id uuid references public.bridge_routes(id) on delete set null,
  content_item_id uuid references public.content_items(id) on delete set null,
  asset_mint_id uuid references public.asset_mints(id) on delete set null,
  source_asset_type text not null,
  source_identifier text,
  source_chain text not null,
  destination_chain text not null,
  destination_wallet text not null,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'submitted', 'completed', 'failed', 'cancelled')),
  estimated_fee_usd numeric(18, 6),
  source_tx_hash text,
  destination_tx_hash text,
  provider_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create index if not exists bridge_jobs_creator_idx
  on public.bridge_jobs (creator_id, status, created_at desc);

create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  asset_launch_id uuid references public.asset_launches(id) on delete cascade,
  marketplace text not null,
  listing_status text not null default 'draft'
    check (listing_status in ('draft', 'queued', 'live', 'paused', 'sold_out', 'failed')),
  price_amount numeric(18, 6) not null default 0,
  currency text not null default 'USD',
  visibility text not null default 'global',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists marketplace_listings_creator_idx
  on public.marketplace_listings (creator_id, marketplace, created_at desc);

create table if not exists public.marketplace_publications (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  marketplace_listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  publication_status text not null default 'queued'
    check (publication_status in ('queued', 'published', 'failed', 'archived')),
  url text,
  external_id text,
  metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.launch_checklists (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  asset_launch_id uuid not null references public.asset_launches(id) on delete cascade,
  item_key text not null,
  label text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (asset_launch_id, item_key)
);

create index if not exists launch_checklists_creator_idx
  on public.launch_checklists (creator_id, asset_launch_id);

create table if not exists public.launch_engagement_snapshots (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  asset_launch_id uuid references public.asset_launches(id) on delete cascade,
  metric_date date not null default timezone('utc', now())::date,
  views integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  revenue_amount numeric(18, 6) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (asset_launch_id, metric_date)
);

create index if not exists launch_engagement_snapshots_creator_idx
  on public.launch_engagement_snapshots (creator_id, metric_date desc);

create table if not exists public.marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  objective text,
  status text not null default 'draft'
    check (status in ('draft', 'approval', 'scheduled', 'active', 'completed', 'failed', 'archived')),
  campaign_metadata jsonb not null default '{}'::jsonb,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists marketing_campaigns_creator_idx
  on public.marketing_campaigns (creator_id, status, created_at desc);

create table if not exists public.campaign_assets (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid not null references public.marketing_campaigns(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  role text not null default 'primary',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.distribution_targets (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.marketing_campaigns(id) on delete cascade,
  provider_id text not null,
  target_type text not null,
  destination_id text,
  status text not null default 'active'
    check (status in ('active', 'paused', 'error', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists distribution_targets_creator_idx
  on public.distribution_targets (creator_id, provider_id, created_at desc);

create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.marketing_campaigns(id) on delete cascade,
  distribution_target_id uuid references public.distribution_targets(id) on delete set null,
  content_item_id uuid references public.content_items(id) on delete set null,
  copy text,
  scheduled_for timestamptz not null,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'scheduled', 'publishing', 'published', 'failed', 'cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists scheduled_posts_creator_idx
  on public.scheduled_posts (creator_id, status, scheduled_for);

create table if not exists public.published_posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  scheduled_post_id uuid references public.scheduled_posts(id) on delete set null,
  provider_id text not null,
  external_post_id text,
  post_url text,
  published_at timestamptz not null default timezone('utc', now()),
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists published_posts_creator_idx
  on public.published_posts (creator_id, provider_id, published_at desc);

create table if not exists public.channel_accounts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  integration_account_id uuid references public.integration_accounts(id) on delete set null,
  provider_id text not null,
  handle text,
  display_name text,
  status text not null default 'connected'
    check (status in ('connected', 'degraded', 'error', 'disconnected')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audience_segments (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  provider_id text,
  filters jsonb not null default '{}'::jsonb,
  estimated_size integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  provider_id text not null,
  channel_id text,
  direction text not null default 'outbound' check (direction in ('inbound', 'outbound')),
  status text not null default 'draft'
    check (status in ('draft', 'queued', 'sent', 'failed', 'read')),
  message_body text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  delivered_at timestamptz
);

create table if not exists public.sync_opportunities (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  requester_name text,
  status text not null default 'open'
    check (status in ('open', 'submitted', 'shortlisted', 'won', 'lost', 'closed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sync_deals (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  sync_opportunity_id uuid references public.sync_opportunities(id) on delete set null,
  ip_license_id uuid references public.ip_licenses(id) on delete set null,
  status text not null default 'negotiating'
    check (status in ('negotiating', 'approved', 'signed', 'paid', 'closed')),
  fee_amount numeric(18, 6) not null default 0,
  currency text not null default 'USD',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sync_submissions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  sync_opportunity_id uuid not null references public.sync_opportunities(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'reviewed', 'accepted', 'rejected')),
  metadata jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.defi_positions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  provider_id text not null,
  chain text not null,
  position_type text not null,
  asset_symbol text not null,
  quantity numeric(28, 10) not null default 0,
  usd_value numeric(18, 6) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  synced_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.defi_rewards (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  position_id uuid references public.defi_positions(id) on delete cascade,
  provider_id text not null,
  reward_symbol text not null,
  amount numeric(28, 10) not null default 0,
  usd_value numeric(18, 6) not null default 0,
  claimed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.governance_votes (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  provider_id text not null,
  chain text not null,
  proposal_id text not null,
  vote_choice text not null,
  voting_power numeric(28, 10),
  cast_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.booking_communications (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  booking_id uuid not null references public.venue_bookings(id) on delete cascade,
  communication_type text not null,
  direction text not null default 'outbound' check (direction in ('inbound', 'outbound')),
  subject text,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.invoice_deliveries (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  delivery_channel text not null,
  recipient text not null,
  status text not null default 'queued'
    check (status in ('queued', 'sent', 'failed', 'opened')),
  metadata jsonb not null default '{}'::jsonb,
  delivered_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.invoice_payments (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  amount numeric(12, 2) not null,
  payment_method text,
  transaction_reference text,
  metadata jsonb not null default '{}'::jsonb,
  paid_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists invoice_payments_creator_idx
  on public.invoice_payments (creator_id, paid_at desc);

create table if not exists public.gig_settlements (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  gig_id uuid not null references public.gigs(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete set null,
  gross_amount numeric(12, 2) not null default 0,
  expenses_amount numeric(12, 2) not null default 0,
  net_amount numeric(12, 2) not null default 0,
  status text not null default 'draft'
    check (status in ('draft', 'settled', 'paid_out')),
  metadata jsonb not null default '{}'::jsonb,
  settled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tour_routes (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  start_date date,
  end_date date,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_tasks (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  contact_id uuid references public.tour_contacts(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null,
  title text not null,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'done', 'cancelled')),
  due_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.booking_playbooks (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  template_type text not null default 'booking',
  is_default boolean not null default false,
  steps jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.royalty_statement_uploads (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  artist_name text,
  period_start date,
  period_end date,
  storage_path text,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'queued', 'parsed', 'discrepancy', 'failed')),
  parsed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists royalty_statement_uploads_creator_idx
  on public.royalty_statement_uploads (creator_id, created_at desc);

create table if not exists public.royalty_statement_lines (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  upload_id uuid not null references public.royalty_statement_uploads(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  ip_asset_id uuid references public.ip_assets(id) on delete set null,
  source_ref text,
  line_type text not null default 'royalty',
  units numeric(18, 4),
  gross_amount numeric(18, 6) not null default 0,
  net_amount numeric(18, 6) not null default 0,
  expected_amount numeric(18, 6),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists royalty_statement_lines_upload_idx
  on public.royalty_statement_lines (creator_id, upload_id, created_at desc);

create table if not exists public.royalty_discrepancies (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  upload_id uuid not null references public.royalty_statement_uploads(id) on delete cascade,
  line_id uuid references public.royalty_statement_lines(id) on delete cascade,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  summary text not null,
  expected_amount numeric(18, 6),
  actual_amount numeric(18, 6),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists royalty_discrepancies_creator_idx
  on public.royalty_discrepancies (creator_id, status, created_at desc);

create table if not exists public.split_sheets (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid references public.content_items(id) on delete set null,
  title text not null,
  primary_artist text,
  status text not null default 'draft'
    check (status in ('draft', 'pending', 'approved', 'archived')),
  notes text,
  total_basis_points integer not null default 10000,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists split_sheets_creator_idx
  on public.split_sheets (creator_id, created_at desc);

create table if not exists public.split_sheet_members (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  split_sheet_id uuid not null references public.split_sheets(id) on delete cascade,
  member_name text not null,
  member_email text,
  member_wallet text,
  role text,
  split_basis_points integer not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.forecast_runs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  run_type text not null default 'revenue',
  period_start date,
  period_end date,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'completed', 'failed')),
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.forecast_inputs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  forecast_run_id uuid not null references public.forecast_runs(id) on delete cascade,
  input_type text not null,
  reference_id text,
  amount numeric(18, 6) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.report_exports (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  report_type text not null,
  status text not null default 'queued'
    check (status in ('queued', 'generated', 'failed')),
  storage_path text,
  report_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.multichain_positions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  provider_id text not null,
  chain text not null,
  asset_symbol text not null,
  wallet_address text,
  balance numeric(28, 10) not null default 0,
  usd_value numeric(18, 6) not null default 0,
  change_24h numeric(9, 4),
  status text not null default 'connected'
    check (status in ('connected', 'syncing', 'error')),
  metadata jsonb not null default '{}'::jsonb,
  synced_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists multichain_positions_creator_idx
  on public.multichain_positions (creator_id, chain, synced_at desc);

create table if not exists public.custodial_accounts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  provider_id text not null default 'crossmint',
  wallet_id text,
  wallet_address text,
  chain text not null,
  status text not null default 'active'
    check (status in ('active', 'pending', 'suspended', 'closed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.treasury_transfer_requests (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  custodial_account_id uuid references public.custodial_accounts(id) on delete set null,
  to_address text not null,
  asset_symbol text not null,
  chain text not null,
  amount numeric(28, 10) not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'submitted', 'completed', 'rejected', 'failed')),
  confirmation_token_hash text,
  idempotency_key text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  unique (creator_id, idempotency_key)
);

create table if not exists public.treasury_transfer_approvals (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  treasury_transfer_request_id uuid not null references public.treasury_transfer_requests(id) on delete cascade,
  approver_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'approved' check (status in ('approved', 'rejected')),
  comment text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.revenue_sources (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null,
  source_id text,
  content_item_id uuid references public.content_items(id) on delete set null,
  ip_asset_id uuid references public.ip_assets(id) on delete set null,
  amount numeric(18, 6) not null default 0,
  currency text not null default 'USD',
  occurred_at timestamptz not null default timezone('utc', now()),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists revenue_sources_creator_idx
  on public.revenue_sources (creator_id, occurred_at desc);

create table if not exists public.cashflow_snapshots (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  snapshot_date date not null,
  inflow_amount numeric(18, 6) not null default 0,
  outflow_amount numeric(18, 6) not null default 0,
  net_amount numeric(18, 6) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (creator_id, snapshot_date)
);

create table if not exists public.agent_templates (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  template_type text not null,
  config jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.agent_installs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  agent_template_id uuid references public.agent_templates(id) on delete set null,
  marketplace_listing_id uuid,
  install_status text not null default 'installed'
    check (install_status in ('installed', 'updating', 'disabled', 'failed', 'removed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists agent_installs_creator_idx
  on public.agent_installs (creator_id, created_at desc);

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  run_status text not null default 'queued'
    check (run_status in ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  intent text,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists agent_runs_creator_idx
  on public.agent_runs (creator_id, run_status, created_at desc);

create table if not exists public.agent_run_steps (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_run_id uuid not null references public.agent_runs(id) on delete cascade,
  step_key text not null,
  step_order integer not null default 0,
  status text not null default 'queued'
    check (status in ('queued', 'running', 'succeeded', 'failed', 'skipped')),
  tool_name text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.agent_permissions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete cascade,
  permission_key text not null,
  status text not null default 'granted' check (status in ('granted', 'revoked')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (agent_id, permission_key)
);

create table if not exists public.agent_tools (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete cascade,
  tool_name text not null,
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (agent_id, tool_name)
);

create table if not exists public.agent_memories (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete cascade,
  memory_kind text not null,
  content text not null,
  source_uri text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.agent_marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_template_id uuid references public.agent_templates(id) on delete set null,
  title text not null,
  description text,
  category text,
  price_amount numeric(18, 6) not null default 0,
  currency text not null default 'USD',
  status text not null default 'draft'
    check (status in ('draft', 'published', 'paused', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.agent_reviews (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_marketplace_listing_id uuid references public.agent_marketplace_listings(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review_text text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.agent_billing_events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  event_type text not null,
  amount numeric(18, 6) not null default 0,
  currency text not null default 'USD',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.agent_inboxes (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete cascade,
  source_provider text not null,
  thread_id text,
  message_body text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.sync_content_item_tags()
returns trigger
language plpgsql
as $$
begin
  delete from public.asset_tags where content_item_id = new.id;
  if new.tags is not null then
    insert into public.asset_tags (creator_id, content_item_id, tag)
    select new.user_id, new.id, trim(tag_value)
    from unnest(new.tags) as tag_value
    where trim(tag_value) <> ''
    on conflict (content_item_id, tag) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists content_items_sync_tags on public.content_items;
create trigger content_items_sync_tags
after insert or update of tags on public.content_items
for each row execute function public.sync_content_item_tags();

create or replace function public.seed_initial_content_version()
returns trigger
language plpgsql
as $$
begin
  insert into public.content_versions (
    creator_id,
    content_item_id,
    version_number,
    storage_path,
    version_metadata
  )
  values (
    new.user_id,
    new.id,
    1,
    new.storage_path,
    coalesce(new.metadata, '{}'::jsonb)
  )
  on conflict (content_item_id, version_number) do nothing;

  insert into public.domain_events (
    creator_id,
    domain,
    event_type,
    subject_type,
    subject_id,
    metadata
  )
  values (
    new.user_id,
    'content',
    'content_item_created',
    'content_item',
    new.id::text,
    jsonb_build_object('file_type', new.file_type, 'title', new.title)
  );

  return new;
end;
$$;

drop trigger if exists content_items_seed_version on public.content_items;
create trigger content_items_seed_version
after insert on public.content_items
for each row execute function public.seed_initial_content_version();

create or replace function public.seed_launch_checklist()
returns trigger
language plpgsql
as $$
begin
  insert into public.launch_checklists (creator_id, asset_launch_id, item_key, label)
  values
    (new.creator_id, new.id, 'details', 'Finalize your creation details'),
    (new.creator_id, new.id, 'pricing', 'Set pricing and revenue splits'),
    (new.creator_id, new.id, 'visibility', 'Choose marketplace visibility'),
    (new.creator_id, new.id, 'promotion', 'Prepare promotional materials'),
    (new.creator_id, new.id, 'rights', 'Review rights management')
  on conflict (asset_launch_id, item_key) do nothing;
  return new;
end;
$$;

drop trigger if exists asset_launches_seed_checklist on public.asset_launches;
create trigger asset_launches_seed_checklist
after insert on public.asset_launches
for each row execute function public.seed_launch_checklist();

create or replace function public.sync_royalty_discrepancy_from_line()
returns trigger
language plpgsql
as $$
declare
  discrepancy numeric(18, 6);
begin
  discrepancy := coalesce(new.expected_amount, new.net_amount) - new.net_amount;

  if new.expected_amount is not null and abs(discrepancy) >= 0.01 then
    insert into public.royalty_discrepancies (
      creator_id,
      upload_id,
      line_id,
      severity,
      summary,
      expected_amount,
      actual_amount,
      status,
      metadata
    )
    values (
      new.creator_id,
      new.upload_id,
      new.id,
      case when abs(discrepancy) >= 100 then 'high' when abs(discrepancy) >= 10 then 'medium' else 'low' end,
      'Statement line differs from expected amount',
      new.expected_amount,
      new.net_amount,
      'open',
      jsonb_build_object('source_ref', new.source_ref)
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists royalty_lines_sync_discrepancy on public.royalty_statement_lines;
create trigger royalty_lines_sync_discrepancy
after insert or update on public.royalty_statement_lines
for each row execute function public.sync_royalty_discrepancy_from_line();

create or replace function public.sync_invoice_payment_rollup()
returns trigger
language plpgsql
as $$
declare
  v_balance_due numeric(12, 2);
  v_invoice public.invoices%rowtype;
begin
  update public.invoices
  set balance_due = greatest(coalesce(balance_due, amount) - new.amount, 0),
      paid_at = case when greatest(coalesce(balance_due, amount) - new.amount, 0) = 0 then new.paid_at else paid_at end,
      status = case when greatest(coalesce(balance_due, amount) - new.amount, 0) = 0 then 'paid' else status end,
      updated_at = timezone('utc', now())
  where id = new.invoice_id
  returning * into v_invoice;

  v_balance_due := coalesce(v_invoice.balance_due, 0);

  update public.venue_bookings
  set payment_status = case when v_balance_due = 0 then 'paid' else 'partial' end,
      updated_at = timezone('utc', now())
  where invoice_id = new.invoice_id;

  insert into public.revenue_sources (
    creator_id,
    source_type,
    source_id,
    amount,
    currency,
    occurred_at,
    metadata
  )
  values (
    new.creator_id,
    'invoice_payment',
    new.invoice_id::text,
    new.amount,
    coalesce(v_invoice.currency, 'USD'),
    new.paid_at,
    coalesce(new.metadata, '{}'::jsonb)
  );

  return new;
end;
$$;

drop trigger if exists invoice_payments_sync_rollup on public.invoice_payments;
create trigger invoice_payments_sync_rollup
after insert on public.invoice_payments
for each row execute function public.sync_invoice_payment_rollup();

insert into public.content_versions (
  creator_id,
  content_item_id,
  version_number,
  storage_path,
  version_metadata
)
select
  ci.user_id,
  ci.id,
  1,
  ci.storage_path,
  coalesce(ci.metadata, '{}'::jsonb)
from public.content_items ci
where not exists (
  select 1
  from public.content_versions cv
  where cv.content_item_id = ci.id
    and cv.version_number = 1
);

insert into public.asset_tags (creator_id, content_item_id, tag)
select
  ci.user_id,
  ci.id,
  trim(tag_value)
from public.content_items ci,
  lateral unnest(coalesce(ci.tags, '{}'::text[])) as tag_value
where trim(tag_value) <> ''
on conflict (content_item_id, tag) do nothing;

create or replace function public.enqueue_domain_job(
  p_job_type text,
  p_subject_type text,
  p_subject_id text default null,
  p_payload jsonb default '{}'::jsonb,
  p_idempotency_key text default null,
  p_correlation_id text default null
)
returns public.job_queue
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job public.job_queue;
begin
  if p_idempotency_key is null then
    insert into public.job_queue (
      creator_id,
      job_type,
      subject_type,
      subject_id,
      payload,
      idempotency_key,
      correlation_id
    )
    values (
      auth.uid(),
      p_job_type,
      p_subject_type,
      p_subject_id,
      coalesce(p_payload, '{}'::jsonb),
      null,
      coalesce(p_correlation_id, encode(gen_random_bytes(12), 'hex'))
    )
    returning * into v_job;
  else
    insert into public.job_queue (
      creator_id,
      job_type,
      subject_type,
      subject_id,
      payload,
      idempotency_key,
      correlation_id
    )
    values (
      auth.uid(),
      p_job_type,
      p_subject_type,
      p_subject_id,
      coalesce(p_payload, '{}'::jsonb),
      p_idempotency_key,
      coalesce(p_correlation_id, encode(gen_random_bytes(12), 'hex'))
    )
    on conflict (creator_id, idempotency_key)
    do update
      set payload = excluded.payload,
          updated_at = timezone('utc', now())
    returning * into v_job;
  end if;

  return v_job;
end;
$$;

create or replace function public.append_domain_event(
  p_domain text,
  p_event_type text,
  p_subject_type text,
  p_subject_id text default null,
  p_job_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.domain_events (
    creator_id,
    domain,
    event_type,
    subject_type,
    subject_id,
    job_id,
    metadata
  )
  values (
    auth.uid(),
    p_domain,
    p_event_type,
    p_subject_type,
    p_subject_id,
    p_job_id,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.search_content_library(
  query_text text default null,
  folder_uuid uuid default null,
  file_type_filter text default null,
  tag_filter text default null,
  limit_count integer default 50
)
returns table (
  id uuid,
  title text,
  description text,
  file_type text,
  folder_id uuid,
  folder_name text,
  thumbnail_url text,
  storage_path text,
  created_at timestamptz,
  updated_at timestamptz,
  tags text[],
  link_count bigint,
  publication_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ci.id,
    ci.title,
    ci.description,
    ci.file_type,
    ci.folder_id,
    cf.name as folder_name,
    ci.thumbnail_url,
    ci.storage_path,
    ci.created_at,
    ci.updated_at,
    ci.tags,
    count(distinct al.id) as link_count,
    count(distinct cp.id) as publication_count
  from public.content_items ci
  left join public.content_folders cf on cf.id = ci.folder_id
  left join public.asset_links al on al.content_item_id = ci.id
  left join public.content_publications cp on cp.content_item_id = ci.id
  where ci.user_id = auth.uid()
    and (folder_uuid is null or ci.folder_id = folder_uuid)
    and (file_type_filter is null or ci.file_type = file_type_filter)
    and (
      tag_filter is null
      or exists (
        select 1
        from public.asset_tags at
        where at.content_item_id = ci.id
          and at.tag ilike '%' || tag_filter || '%'
      )
    )
    and (
      query_text is null
      or ci.title ilike '%' || query_text || '%'
      or coalesce(ci.description, '') ilike '%' || query_text || '%'
    )
  group by ci.id, cf.name
  order by ci.updated_at desc
  limit greatest(coalesce(limit_count, 50), 1);
$$;

create or replace function public.get_rights_rollup()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'registeredAssets', coalesce((select count(*) from public.ip_assets where creator_id = auth.uid()), 0),
    'activeLicenses', coalesce((select count(*) from public.ip_licenses where creator_id = auth.uid() and status = 'active'), 0),
    'pendingAgreements', coalesce((select count(*) from public.ip_agreements where creator_id = auth.uid() and status in ('draft', 'pending_signature')), 0),
    'rightsTransfers', coalesce((select count(*) from public.ip_transfers where creator_id = auth.uid()), 0)
  );
$$;

create or replace function public.get_campaign_rollup()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'activeCampaigns', coalesce((select count(*) from public.marketing_campaigns where creator_id = auth.uid() and status in ('scheduled', 'active')), 0),
    'scheduledPosts', coalesce((select count(*) from public.scheduled_posts where creator_id = auth.uid() and status in ('approved', 'scheduled')), 0),
    'publishedPosts', coalesce((select count(*) from public.published_posts where creator_id = auth.uid()), 0),
    'connectedChannels', coalesce((select count(*) from public.channel_accounts where creator_id = auth.uid() and status = 'connected'), 0)
  );
$$;

create or replace function public.get_touring_stats_v2()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'upcomingGigs', coalesce((select count(*) from public.gigs where user_id = auth.uid() and date >= current_date), 0),
    'monthlyRevenue', coalesce((
      select sum(coalesce(guarantee_amount, 0))
      from public.gigs
      where user_id = auth.uid()
        and date_trunc('month', date::timestamp) = date_trunc('month', timezone('utc', now()))
    ), 0),
    'pendingInvoices', coalesce((
      select count(*)
      from public.invoices i
      join public.gigs g on g.id = i.gig_id
      where g.user_id = auth.uid()
        and i.status = 'pending'
    ), 0),
    'overdueInvoices', coalesce((
      select count(*)
      from public.invoices i
      join public.gigs g on g.id = i.gig_id
      where g.user_id = auth.uid()
        and i.status = 'overdue'
    ), 0)
  );
$$;

create or replace function public.detect_royalty_discrepancies(
  p_upload_id uuid default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer;
begin
  insert into public.royalty_discrepancies (
    creator_id,
    upload_id,
    line_id,
    severity,
    summary,
    expected_amount,
    actual_amount,
    status,
    metadata
  )
  select
    rsl.creator_id,
    rsl.upload_id,
    rsl.id,
    case
      when abs(coalesce(rsl.expected_amount, rsl.net_amount) - rsl.net_amount) >= 100 then 'high'
      when abs(coalesce(rsl.expected_amount, rsl.net_amount) - rsl.net_amount) >= 10 then 'medium'
      else 'low'
    end,
    'Statement line differs from expected amount',
    rsl.expected_amount,
    rsl.net_amount,
    'open',
    jsonb_build_object('source_ref', rsl.source_ref)
  from public.royalty_statement_lines rsl
  where rsl.creator_id = auth.uid()
    and (p_upload_id is null or rsl.upload_id = p_upload_id)
    and rsl.expected_amount is not null
    and abs(rsl.expected_amount - rsl.net_amount) >= 0.01
    and not exists (
      select 1
      from public.royalty_discrepancies rd
      where rd.line_id = rsl.id
    );

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

create or replace function public.preview_split_sheet_allocations(
  p_split_sheet_id uuid,
  p_amount numeric
)
returns table (
  member_name text,
  role text,
  split_basis_points integer,
  allocation_amount numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ssm.member_name,
    ssm.role,
    ssm.split_basis_points,
    round((coalesce(p_amount, 0) * ssm.split_basis_points::numeric) / 10000.0, 6) as allocation_amount
  from public.split_sheet_members ssm
  join public.split_sheets ss on ss.id = ssm.split_sheet_id
  where ss.id = p_split_sheet_id
    and ss.creator_id = auth.uid()
  order by ssm.member_name asc;
$$;

create or replace function public.request_treasury_transfer(
  p_custodial_account_id uuid,
  p_to_address text,
  p_asset_symbol text,
  p_chain text,
  p_amount numeric,
  p_confirmation_token_hash text,
  p_idempotency_key text,
  p_metadata jsonb default '{}'::jsonb
)
returns public.treasury_transfer_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.treasury_transfer_requests;
begin
  insert into public.treasury_transfer_requests (
    creator_id,
    custodial_account_id,
    to_address,
    asset_symbol,
    chain,
    amount,
    confirmation_token_hash,
    idempotency_key,
    metadata
  )
  values (
    auth.uid(),
    p_custodial_account_id,
    p_to_address,
    p_asset_symbol,
    p_chain,
    p_amount,
    p_confirmation_token_hash,
    p_idempotency_key,
    coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (creator_id, idempotency_key)
  do update set updated_at = timezone('utc', now())
  returning * into v_request;

  return v_request;
end;
$$;

create or replace function public.approve_treasury_transfer_request(
  p_request_id uuid,
  p_status text,
  p_comment text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns public.treasury_transfer_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.treasury_transfer_requests;
begin
  insert into public.treasury_transfer_approvals (
    creator_id,
    treasury_transfer_request_id,
    approver_id,
    status,
    comment,
    metadata
  )
  values (
    auth.uid(),
    p_request_id,
    auth.uid(),
    p_status,
    p_comment,
    coalesce(p_metadata, '{}'::jsonb)
  );

  update public.treasury_transfer_requests
  set status = case when p_status = 'approved' then 'approved' else 'rejected' end,
      updated_at = timezone('utc', now())
  where id = p_request_id
    and creator_id = auth.uid()
  returning * into v_request;

  return v_request;
end;
$$;

create or replace function public.get_agent_install_run_summary()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'activeAgents', coalesce((select count(*) from public.agents where user_id = auth.uid() and status = 'active'), 0),
    'installedAgents', coalesce((select count(*) from public.agent_installs where creator_id = auth.uid() and install_status = 'installed'), 0),
    'connectedIntegrations', coalesce((select count(*) from public.integration_accounts where creator_id = auth.uid() and status = 'connected'), 0),
    'successfulRuns', coalesce((select count(*) from public.agent_runs where creator_id = auth.uid() and run_status = 'succeeded'), 0),
    'failedRuns', coalesce((select count(*) from public.agent_runs where creator_id = auth.uid() and run_status = 'failed'), 0)
  );
$$;

create or replace view public.content_library_assets_v1 as
select
  ci.user_id as creator_id,
  ci.id,
  ci.folder_id,
  cf.name as folder_name,
  ci.title,
  ci.description,
  ci.file_type,
  ci.file_size,
  ci.storage_path,
  ci.thumbnail_url,
  ci.metadata,
  ci.tags,
  ci.created_at,
  ci.updated_at,
  coalesce(count(distinct al.id), 0) as link_count,
  coalesce(count(distinct cp.id), 0) as publication_count
from public.content_items ci
left join public.content_folders cf on cf.id = ci.folder_id
left join public.asset_links al on al.content_item_id = ci.id
left join public.content_publications cp on cp.content_item_id = ci.id
group by ci.id, cf.name;

create or replace view public.content_metrics_daily as
select
  creator_id,
  metric_date,
  sum(assets_uploaded) as assets_uploaded,
  sum(published_assets) as published_assets,
  sum(links_added) as links_added
from (
  select
    ci.user_id as creator_id,
    ci.created_at::date as metric_date,
    count(*)::bigint as assets_uploaded,
    0::bigint as published_assets,
    0::bigint as links_added
  from public.content_items ci
  group by ci.user_id, ci.created_at::date
  union all
  select
    cp.creator_id,
    cp.created_at::date,
    0,
    count(*)::bigint,
    0
  from public.content_publications cp
  group by cp.creator_id, cp.created_at::date
  union all
  select
    al.creator_id,
    al.created_at::date,
    0,
    0,
    count(*)::bigint
  from public.asset_links al
  group by al.creator_id, al.created_at::date
) daily
group by creator_id, metric_date;

create or replace view public.rights_metrics_daily as
select
  creator_id,
  metric_date,
  sum(registered_assets) as registered_assets,
  sum(active_licenses) as active_licenses,
  sum(rights_transfers) as rights_transfers
from (
  select creator_id, created_at::date as metric_date, count(*)::bigint as registered_assets, 0::bigint as active_licenses, 0::bigint as rights_transfers
  from public.ip_assets
  group by creator_id, created_at::date
  union all
  select creator_id, created_at::date, 0, count(*)::bigint, 0
  from public.ip_licenses
  where status = 'active'
  group by creator_id, created_at::date
  union all
  select creator_id, created_at::date, 0, 0, count(*)::bigint
  from public.ip_transfers
  group by creator_id, created_at::date
) daily
group by creator_id, metric_date;

create or replace view public.launch_metrics_daily as
select
  creator_id,
  metric_date,
  sum(launches) as launches,
  sum(mints) as mints,
  sum(views) as views,
  sum(revenue_amount) as revenue_amount
from (
  select creator_id, created_at::date as metric_date, count(*)::bigint as launches, 0::bigint as mints, 0::bigint as views, 0::numeric as revenue_amount
  from public.asset_launches
  group by creator_id, created_at::date
  union all
  select creator_id, created_at::date, 0, count(*)::bigint, 0, sum(revenue_amount)
  from public.asset_mints
  group by creator_id, created_at::date
  union all
  select creator_id, metric_date, 0, 0, sum(views)::bigint, sum(revenue_amount)
  from public.launch_engagement_snapshots
  group by creator_id, metric_date
) daily
group by creator_id, metric_date;

create or replace view public.campaign_metrics_daily as
select
  creator_id,
  metric_date,
  sum(campaigns_started) as campaigns_started,
  sum(posts_published) as posts_published,
  sum(engagement_total) as engagement_total
from (
  select creator_id, created_at::date as metric_date, count(*)::bigint as campaigns_started, 0::bigint as posts_published, 0::bigint as engagement_total
  from public.marketing_campaigns
  group by creator_id, created_at::date
  union all
  select creator_id, published_at::date as metric_date, 0, count(*)::bigint,
    sum(coalesce((metrics ->> 'likes')::bigint, 0) + coalesce((metrics ->> 'comments')::bigint, 0) + coalesce((metrics ->> 'shares')::bigint, 0))
  from public.published_posts
  group by creator_id, published_at::date
) daily
group by creator_id, metric_date;

create or replace view public.content_dashboard_overview_v1 as
select
  ci.user_id as creator_id,
  count(distinct ci.id)::bigint as total_assets,
  count(distinct cp.content_item_id)::bigint as published_assets,
  count(distinct ia.id)::bigint as ip_assets,
  count(distinct al.id)::bigint as launches,
  max(ci.updated_at) as last_asset_updated_at
from public.content_items ci
left join public.content_publications cp on cp.content_item_id = ci.id
left join public.ip_assets ia on ia.content_item_id = ci.id
left join public.asset_launches al on al.content_item_id = ci.id
group by ci.user_id;

create or replace view public.marketing_dashboard_overview_v1 as
select
  mc.creator_id,
  count(distinct mc.id) filter (where mc.status in ('scheduled', 'active'))::bigint as active_campaigns,
  count(distinct sp.id) filter (where sp.status in ('approved', 'scheduled'))::bigint as scheduled_posts,
  count(distinct pp.id)::bigint as published_posts,
  count(distinct ca.id) filter (where ca.status = 'connected')::bigint as connected_channels
from public.marketing_campaigns mc
left join public.scheduled_posts sp on sp.campaign_id = mc.id
left join public.published_posts pp on pp.scheduled_post_id = sp.id
left join public.channel_accounts ca on ca.creator_id = mc.creator_id
group by mc.creator_id;

create or replace view public.finance_dashboard_overview_v1 as
select
  creators.creator_id,
  coalesce(rs.pending_statements, 0) as pending_statements,
  coalesce(rd.discrepancies, 0) as discrepancies,
  coalesce(mp.portfolio_value_usd, 0) as portfolio_value_usd,
  coalesce(rv.total_revenue, 0) as total_revenue
from (
  select creator_id from public.royalty_statement_uploads
  union
  select creator_id from public.multichain_positions
  union
  select creator_id from public.revenue_sources
) creators
left join (
  select creator_id, count(*)::bigint as pending_statements
  from public.royalty_statement_uploads
  where status in ('uploaded', 'queued')
  group by creator_id
) rs on rs.creator_id = creators.creator_id
left join (
  select creator_id, count(*)::bigint as discrepancies
  from public.royalty_discrepancies
  where status <> 'resolved'
  group by creator_id
) rd on rd.creator_id = creators.creator_id
left join (
  select creator_id, sum(usd_value) as portfolio_value_usd
  from public.multichain_positions
  group by creator_id
) mp on mp.creator_id = creators.creator_id
left join (
  select creator_id, sum(amount) as total_revenue
  from public.revenue_sources
  group by creator_id
) rv on rv.creator_id = creators.creator_id;

create or replace view public.bridge_dashboard_overview_v1 as
select
  creator_id,
  count(*)::bigint as total_bridge_jobs,
  count(*) filter (where status in ('queued', 'processing', 'submitted'))::bigint as active_bridge_jobs,
  count(*) filter (where status = 'completed')::bigint as completed_bridge_jobs,
  coalesce(sum(estimated_fee_usd), 0) as total_estimated_fees
from public.bridge_jobs
group by creator_id;

create or replace view public.agents_dashboard_overview_v1 as
select
  base.creator_id,
  coalesce(active_agents, 0) as active_agents,
  coalesce(installed_agents, 0) as installed_agents,
  coalesce(connected_integrations, 0) as connected_integrations,
  coalesce(successful_runs, 0) as successful_runs,
  coalesce(failed_runs, 0) as failed_runs
from (
  select user_id as creator_id from public.agents
  union
  select creator_id from public.agent_installs
  union
  select creator_id from public.agent_runs
  union
  select creator_id from public.integration_accounts
) base
left join (
  select user_id as creator_id, count(*)::bigint as active_agents
  from public.agents
  where status = 'active'
  group by user_id
) a on a.creator_id = base.creator_id
left join (
  select creator_id, count(*)::bigint as installed_agents
  from public.agent_installs
  where install_status = 'installed'
  group by creator_id
) ai on ai.creator_id = base.creator_id
left join (
  select creator_id, count(*)::bigint as connected_integrations
  from public.integration_accounts
  where status = 'connected'
  group by creator_id
) ia on ia.creator_id = base.creator_id
left join (
  select creator_id, count(*)::bigint as successful_runs
  from public.agent_runs
  where run_status = 'succeeded'
  group by creator_id
) sr on sr.creator_id = base.creator_id
left join (
  select creator_id, count(*)::bigint as failed_runs
  from public.agent_runs
  where run_status = 'failed'
  group by creator_id
) fr on fr.creator_id = base.creator_id;

create or replace view public.multichain_dashboard_positions_v1 as
select
  mp.creator_id,
  mp.provider_id,
  mp.chain,
  mp.asset_symbol,
  mp.wallet_address,
  mp.balance,
  mp.usd_value,
  mp.change_24h,
  mp.status,
  mp.synced_at,
  coalesce(rs.total_revenue, 0) as attributed_revenue
from public.multichain_positions mp
left join (
  select creator_id, sum(amount) as total_revenue
  from public.revenue_sources
  group by creator_id
) rs on rs.creator_id = mp.creator_id;

create or replace view public.royalty_statement_summary_v1 as
select
  rsu.creator_id,
  rsu.id,
  rsu.source,
  rsu.artist_name,
  rsu.period_start,
  rsu.period_end,
  rsu.status,
  rsu.created_at,
  coalesce(line_totals.total_amount, 0) as total_amount,
  coalesce(discrepancy_totals.discrepancy_count, 0) as discrepancy_count
from public.royalty_statement_uploads rsu
left join (
  select upload_id, sum(net_amount) as total_amount
  from public.royalty_statement_lines
  group by upload_id
) line_totals on line_totals.upload_id = rsu.id
left join (
  select upload_id, count(*)::bigint as discrepancy_count
  from public.royalty_discrepancies
  where status <> 'resolved'
  group by upload_id
) discrepancy_totals on discrepancy_totals.upload_id = rsu.id;

create or replace function public.get_platform_overview()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'content', (
      select coalesce(to_jsonb(v), '{}'::jsonb)
      from public.content_dashboard_overview_v1 v
      where v.creator_id = auth.uid()
    ),
    'marketing', (
      select coalesce(to_jsonb(v), '{}'::jsonb)
      from public.marketing_dashboard_overview_v1 v
      where v.creator_id = auth.uid()
    ),
    'finance', (
      select coalesce(to_jsonb(v), '{}'::jsonb)
      from public.finance_dashboard_overview_v1 v
      where v.creator_id = auth.uid()
    ),
    'bridge', (
      select coalesce(to_jsonb(v), '{}'::jsonb)
      from public.bridge_dashboard_overview_v1 v
      where v.creator_id = auth.uid()
    ),
    'agents', (
      select coalesce(to_jsonb(v), '{}'::jsonb)
      from public.agents_dashboard_overview_v1 v
      where v.creator_id = auth.uid()
    )
  );
$$;

select public.ensure_owner_policy('job_queue');
select public.ensure_owner_policy('domain_events');
select public.ensure_owner_policy('system_alerts');
select public.ensure_owner_policy('workflow_failures');
select public.ensure_owner_policy('integration_accounts');
select public.ensure_owner_policy('integration_tokens');
select public.ensure_owner_policy('integration_sync_jobs');
select public.ensure_owner_policy('external_objects');
select public.ensure_owner_policy('content_versions');
select public.ensure_owner_policy('content_derivatives');
select public.ensure_owner_policy('asset_tags');
select public.ensure_owner_policy('asset_links');
select public.ensure_owner_policy('content_publications');
select public.ensure_owner_policy('asset_permissions');
select public.ensure_owner_policy('ip_assets');
select public.ensure_owner_policy('ip_asset_versions');
select public.ensure_owner_policy('ip_lineage_edges');
select public.ensure_owner_policy('ip_agreements');
select public.ensure_owner_policy('ip_license_templates');
select public.ensure_owner_policy('ip_licenses');
select public.ensure_owner_policy('ip_transfers');
select public.ensure_owner_policy('rights_audit');
select public.ensure_owner_policy('asset_launches');
select public.ensure_owner_policy('asset_mints');
select public.ensure_owner_policy('bridge_jobs');
select public.ensure_owner_policy('marketplace_listings');
select public.ensure_owner_policy('marketplace_publications');
select public.ensure_owner_policy('launch_checklists');
select public.ensure_owner_policy('launch_engagement_snapshots');
select public.ensure_owner_policy('marketing_campaigns');
select public.ensure_owner_policy('campaign_assets');
select public.ensure_owner_policy('distribution_targets');
select public.ensure_owner_policy('scheduled_posts');
select public.ensure_owner_policy('published_posts');
select public.ensure_owner_policy('channel_accounts');
select public.ensure_owner_policy('audience_segments');
select public.ensure_owner_policy('community_messages');
select public.ensure_owner_policy('sync_opportunities');
select public.ensure_owner_policy('sync_deals');
select public.ensure_owner_policy('sync_submissions');
select public.ensure_owner_policy('defi_positions');
select public.ensure_owner_policy('defi_rewards');
select public.ensure_owner_policy('governance_votes');
select public.ensure_owner_policy('booking_communications');
select public.ensure_owner_policy('invoice_deliveries');
select public.ensure_owner_policy('invoice_payments');
select public.ensure_owner_policy('gig_settlements');
select public.ensure_owner_policy('tour_routes');
select public.ensure_owner_policy('contact_tasks');
select public.ensure_owner_policy('booking_playbooks');
select public.ensure_owner_policy('royalty_statement_uploads');
select public.ensure_owner_policy('royalty_statement_lines');
select public.ensure_owner_policy('royalty_discrepancies');
select public.ensure_owner_policy('split_sheets');
select public.ensure_owner_policy('split_sheet_members');
select public.ensure_owner_policy('forecast_runs');
select public.ensure_owner_policy('forecast_inputs');
select public.ensure_owner_policy('report_exports');
select public.ensure_owner_policy('multichain_positions');
select public.ensure_owner_policy('custodial_accounts');
select public.ensure_owner_policy('treasury_transfer_requests');
select public.ensure_owner_policy('treasury_transfer_approvals');
select public.ensure_owner_policy('revenue_sources');
select public.ensure_owner_policy('cashflow_snapshots');
select public.ensure_owner_policy('agent_templates');
select public.ensure_owner_policy('agent_installs');
select public.ensure_owner_policy('agent_runs');
select public.ensure_owner_policy('agent_run_steps');
select public.ensure_owner_policy('agent_permissions');
select public.ensure_owner_policy('agent_tools');
select public.ensure_owner_policy('agent_memories');
select public.ensure_owner_policy('agent_marketplace_listings');
select public.ensure_owner_policy('agent_reviews');
select public.ensure_owner_policy('agent_billing_events');
select public.ensure_owner_policy('agent_inboxes');

grant execute on function public.enqueue_domain_job(text, text, text, jsonb, text, text) to authenticated;
grant execute on function public.append_domain_event(text, text, text, text, uuid, jsonb) to authenticated;
grant execute on function public.search_content_library(text, uuid, text, text, integer) to authenticated;
grant execute on function public.get_rights_rollup() to authenticated;
grant execute on function public.get_campaign_rollup() to authenticated;
grant execute on function public.get_touring_stats_v2() to authenticated;
grant execute on function public.detect_royalty_discrepancies(uuid) to authenticated;
grant execute on function public.preview_split_sheet_allocations(uuid, numeric) to authenticated;
grant execute on function public.request_treasury_transfer(uuid, text, text, text, numeric, text, text, jsonb) to authenticated;
grant execute on function public.approve_treasury_transfer_request(uuid, text, text, jsonb) to authenticated;
grant execute on function public.get_agent_install_run_summary() to authenticated;
grant execute on function public.get_platform_overview() to authenticated;

create trigger integration_accounts_set_updated_at
before update on public.integration_accounts
for each row execute function public.update_updated_at_column();

create trigger integration_tokens_set_updated_at
before update on public.integration_tokens
for each row execute function public.update_updated_at_column();

create trigger integration_sync_jobs_set_updated_at
before update on public.integration_sync_jobs
for each row execute function public.update_updated_at_column();

create trigger external_objects_set_updated_at
before update on public.external_objects
for each row execute function public.update_updated_at_column();

create trigger asset_links_set_updated_at
before update on public.asset_links
for each row execute function public.update_updated_at_column();

create trigger content_publications_set_updated_at
before update on public.content_publications
for each row execute function public.update_updated_at_column();

create trigger asset_permissions_set_updated_at
before update on public.asset_permissions
for each row execute function public.update_updated_at_column();

create trigger ip_assets_set_updated_at
before update on public.ip_assets
for each row execute function public.update_updated_at_column();

create trigger ip_agreements_set_updated_at
before update on public.ip_agreements
for each row execute function public.update_updated_at_column();

create trigger ip_license_templates_set_updated_at
before update on public.ip_license_templates
for each row execute function public.update_updated_at_column();

create trigger ip_licenses_set_updated_at
before update on public.ip_licenses
for each row execute function public.update_updated_at_column();

create trigger ip_transfers_set_updated_at
before update on public.ip_transfers
for each row execute function public.update_updated_at_column();

create trigger asset_launches_set_updated_at
before update on public.asset_launches
for each row execute function public.update_updated_at_column();

create trigger asset_mints_set_updated_at
before update on public.asset_mints
for each row execute function public.update_updated_at_column();

create trigger bridge_routes_set_updated_at
before update on public.bridge_routes
for each row execute function public.update_updated_at_column();

create trigger bridge_jobs_set_updated_at
before update on public.bridge_jobs
for each row execute function public.update_updated_at_column();

create trigger marketplace_listings_set_updated_at
before update on public.marketplace_listings
for each row execute function public.update_updated_at_column();

create trigger marketplace_publications_set_updated_at
before update on public.marketplace_publications
for each row execute function public.update_updated_at_column();

create trigger launch_checklists_set_updated_at
before update on public.launch_checklists
for each row execute function public.update_updated_at_column();

create trigger marketing_campaigns_set_updated_at
before update on public.marketing_campaigns
for each row execute function public.update_updated_at_column();

create trigger distribution_targets_set_updated_at
before update on public.distribution_targets
for each row execute function public.update_updated_at_column();

create trigger scheduled_posts_set_updated_at
before update on public.scheduled_posts
for each row execute function public.update_updated_at_column();

create trigger published_posts_set_updated_at
before update on public.published_posts
for each row execute function public.update_updated_at_column();

create trigger channel_accounts_set_updated_at
before update on public.channel_accounts
for each row execute function public.update_updated_at_column();

create trigger audience_segments_set_updated_at
before update on public.audience_segments
for each row execute function public.update_updated_at_column();

create trigger sync_opportunities_set_updated_at
before update on public.sync_opportunities
for each row execute function public.update_updated_at_column();

create trigger sync_deals_set_updated_at
before update on public.sync_deals
for each row execute function public.update_updated_at_column();

create trigger sync_submissions_set_updated_at
before update on public.sync_submissions
for each row execute function public.update_updated_at_column();

create trigger defi_positions_set_updated_at
before update on public.defi_positions
for each row execute function public.update_updated_at_column();

create trigger gig_settlements_set_updated_at
before update on public.gig_settlements
for each row execute function public.update_updated_at_column();

create trigger tour_routes_set_updated_at
before update on public.tour_routes
for each row execute function public.update_updated_at_column();

create trigger contact_tasks_set_updated_at
before update on public.contact_tasks
for each row execute function public.update_updated_at_column();

create trigger booking_playbooks_set_updated_at
before update on public.booking_playbooks
for each row execute function public.update_updated_at_column();

create trigger royalty_statement_uploads_set_updated_at
before update on public.royalty_statement_uploads
for each row execute function public.update_updated_at_column();

create trigger royalty_statement_lines_set_updated_at
before update on public.royalty_statement_lines
for each row execute function public.update_updated_at_column();

create trigger royalty_discrepancies_set_updated_at
before update on public.royalty_discrepancies
for each row execute function public.update_updated_at_column();

create trigger split_sheets_set_updated_at
before update on public.split_sheets
for each row execute function public.update_updated_at_column();

create trigger split_sheet_members_set_updated_at
before update on public.split_sheet_members
for each row execute function public.update_updated_at_column();

create trigger forecast_runs_set_updated_at
before update on public.forecast_runs
for each row execute function public.update_updated_at_column();

create trigger report_exports_set_updated_at
before update on public.report_exports
for each row execute function public.update_updated_at_column();

create trigger multichain_positions_set_updated_at
before update on public.multichain_positions
for each row execute function public.update_updated_at_column();

create trigger custodial_accounts_set_updated_at
before update on public.custodial_accounts
for each row execute function public.update_updated_at_column();

create trigger treasury_transfer_requests_set_updated_at
before update on public.treasury_transfer_requests
for each row execute function public.update_updated_at_column();

create trigger agent_templates_set_updated_at
before update on public.agent_templates
for each row execute function public.update_updated_at_column();

create trigger agent_installs_set_updated_at
before update on public.agent_installs
for each row execute function public.update_updated_at_column();

create trigger agent_runs_set_updated_at
before update on public.agent_runs
for each row execute function public.update_updated_at_column();

create trigger agent_run_steps_set_updated_at
before update on public.agent_run_steps
for each row execute function public.update_updated_at_column();

create trigger agent_tools_set_updated_at
before update on public.agent_tools
for each row execute function public.update_updated_at_column();

create trigger agent_memories_set_updated_at
before update on public.agent_memories
for each row execute function public.update_updated_at_column();

create trigger agent_marketplace_listings_set_updated_at
before update on public.agent_marketplace_listings
for each row execute function public.update_updated_at_column();

create trigger agent_inboxes_set_updated_at
before update on public.agent_inboxes
for each row execute function public.update_updated_at_column();
