export type ProfileRole = "user" | "admin";

export type PropertyType =
  | "flat"
  | "self_contain"
  | "mini_flat"
  | "duplex"
  | "bungalow"
  | "terraced"
  | "penthouse"
  | "other";

export interface Profile {
  id: string;
  full_name: string | null;
  role: ProfileRole;
  created_at: string;
}

export interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  state: string;
  city: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number | null;
  property_type: PropertyType;
  rent_monthly: number;
  currency: string;
  amenities: string[];
  published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyFeeRow {
  id: string;
  property_id: string;
  label: string;
  amount: number;
  sort_order: number;
}

export interface PropertyMediaRow {
  id: string;
  property_id: string;
  storage_path: string;
  media_type: "image" | "video";
  sort_order: number;
  created_at: string;
}

export interface ReviewRow {
  id: string;
  property_id: string;
  user_id: string;
  rating: number;
  body: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArtisanRow {
  id: string;
  display_name: string;
  trade: string;
  bio: string | null;
  verified: boolean;
  whatsapp_e164: string | null;
  phone_e164: string | null;
  service_states: string[] | null;
  created_at: string;
}

export const AMENITY_OPTIONS = [
  "generator",
  "water_tank",
  "security",
  "packing",
  "fenced",
  "pop_ceiling",
  "wardrobe",
  "kitchen_fitted",
  "borehole",
  "prepaid_meter",
  "air_conditioning",
  "internet_ready",
] as const;
