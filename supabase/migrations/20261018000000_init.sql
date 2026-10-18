-- Verdict MVP schema.
-- An operator (auth user) registers agents and opens contracts between them.
-- For now every row belongs to the operator who created it; cross-operator
-- access (buyer and seller run by different people) comes later.

create type agent_role as enum ('buyer', 'seller', 'both');
create type contract_status as enum (
  'open',        -- escrow hold placed, waiting for delivery
  'delivered',   -- seller delivered, buyer can accept or dispute
  'accepted',    -- buyer accepted, full capture
  'disputed',    -- dispute filed, reproduction + judge running
  'ruled',       -- ruling issued, waiting on settlement
  'settled',     -- capture split done
  'cancelled'
);
create type evidence_party as enum ('buyer', 'seller', 'verdict');

-- Early-access requests from the landing page.
create table early_access (
  id bigint generated always as identity primary key,
  email text not null,
  company text,
  role text not null,
  created_at timestamptz not null default now()
);

create table agents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  role agent_role not null default 'both',
  public_key text,               -- ed25519 public key used to sign contracts
  api_key_hash text,             -- sha256 of the agent's API key, for MCP calls
  created_at timestamptz not null default now()
);

create table contracts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  buyer_agent_id uuid not null references agents (id),
  seller_agent_id uuid not null references agents (id),
  task text not null,
  price_amount integer not null check (price_amount > 0),  -- minor units
  currency text not null default 'usd',
  acceptance jsonb not null default '[]',                  -- machine-checkable checks
  payout_rule text not null default 'pro_rata_on_pass',
  deadline timestamptz,
  status contract_status not null default 'open',
  stripe_payment_intent_id text unique,
  buyer_signature text,
  seller_signature text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table deliveries (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts (id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table disputes (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null unique references contracts (id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

create table evidence (
  id uuid primary key default gen_random_uuid(),
  dispute_id uuid not null references disputes (id) on delete cascade,
  party evidence_party not null,
  kind text not null,            -- 'statement' | 'reproduction' | 'file' ...
  content jsonb not null,
  created_at timestamptz not null default now()
);

create table rulings (
  id uuid primary key default gen_random_uuid(),
  dispute_id uuid not null unique references disputes (id) on delete cascade,
  summary text not null,
  findings jsonb not null,       -- [{ text, cites: [evidence_id] }]
  seller_amount integer not null check (seller_amount >= 0),
  buyer_amount integer not null check (buyer_amount >= 0),
  model text not null,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create index on agents (owner_id);
create index on contracts (owner_id, created_at desc);
create index on deliveries (contract_id);
create index on evidence (dispute_id);

-- Row-level security ---------------------------------------------------------

alter table early_access enable row level security;
alter table agents enable row level security;
alter table contracts enable row level security;
alter table deliveries enable row level security;
alter table disputes enable row level security;
alter table evidence enable row level security;
alter table rulings enable row level security;

-- Anyone can request early access; nobody can read the list through the API.
create policy "anyone can request early access" on early_access
  for insert to anon, authenticated with check (true);

create policy "owners manage their agents" on agents
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "owners manage their contracts" on contracts
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (
    owner_id = (select auth.uid())
    and exists (select 1 from agents a where a.id = buyer_agent_id and a.owner_id = (select auth.uid()))
    and exists (select 1 from agents a where a.id = seller_agent_id and a.owner_id = (select auth.uid()))
  );

create function owns_contract(cid uuid) returns boolean
language sql stable security invoker set search_path = '' as $$
  select exists (
    select 1 from public.contracts c where c.id = cid and c.owner_id = (select auth.uid())
  );
$$;

create function owns_dispute(did uuid) returns boolean
language sql stable security invoker set search_path = '' as $$
  select exists (
    select 1 from public.disputes d
    join public.contracts c on c.id = d.contract_id
    where d.id = did and c.owner_id = (select auth.uid())
  );
$$;

create policy "owners manage deliveries" on deliveries
  for all to authenticated using (owns_contract(contract_id)) with check (owns_contract(contract_id));

create policy "owners manage disputes" on disputes
  for all to authenticated using (owns_contract(contract_id)) with check (owns_contract(contract_id));

create policy "owners manage evidence" on evidence
  for all to authenticated using (owns_dispute(dispute_id)) with check (owns_dispute(dispute_id));

-- Rulings are written by the server (service role) only; owners can read them.
create policy "owners read rulings" on rulings
  for select to authenticated using (owns_dispute(dispute_id));

create function touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger contracts_touch before update on contracts
  for each row execute function touch_updated_at();
