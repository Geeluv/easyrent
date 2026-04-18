-- Run with Supabase CLI or paste into SQL Editor (Dashboard).
-- After: create first admin with:
-- update public.profiles set role = 'admin' where id = '<your-auth-user-uuid>';

-- Extensions
create extension if not exists "pgcrypto";

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create policy "Profiles: read"
  on public.profiles for select
  to authenticated, anon
  using (true);

create policy "Profiles: update own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Profiles: admin update any"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.enforce_profile_role_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_role_enforce on public.profiles;
create trigger trg_profiles_role_enforce
  before update on public.profiles
  for each row execute function public.enforce_profile_role_update();

-- Properties
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  state text not null,
  city text not null,
  area text,
  latitude double precision,
  longitude double precision,
  bedrooms int not null default 1 check (bedrooms >= 0),
  bathrooms int not null default 1 check (bathrooms >= 0),
  size_sqm numeric,
  property_type text not null default 'other',
  rent_monthly numeric not null check (rent_monthly >= 0),
  currency text not null default 'NGN',
  amenities text[] not null default '{}',
  published boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_properties_state_city on public.properties (state, city);
create index idx_properties_rent on public.properties (rent_monthly);
create index idx_properties_bedrooms on public.properties (bedrooms);
create index idx_properties_published on public.properties (published);

alter table public.properties enable row level security;

create policy "Properties: public read published"
  on public.properties for select
  using (published = true or public.is_admin());

create policy "Properties: admin write"
  on public.properties for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Fees
create table public.property_fees (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  label text not null,
  amount numeric not null check (amount >= 0),
  sort_order int not null default 0
);

create index idx_property_fees_property on public.property_fees (property_id);

alter table public.property_fees enable row level security;

create policy "Fees: follow property read"
  on public.property_fees for select
  using (
    exists (
      select 1 from public.properties pr
      where pr.id = property_id and (pr.published = true or public.is_admin())
    )
  );

create policy "Fees: admin write"
  on public.property_fees for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Media (files live in storage bucket `listings`)
create table public.property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image', 'video')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_property_media_property on public.property_media (property_id, sort_order);

alter table public.property_media enable row level security;

create policy "Media: follow property read"
  on public.property_media for select
  using (
    exists (
      select 1 from public.properties pr
      where pr.id = property_id and (pr.published = true or public.is_admin())
    )
  );

create policy "Media: admin write"
  on public.property_media for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, user_id)
);

create index idx_reviews_property on public.reviews (property_id);

alter table public.reviews enable row level security;

create policy "Reviews: read on published"
  on public.reviews for select
  using (
    exists (
      select 1 from public.properties pr
      where pr.id = property_id and pr.published = true
    )
  );

create policy "Reviews: insert own"
  on public.reviews for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.properties pr
      where pr.id = property_id and pr.published = true
    )
  );

create policy "Reviews: update own"
  on public.reviews for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Reviews: delete own"
  on public.reviews for delete
  to authenticated
  using (auth.uid() = user_id);

-- Artisans
create table public.artisans (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  trade text not null,
  bio text,
  verified boolean not null default false,
  whatsapp_e164 text,
  phone_e164 text,
  service_states text[],
  created_at timestamptz not null default now()
);

alter table public.artisans enable row level security;

create policy "Artisans: public read"
  on public.artisans for select
  using (true);

create policy "Artisans: admin write"
  on public.artisans for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Storage: public bucket for listing assets
insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do nothing;

create policy "Listing files: public read"
  on storage.objects for select
  using (bucket_id = 'listings');

create policy "Listing files: admin upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'listings'
    and public.is_admin()
  );

create policy "Listing files: admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'listings' and public.is_admin())
  with check (bucket_id = 'listings' and public.is_admin());

create policy "Listing files: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listings' and public.is_admin());
