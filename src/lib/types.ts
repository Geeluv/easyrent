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
  inspection_locked: boolean;
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
  "parking_space",
  "fenced",
  "pop_ceiling",
  "wardrobe",
  "kitchen_fitted",
  "borehole",
  "water_board",
  "borehole_and_water_board",
  "prepaid_meter",
  "air_conditioning",
  "internet_ready",
  "tiled_floors",
  "running_water",
  "balcony",
  "en_suite",
  "guest_toilet",
] as const;

export interface PropertySaveRow {
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface PropertyInspectionWatchlistRow {
  user_id: string;
  property_id: string;
  created_at: string;
}

export type InspectionBookingStatus = "pending_payment" | "paid" | "failed" | "abandoned";

export interface InspectionBookingRow {
  id: string;
  user_id: string;
  applicant_full_name: string;
  applicant_address: string;
  applicant_phone: string;
  applicant_occupation: string;
  applicant_state_of_origin: string;
  applicant_relationship_status: string;
  applicant_organization: string;
  applicant_num_occupants: number;
  property_count: number;
  amount_ngn: number;
  status: InspectionBookingStatus;
  paystack_reference: string | null;
  paystack_access_code: string | null;
  created_at: string;
  updated_at: string;
}
