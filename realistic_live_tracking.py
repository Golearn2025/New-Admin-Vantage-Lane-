#!/usr/bin/env python3
"""
Realistic Live GPS Tracking - Smooth movement on real streets
Sends GPS waypoints one by one with delays for smooth animation
"""

import requests
import time
from datetime import datetime

# Configuration
SUPABASE_URL = "https://fmeonuvmlopkutbjejlo.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZW9udXZtbG9wa3V0YmplamxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDUxMjgsImV4cCI6MjA3NTc4MTEyOH0.F-tnfRXp-8TyMa56uRjdCwvbY1bSVVVO2IcMrN-3OC4"
MAPBOX_TOKEN = "pk.eyJ1IjoidmFudGFnZWxhbmUiLCJhIjoiY21peGw4NTIxMDR5YjNkcXp3eGN0OTc3YyJ9.S1VwkfoU1jU97dOF4Nayjw"
DRIVER_ID = "438d1979-65eb-4ee1-ae6d-f00eca761d87"

# Route: From current position to a destination in Galați
START_LNG = 28.039838
START_LAT = 45.422598
END_LNG = 28.060000
END_LAT = 45.450000

# Delay between GPS updates (seconds) - realistic GPS update interval
UPDATE_DELAY = 5

def get_route_from_mapbox(start_lng, start_lat, end_lng, end_lat):
    """Get real route following streets from Mapbox Directions API"""
    url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{start_lng},{start_lat};{end_lng},{end_lat}"
    params = {
        'geometries': 'geojson',
        'steps': 'true',
        'access_token': MAPBOX_TOKEN
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    if 'routes' in data and len(data['routes']) > 0:
        coordinates = data['routes'][0]['geometry']['coordinates']
        # Convert from [lng, lat] to [lat, lng] and return
        return [(coord[1], coord[0]) for coord in coordinates]
    return []

def update_driver_position(lat, lng, address=""):
    """Update driver position in Supabase"""
    url = f"{SUPABASE_URL}/rest/v1/drivers"
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    data = {
        'current_latitude': lat,
        'current_longitude': lng,
        'location_updated_at': datetime.utcnow().isoformat() + 'Z'
    }
    
    if address:
        data['address'] = address
    
    params = {'id': f'eq.{DRIVER_ID}'}
    
    try:
        response = requests.patch(url, json=data, headers=headers, params=params)
        return response.status_code in [200, 204]
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🚗 REALISTIC LIVE GPS TRACKING")
    print("=" * 60)
    print("")
    print("📍 Getting real route from Mapbox Directions API...")
    
    # Get route following real streets
    waypoints = get_route_from_mapbox(START_LNG, START_LAT, END_LNG, END_LAT)
    
    if not waypoints:
        print("❌ Failed to get route from Mapbox")
        return
    
    print(f"✅ Route received: {len(waypoints)} waypoints on real streets")
    print(f"⏱️  Update interval: {UPDATE_DELAY} seconds")
    print(f"⏳ Total duration: ~{len(waypoints) * UPDATE_DELAY} seconds ({len(waypoints) * UPDATE_DELAY / 60:.1f} minutes)")
    print("")
    print("🗺️  Open http://localhost:3000/drivers-map to watch LIVE!")
    print("")
    print("=" * 60)
    print("")
    
    # Send waypoints one by one with delay
    for i, (lat, lng) in enumerate(waypoints):
        progress = (i + 1) / len(waypoints) * 100
        
        if i == 0:
            address = "Start - Pe străzi reale"
        elif i == len(waypoints) - 1:
            address = "ARRIVED - Traseu complet pe străzi!"
        else:
            address = f"Pe traseu - {progress:.0f}%"
        
        print(f"📍 {i+1}/{len(waypoints)} ({progress:.0f}%): lat={lat:.6f}, lng={lng:.6f}")
        
        success = update_driver_position(lat, lng, address)
        
        if not success:
            print(f"⚠️  Failed to update position")
        
        # Wait before sending next update (except for last point)
        if i < len(waypoints) - 1:
            time.sleep(UPDATE_DELAY)
    
    print("")
    print("=" * 60)
    print("✅ Simulation complete!")
    print(f"📍 Final position: lat={waypoints[-1][0]:.6f}, lng={waypoints[-1][1]:.6f}")
    print("=" * 60)

if __name__ == "__main__":
    main()
