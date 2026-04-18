-- Demo seed: 12 published rentals with fee rows and external image URLs (Unsplash CDN).
-- Re-run safe: deletes prior seed rows by slug, then inserts fresh data.
-- Images are stock photos (not scraped from other listing sites).
--
-- After you create an auth user with email chinenye.godlove@gmail.com, this promotes them to admin:

begin;

delete from public.properties
where slug in (
  'newly-built-mini-flat-sangotedo-ajah',
  'spacious-3bed-badore-gated-lagos',
  'luxury-terrace-2bed-lekki-phase-1',
  'compact-self-contain-ikeja-gra',
  'executive-3bed-flat-wuse-2-abuja',
  'modern-duplex-gra-port-harcourt',
  'family-bungalow-trans-amadi-ph',
  'bright-2bed-flat-yaba-lagos',
  'serviced-3bed-flat-ikoyi-lagos',
  'sky-penthouse-victoria-island-lagos',
  'contemporary-2bed-flat-asaba',
  'quiet-3bed-bungalow-enugu'
);

insert into public.properties (
  id, slug, title, description, state, city, area, latitude, longitude,
  bedrooms, bathrooms, size_sqm, property_type, rent_monthly, currency, amenities, published, created_by
) values
(
  '10000000-0000-4000-8000-000000000001'::uuid,
  'newly-built-mini-flat-sangotedo-ajah',
  'Newly built mini flat — Happy Land Estate, Sangotedo',
  $d$Downstairs unit with clean finishing, steady water, and a quiet estate road. Ideal for young professionals working on the Lekki–Ajah corridor. Video viewing available on request.$d$,
  'Lagos', 'Ajah', 'Sangotedo', 6.4677, 3.8965,
  1, 1, 45, 'mini_flat', 208333, 'NGN',
  array['generator','water_tank','security','wardrobe','kitchen_fitted']::text[], true, null
),
(
  '10000000-0000-4000-8000-000000000002'::uuid,
  'spacious-3bed-badore-gated-lagos',
  'Well maintained 3 bedroom flat in a gated estate — Badore',
  $d$Spacious layout with POP finishing, fitted kitchen, and ample parking. Estate security and interlocked roads. Total move-in figures listed alongside agency and caution.$d$,
  'Lagos', 'Ajah', 'Badore', 6.4685, 3.9050,
  3, 3, 120, 'flat', 291667, 'NGN',
  array['security','packing','pop_ceiling','wardrobe','kitchen_fitted','borehole','prepaid_meter']::text[], true, null
),
(
  '10000000-0000-4000-8000-000000000003'::uuid,
  'luxury-terrace-2bed-lekki-phase-1',
  'Sharp 2 bedroom terrace — Lekki Phase 1',
  $d$Terraced home with fitted wardrobes, modern sanitary ware, and space for multiple cars. Bright living areas and a neighbourhood suited to families who want proximity to schools and retail.$d$,
  'Lagos', 'Lekki', 'Phase 1', 6.4541, 3.4799,
  2, 3, 180, 'terraced', 6250000, 'NGN',
  array['security','packing','pop_ceiling','wardrobe','kitchen_fitted','air_conditioning','internet_ready']::text[], true, null
),
(
  '10000000-0000-4000-8000-000000000004'::uuid,
  'compact-self-contain-ikeja-gra',
  'Compact self contain — Ikeja GRA',
  $d$Neat compact unit close to major roads. Good for solo renters who want quick access to the airport and mainland business districts.$d$,
  'Lagos', 'Ikeja', 'GRA', 6.6018, 3.3515,
  1, 1, 28, 'self_contain', 450000, 'NGN',
  array['security','prepaid_meter','water_tank']::text[], true, null
),
(
  '10000000-0000-4000-8000-000000000005'::uuid,
  'executive-3bed-flat-wuse-2-abuja',
  'Executive 3 bedroom flat — Wuse II',
  $d$Well-lit rooms, generous living area, and proximity to business hubs in the FCT. Suitable for corporate tenants needing space for a small home office.$d$,
  'FCT', 'Abuja', 'Wuse II', 9.0765, 7.3986,
  3, 4, 140, 'flat', 1800000, 'NGN',
  array['security','generator','borehole','air_conditioning','internet_ready','wardrobe']::text[], true, null
),
(
  '10000000-0000-4000-8000-000000000006'::uuid,
  'modern-duplex-gra-port-harcourt',
  'Modern duplex — Old GRA, Port Harcourt',
  $d$Split-level layout with family-sized living spaces, private parking, and quick access to GRA amenities. Great for households relocating to Rivers State.$d$,
  'Rivers', 'Port Harcourt', 'Old GRA', 4.8156, 7.0498,
  4, 4, 260, 'duplex', 3500000, 'NGN',
  array['security','packing','pop_ceiling','wardrobe','kitchen_fitted','generator']::text[], true, null
),
(
  '10000000-0000-4000-8000-000000000007'::uuid,
  'family-bungalow-trans-amadi-ph',
  'Family bungalow — Trans Amadi industrial layout',
  $d$Single-level home with fenced compound and room to expand outdoor seating. Suited to renters who prefer no stairs and easy maintenance.$d$,
  'Rivers', 'Port Harcourt', 'Trans Amadi', 4.8240, 7.0335,
  3, 2, 200, 'bungalow', 800000, 'NGN',
  array['fenced','security','borehole','water_tank']::text[], true, null
),
(
  '10000000-0000-4000-8000-000000000008'::uuid,
  'bright-2bed-flat-yaba-lagos',
  'Bright 2 bedroom flat — Yaba',
  $d$Close to universities and tech hubs. Natural light, functional layout, and easy commute to the island via Third Mainland routes during off-peak hours.$d$,
  'Lagos', 'Yaba', 'Alagomeji', 6.5095, 3.3711,
  2, 2, 85, 'flat', 650000, 'NGN',
  array['prepaid_meter','security','pop_ceiling','wardrobe']::text[], true, null
),
(
  '10000000-0000-4000-8000-000000000009'::uuid,
  'serviced-3bed-flat-ikoyi-lagos',
  'Serviced 3 bedroom flat — Ikoyi',
  $d$Elevator access, backup power, and concierge-style building management. Suited to executives who want premium finishing and quiet streets.$d$,
  'Lagos', 'Ikoyi', 'South West', 6.4527, 3.4350,
  3, 4, 220, 'flat', 4500000, 'NGN',
  array['security','generator','air_conditioning','internet_ready','wardrobe','kitchen_fitted','water_tank']::text[], true, null
),
(
  '10000000-0000-4000-8000-00000000000a'::uuid,
  'sky-penthouse-victoria-island-lagos',
  'Skyline penthouse — Victoria Island',
  $d$Panoramic views, expansive terraces, and hotel-grade finishes. Designed for renters who want statement space with room to entertain.$d$,
  'Lagos', 'Lagos Island', 'Victoria Island', 6.4281, 3.4219,
  4, 5, 380, 'penthouse', 12000000, 'NGN',
  array['security','generator','air_conditioning','internet_ready','wardrobe','kitchen_fitted','pop_ceiling']::text[], true, null
),
(
  '10000000-0000-4000-8000-00000000000b'::uuid,
  'contemporary-2bed-flat-asaba',
  'Contemporary 2 bedroom flat — Asaba',
  $d$Newly painted interiors, tiled floors, and proximity to government and retail districts in Delta State capital.$d$,
  'Delta', 'Asaba', 'GRA', 6.2059, 6.6953,
  2, 2, 95, 'flat', 550000, 'NGN',
  array['security','borehole','prepaid_meter','wardrobe']::text[], true, null
),
(
  '10000000-0000-4000-8000-00000000000c'::uuid,
  'quiet-3bed-bungalow-enugu',
  'Quiet 3 bedroom bungalow — Enugu',
  $d$Set in a calm neighbourhood with manageable compound space. Ideal for families seeking affordability without sacrificing room count.$d$,
  'Enugu', 'Enugu', 'Independence Layout', 6.4474, 7.5139,
  3, 3, 180, 'bungalow', 380000, 'NGN',
  array['fenced','water_tank','security','pop_ceiling']::text[], true, null
);

-- Typical one-time move-in fees (₦). Amounts are illustrative for demo purposes.
insert into public.property_fees (property_id, label, amount, sort_order) values
('10000000-0000-4000-8000-000000000001'::uuid, 'Agency (10%)', 250000, 0),
('10000000-0000-4000-8000-000000000001'::uuid, 'Legal', 50000, 1),
('10000000-0000-4000-8000-000000000001'::uuid, 'Caution deposit', 100000, 2),

('10000000-0000-4000-8000-000000000002'::uuid, 'Agency (10%)', 350000, 0),
('10000000-0000-4000-8000-000000000002'::uuid, 'Service charge (annual)', 500000, 1),
('10000000-0000-4000-8000-000000000002'::uuid, 'Caution deposit', 350000, 2),

('10000000-0000-4000-8000-000000000003'::uuid, 'Agency (10%)', 7500000, 0),
('10000000-0000-4000-8000-000000000003'::uuid, 'Legal', 300000, 1),

('10000000-0000-4000-8000-000000000004'::uuid, 'Agency', 80000, 0),
('10000000-0000-4000-8000-000000000004'::uuid, 'Caution deposit', 200000, 1),

('10000000-0000-4000-8000-000000000005'::uuid, 'Agency (10%)', 1800000, 0),
('10000000-0000-4000-8000-000000000005'::uuid, 'Refundable caution', 500000, 1),

('10000000-0000-4000-8000-000000000006'::uuid, 'Agency (10%)', 4200000, 0),
('10000000-0000-4000-8000-000000000006'::uuid, 'Legal', 250000, 1),

('10000000-0000-4000-8000-000000000007'::uuid, 'Agency', 150000, 0),
('10000000-0000-4000-8000-000000000007'::uuid, 'Caution deposit', 400000, 1),

('10000000-0000-4000-8000-000000000008'::uuid, 'Agency', 120000, 0),
('10000000-0000-4000-8000-000000000008'::uuid, 'Service charge', 180000, 1),

('10000000-0000-4000-8000-000000000009'::uuid, 'Agency (10%)', 5400000, 0),
('10000000-0000-4000-8000-000000000009'::uuid, 'Refundable caution', 2000000, 1),

('10000000-0000-4000-8000-00000000000a'::uuid, 'Agency (10%)', 14400000, 0),
('10000000-0000-4000-8000-00000000000a'::uuid, 'Legal', 500000, 1),

('10000000-0000-4000-8000-00000000000b'::uuid, 'Agency', 150000, 0),
('10000000-0000-4000-8000-00000000000b'::uuid, 'Caution deposit', 300000, 1),

('10000000-0000-4000-8000-00000000000c'::uuid, 'Agency', 100000, 0),
('10000000-0000-4000-8000-00000000000c'::uuid, 'Legal', 40000, 1);

-- External image URLs (Unsplash). storage_path doubles as absolute URL when it starts with http(s).
insert into public.property_media (property_id, storage_path, media_type, sort_order) values
('10000000-0000-4000-8000-000000000001'::uuid, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80', 'image', 0),
('10000000-0000-4000-8000-000000000001'::uuid, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80', 'image', 1),

('10000000-0000-4000-8000-000000000002'::uuid, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80', 'image', 0),
('10000000-0000-4000-8000-000000000002'::uuid, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80', 'image', 1),

('10000000-0000-4000-8000-000000000003'::uuid, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', 'image', 0),
('10000000-0000-4000-8000-000000000003'::uuid, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80', 'image', 1),

('10000000-0000-4000-8000-000000000004'::uuid, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80', 'image', 0),

('10000000-0000-4000-8000-000000000005'::uuid, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=80', 'image', 0),
('10000000-0000-4000-8000-000000000005'::uuid, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80', 'image', 1),

('10000000-0000-4000-8000-000000000006'::uuid, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80', 'image', 0),

('10000000-0000-4000-8000-000000000007'::uuid, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80', 'image', 0),

('10000000-0000-4000-8000-000000000008'::uuid, 'https://images.unsplash.com/photo-1560185127-6ed190bf0a4a?auto=format&fit=crop&w=1400&q=80', 'image', 0),

('10000000-0000-4000-8000-000000000009'::uuid, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80', 'image', 0),
('10000000-0000-4000-8000-000000000009'::uuid, 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1400&q=80', 'image', 1),

('10000000-0000-4000-8000-00000000000a'::uuid, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=80', 'image', 0),
('10000000-0000-4000-8000-00000000000a'::uuid, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80', 'image', 1),

('10000000-0000-4000-8000-00000000000b'::uuid, 'https://images.unsplash.com/photo-1567767292273-7f21fc7d469e?auto=format&fit=crop&w=1400&q=80', 'image', 0),

('10000000-0000-4000-8000-00000000000c'::uuid, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=80', 'image', 0);

update public.profiles
set role = 'admin'
where id in (
  select id from auth.users where lower(email) = lower('chinenye.godlove@gmail.com')
);

commit;
