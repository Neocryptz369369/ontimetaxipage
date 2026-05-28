export type RideTier = 'standard'|'xl'|'country'|'long_haul'|'pet'|'wav'|'senior';
export type RideStatus = 'requested'|'dispatching'|'accepted'|'arriving'|'in_progress'|'completed'|'cancelled'|'no_show';
export type UserRole = 'rider'|'driver'|'admin'|'dispatcher';

export interface User { id:string; role:UserRole; phone:string; email?:string; full_name?:string; photo_url?:string; rating:number; total_rides:number; status:string; }
export interface Ride {
  id:string; rider_id:string; driver_id?:string; tier:RideTier; status:RideStatus;
  pickup_lat:number; pickup_lng:number; pickup_address:string;
  dropoff_lat:number; dropoff_lng:number; dropoff_address:string;
  is_long_haul:boolean; is_round_trip:boolean; scheduled_for?:string;
  quoted_fare:number; final_fare?:number; distance_mi:number; duration_min:number;
  payment_method?:string; payment_status:string;
  rider_rating?:number; driver_rating?:number;
}
