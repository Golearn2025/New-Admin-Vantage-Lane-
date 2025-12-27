#!/usr/bin/env python3
"""
Simulate smooth GPS movement for Constantin from current position to Dedeman Galați
Updates database every 3 seconds with 30 waypoints for realistic animation
"""

import os
import time
from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = "https://fmeonuvmlopkutbjejlo.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZW9udXZtbG9wa3V0YmplamxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzc0MzA4NywiZXhwIjoyMDQ5MzE5MDg3fQ.VYkYpLe9Ov2zzjXEqvtHXxYqVsHhPRvPXMcDkzBpZPQ")

# Driver ID
DRIVER_ID = "438d1979-65eb-4ee1-ae6d-f00eca761d87"

# Route coordinates
START_LAT = 45.473232  # Current position (Strada Zimbrului)
START_LNG = 28.038316

END_LAT = 45.446867    # Dedeman (Bulevardul Coșbuc)
END_LNG = 28.035382

# Number of waypoints (more = smoother animation)
NUM_WAYPOINTS = 30

# Delay between updates (seconds)
UPDATE_DELAY = 3

def generate_route(start_lat, start_lng, end_lat, end_lng, num_points):
    """Generate interpolated waypoints along a straight line"""
    waypoints = []
    for i in range(num_points + 1):
        progress = i / num_points
        lat = start_lat + (end_lat - start_lat) * progress
        lng = start_lng + (end_lng - start_lng) * progress
        waypoints.append((lat, lng))
    return waypoints

def update_driver_location(supabase: Client, lat: float, lng: float, step: int, total: int):
    """Update driver location in database"""
    try:
        result = supabase.table('drivers').update({
            'current_latitude': lat,
            'current_longitude': lng,
            'location_updated_at': 'now()'
        }).eq('id', DRIVER_ID).execute()
        
        print(f"✅ Step {step}/{total}: Updated to ({lat:.6f}, {lng:.6f})")
        return True
    except Exception as e:
        print(f"❌ Error updating location: {e}")
        return False

def main():
    print("🚗 Starting GPS Movement Simulation")
    print(f"📍 Route: Strada Zimbrului → Dedeman Galați")
    print(f"🎯 Waypoints: {NUM_WAYPOINTS}")
    print(f"⏱️  Update interval: {UPDATE_DELAY} seconds")
    print(f"⏳ Total duration: {NUM_WAYPOINTS * UPDATE_DELAY} seconds (~{NUM_WAYPOINTS * UPDATE_DELAY / 60:.1f} minutes)")
    print("\n" + "="*60 + "\n")
    
    # Initialize Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Generate route waypoints
    waypoints = generate_route(START_LAT, START_LNG, END_LAT, END_LNG, NUM_WAYPOINTS)
    
    print(f"🗺️  Generated {len(waypoints)} waypoints")
    print(f"🚀 Starting movement simulation...\n")
    
    # Simulate movement
    for i, (lat, lng) in enumerate(waypoints):
        success = update_driver_location(supabase, lat, lng, i + 1, len(waypoints))
        
        if not success:
            print("⚠️  Failed to update location, stopping simulation")
            break
        
        # Don't wait after the last update
        if i < len(waypoints) - 1:
            time.sleep(UPDATE_DELAY)
    
    print("\n" + "="*60)
    print("🎉 Simulation complete!")
    print(f"📍 Final position: Dedeman Galați ({END_LAT:.6f}, {END_LNG:.6f})")

if __name__ == "__main__":
    main()
