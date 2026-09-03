create schema if not exists app_private;

create type app_private."IngredientCategory" as enum ('raw_material', 'packaging', 'other');
create type app_private."Unit" as enum ('mg', 'g', 'kg', 'ml', 'l', 'un', 'min', 'h');
create type app_private."OfferKind" as enum ('product', 'service');
create type app_private."FeeKind" as enum ('percentage', 'fixed');
create type app_private."FeeCategory" as enum ('tax', 'payment', 'marketplace', 'other');

create table app_private.workspaces (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  schema_version integer not null default 2 check (schema_version = 2),
  revision bigint not null default 1 check (revision > 0),
  created_at timestamptz(3) not null default current_timestamp,
  updated_at timestamptz(3) not null
);

create table app_private.business_settings (
  workspace_id uuid primary key references app_private.workspaces(owner_id) on delete cascade,
  business_name text not null default '',
  logo_path text,
  region text not null default '',
  labor_hour_cents bigint not null default 0 check (labor_hour_cents >= 0),
  default_margin_bps integer not null default 0 check (default_margin_bps between 0 and 10000),
  selected_sales_channel_id text not null
);

create table app_private.fixed_costs (
  workspace_id uuid primary key references app_private.workspaces(owner_id) on delete cascade,
  aluguel bigint not null default 0 check (aluguel >= 0),
  energia bigint not null default 0 check (energia >= 0),
  internet bigint not null default 0 check (internet >= 0),
  salarios bigint not null default 0 check (salarios >= 0),
  outros bigint not null default 0 check (outros >= 0)
);

create table app_private.fixed_cost_extras (
  workspace_id uuid not null references app_private.workspaces(owner_id) on delete cascade,
  id text not null,
  name text not null check (btrim(name) <> ''),
  value_cents bigint not null check (value_cents >= 0),
  position integer not null check (position >= 0),
  primary key (workspace_id, id)
);

create table app_private.ingredients (
  workspace_id uuid not null references app_private.workspaces(owner_id) on delete cascade,
  id text not null,
  name text not null check (btrim(name) <> ''),
  category app_private."IngredientCategory" not null,
  purchase_price_cents bigint not null check (purchase_price_cents >= 0),
  purchase_quantity numeric(20,6) not null check (purchase_quantity > 0),
  purchase_unit app_private."Unit" not null,
  active boolean not null default true,
  created_at timestamptz(3) not null,
  updated_at timestamptz(3) not null,
  primary key (workspace_id, id)
);

create table app_private.offers (
  workspace_id uuid not null references app_private.workspaces(owner_id) on delete cascade,
  id text not null,
  kind app_private."OfferKind" not null,
  name text not null check (btrim(name) <> ''),
  category text not null check (btrim(category) <> ''),
  active boolean not null default true,
  batch_yield numeric(20,6) not null check (batch_yield > 0),
  batch_time_minutes numeric(20,6) not null check (batch_time_minutes >= 0),
  expected_monthly_sales numeric(20,6) not null check (expected_monthly_sales >= 0),
  desired_margin_bps integer check (desired_margin_bps between 0 and 10000),
  created_at timestamptz(3) not null,
  updated_at timestamptz(3) not null,
  primary key (workspace_id, id)
);

create table app_private.offer_components (
  workspace_id uuid not null references app_private.workspaces(owner_id) on delete cascade,
  offer_id text not null,
  id text not null,
  ingredient_id text not null,
  quantity numeric(20,6) not null check (quantity > 0),
  unit app_private."Unit" not null,
  waste_bps integer not null check (waste_bps between 0 and 10000),
  position integer not null check (position >= 0),
  primary key (workspace_id, offer_id, id),
  unique (workspace_id, offer_id, ingredient_id),
  foreign key (workspace_id, offer_id) references app_private.offers(workspace_id, id) on delete cascade,
  foreign key (workspace_id, ingredient_id) references app_private.ingredients(workspace_id, id) on delete restrict
);

create table app_private.sales_channels (
  workspace_id uuid not null references app_private.workspaces(owner_id) on delete cascade,
  id text not null,
  name text not null check (btrim(name) <> ''),
  active boolean not null default true,
  is_default boolean not null default false,
  created_at timestamptz(3) not null,
  updated_at timestamptz(3) not null,
  primary key (workspace_id, id)
);

create table app_private.channel_fees (
  workspace_id uuid not null references app_private.workspaces(owner_id) on delete cascade,
  sales_channel_id text not null,
  id text not null,
  name text not null check (btrim(name) <> ''),
  kind app_private."FeeKind" not null,
  category app_private."FeeCategory" not null,
  value bigint not null check (value >= 0),
  position integer not null check (position >= 0),
  primary key (workspace_id, sales_channel_id, id),
  foreign key (workspace_id, sales_channel_id) references app_private.sales_channels(workspace_id, id) on delete cascade
);

alter table app_private.business_settings
  add constraint business_settings_selected_channel_fkey
  foreign key (workspace_id, selected_sales_channel_id)
  references app_private.sales_channels(workspace_id, id) on delete restrict;

create index fixed_cost_extras_workspace_id_idx on app_private.fixed_cost_extras(workspace_id);
create index ingredients_workspace_id_idx on app_private.ingredients(workspace_id);
create index offers_workspace_id_idx on app_private.offers(workspace_id);
create index offer_components_workspace_id_ingredient_id_idx on app_private.offer_components(workspace_id, ingredient_id);
create index sales_channels_workspace_id_idx on app_private.sales_channels(workspace_id);
create unique index sales_channels_one_active_default_idx
  on app_private.sales_channels(workspace_id)
  where active and is_default;
create index channel_fees_workspace_id_sales_channel_id_idx
  on app_private.channel_fees(workspace_id, sales_channel_id);

alter table app_private.workspaces enable row level security;
alter table app_private.business_settings enable row level security;
alter table app_private.fixed_costs enable row level security;
alter table app_private.fixed_cost_extras enable row level security;
alter table app_private.ingredients enable row level security;
alter table app_private.offers enable row level security;
alter table app_private.offer_components enable row level security;
alter table app_private.sales_channels enable row level security;
alter table app_private.channel_fees enable row level security;

revoke all on schema app_private from public, anon, authenticated;
revoke all on all tables in schema app_private from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('business-logos', 'business-logos', false, 409600, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
