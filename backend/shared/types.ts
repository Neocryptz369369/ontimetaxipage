// Shared TS types across rider-app, driver-app, admin-web, edge functions

export type Role = "rider" | "driver" | "admin" | "dispatcher";
export type TierCode = "standard" | "xl" | "country" | "long_haul" | "pet" | "wav" | "senior";
export type RideStatus =
  | "requested" | "searching" | "accepted" | "arriving" | "arrived"
  | "in_progress" | "completed" | "canceled" | "no_show";
export type PaymentMethod = "square" | "paypal" | "cash";
export type PaymentStatus = "pending" | "authorized" | "captured" | "refunded" | "failed";

export interface User {
  id: string;
  role: Role;
  phone: string;
  email?: string;
  full_name?: string;
  photo_url?: string;
  rating: number;
  total_rides: number;
  status: "active" | "suspended" | "banned";
  created_at: string;
}

export interface LatLng { lat: number; lng: number; }
export interface Place extends LatLng { address: string; }

export interface Tier {
  code: TierCode;
  name: string;
  base_fare: number;
  per_mile: number;
  per_minute: number;
  minimum_fare: number;
  surcharge: number;
  long_haul_per_mile_rt: number | null;
  active: boolean;
}

export interface Ride {
  id: string;
  rider_id: string;
  driver_id: string | null;
  tier_code: TierCode;
  status: RideStatus;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_address: string;
  dropoff_lat: number;
  dropoff_lng: number;
  is_out_of_state: boolean;
  is_round_trip: boolean;
  estimated_miles: number | null;
  estimated_minutes: number | null;
  quoted_fare: number;
  final_fare: number | null;
  tolls: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_ref: string | null;
  scheduled_for: string | null;
  requested_at: string;
  accepted_at: string | null;
  picked_up_at: string | null;
  completed_at: string | null;
  canceled_at: string | null;
  cancel_reason: string | null;
  rider_rating: number | null;
  driver_rating: number | null;
  rider_note: string | null;
  driver_note: string | null;
}

export interface QuoteRequest {
  tier: TierCode;
  pickup: Place;
  dropoff: Place;
  is_round_trip?: boolean;
  pets?: boolean;
}
export interface QuoteResponse {
  tier: TierCode;
  fare: number;
  miles: number;
  minutes: number;
  is_out_of_state: boolean;
  is_round_trip: boolean;
  breakdown: Record<string, number>;
}
