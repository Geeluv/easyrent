-- Saves / favourites, inspection watchlist, inspection bookings (Paystack), listing lock after paid inspection

alter table public.properties
  add column if not exists inspection_locked boolean not null default false;

create index if not exists idx_properties_coords on public.properties (latitude, longitude)
  where published = true and latitude is not null and longitude is not null;

-- Who saved a listing (visible to saver, listing uploader, admins)
create table public.property_saves (
  user_id uuid not null references public.profiles (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

create index idx_property_saves_property on public.property_saves (property_id);

alter table public.property_saves enable row level security;

create policy "Saves: read own, uploader, or admin"
  on public.property_saves for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.is_admin()
    or exists (
      select 1 from public.properties pr
      where pr.id = property_id and pr.created_by = auth.uid()
    )
  );

create policy "Saves: insert own"
  on public.property_saves for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Saves: delete own"
  on public.property_saves for delete
  to authenticated
  using (auth.uid() = user_id);

-- Watchlist for upcoming inspections
create table public.property_inspection_watchlist (
  user_id uuid not null references public.profiles (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

create index idx_inspection_watchlist_user on public.property_inspection_watchlist (user_id);
create index idx_inspection_watchlist_property on public.property_inspection_watchlist (property_id);

alter table public.property_inspection_watchlist enable row level security;

create policy "Watchlist: read own, uploader, or admin"
  on public.property_inspection_watchlist for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.is_admin()
    or exists (
      select 1 from public.properties pr
      where pr.id = property_id and pr.created_by = auth.uid()
    )
  );

create policy "Watchlist: insert own"
  on public.property_inspection_watchlist for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Watchlist: delete own"
  on public.property_inspection_watchlist for delete
  to authenticated
  using (auth.uid() = user_id);

-- Paid inspection applications (non-refundable fee)
create table public.inspection_bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  applicant_full_name text not null,
  applicant_address text not null,
  applicant_phone text not null,
  applicant_occupation text not null,
  applicant_state_of_origin text not null,
  applicant_relationship_status text not null,
  applicant_organization text not null,
  applicant_num_occupants int not null check (applicant_num_occupants >= 1),
  property_count int not null check (property_count between 1 and 10),
  amount_ngn numeric not null check (amount_ngn > 0),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'failed', 'abandoned')),
  paystack_reference text unique,
  paystack_access_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_inspection_bookings_user on public.inspection_bookings (user_id);
create index idx_inspection_bookings_status on public.inspection_bookings (status);

-- Lines: which listings are in a booking (must exist before policies that reference it)
create table public.inspection_booking_properties (
  booking_id uuid not null references public.inspection_bookings (id) on delete cascade,
  property_id uuid not null references public.properties (id) on delete cascade,
  primary key (booking_id, property_id)
);

create index idx_ibp_property on public.inspection_booking_properties (property_id);

alter table public.inspection_bookings enable row level security;

create policy "Inspection bookings: insert own"
  on public.inspection_bookings for insert
  to authenticated
  with check (auth.uid() = user_id);

alter table public.inspection_booking_properties enable row level security;

create policy "IBP: select if booking visible"
  on public.inspection_booking_properties for select
  to authenticated
  using (
    exists (
      select 1 from public.inspection_bookings b
      where b.id = booking_id
        and (b.user_id = auth.uid() or public.is_admin())
    )
    or exists (
      select 1
      from public.properties pr
      where pr.id = property_id
        and pr.created_by = auth.uid()
    )
  );

create policy "IBP: insert for own pending booking"
  on public.inspection_booking_properties for insert
  to authenticated
  with check (
    exists (
      select 1 from public.inspection_bookings b
      where b.id = booking_id
        and b.user_id = auth.uid()
        and b.status = 'pending_payment'
    )
  );

-- Depends on inspection_booking_properties (see EXISTS on ibp)
create policy "Inspection bookings: select own, admin, or property uploader"
  on public.inspection_bookings for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.is_admin()
    or exists (
      select 1
      from public.inspection_booking_properties ibp
      join public.properties pr on pr.id = ibp.property_id
      where ibp.booking_id = inspection_bookings.id
        and pr.created_by = auth.uid()
    )
  );
