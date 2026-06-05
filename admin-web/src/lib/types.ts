export interface Ride {
  id: string
  rider_id: string
  driver_id: string | null
  pickup_lat: number
  pickup_lng: number
  pickup_address: string
  dropoff_lat: number
  dropoff_lng: number
  dropoff_address: string
  tier: 'standard' | 'xl' | 'country_run' | 'long_haul' | 'pet' | 'wheelchair' | 'senior_assist'
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  estimated_fare: number
  final_fare: number | null
  payment_method: string | null
  payment_status: 'pending' | 'paid' | 'failed' | null
  created_at: string
  started_at: string | null
  completed_at: string | null
  distance_miles: number | null
  duration_minutes: number | null
}

export interface Driver {
  id: string
  user_id: string
  first_name: string
  last_name: string
  phone: string
  email: string
  vehicle_make: string
  vehicle_model: string
  vehicle_year: number
  vehicle_plate: string
  license_number: string
  license_expiry: string
  insurance_provider: string
  insurance_expiry: string
  background_check_status: 'pending' | 'approved' | 'rejected'
  background_check_date: string | null
  is_online: boolean
  current_lat: number | null
  current_lng: number | null
  rating: number
  total_rides: number
  is_banned: boolean
  created_at: string
  updated_at: string
}

export interface Rider {
  id: string
  user_id: string
  first_name: string
  last_name: string
  phone: string
  email: string
  payment_method: string | null
  rating: number
  total_rides: number
  is_banned: boolean
  created_at: string
  updated_at: string
}

export interface AdminSettings {
  base_fare: number
  per_mile_in_city: number
  per_mile_out_of_town: number
  per_minute: number
  min_fare: number
  platform_fee_pct: number
  surge_multiplier: number
  sos_active: boolean
  hospital_active: boolean
  birthday_active: boolean
  birthday_date: string // "MMDD" format
}

export interface GeoZone {
  state_code: string
  state_name: string
  is_active: boolean
  hq_lat: number | null
  hq_lng: number | null
  hq_name: string | null
}
