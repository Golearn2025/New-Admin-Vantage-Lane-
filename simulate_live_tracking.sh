#!/bin/bash
# Live GPS Tracking Simulation - Constantin drives through Galați
# Updates every 3 seconds with smooth realtime animation

echo "🚗 LIVE GPS TRACKING SIMULATION"
echo "================================"
echo ""
echo "📍 Route: Current Position → Centrul Galați"
echo "🎯 Waypoints: 20 points"
echo "⏱️  Update interval: 3 seconds"
echo "⏳ Total duration: 60 seconds (1 minute)"
echo ""
echo "🗺️  Open http://localhost:3000/drivers-map to watch LIVE!"
echo ""
echo "================================"
echo ""

# Start position (current)
START_LAT=45.480000
START_LNG=28.070000

# End position (Centrul Galați)
END_LAT=45.43376
END_LNG=28.05401

# Driver ID
DRIVER_ID="438d1979-65eb-4ee1-ae6d-f00eca761d87"

# Supabase config
SUPABASE_URL="https://fmeonuvmlopkutbjejlo.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZW9udXZtbG9wa3V0YmplamxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDUxMjgsImV4cCI6MjA3NTc4MTEyOH0.F-tnfRXp-8TyMa56uRjdCwvbY1bSVVVO2IcMrN-3OC4"

# Number of waypoints
STEPS=20

# Calculate step increments
LAT_STEP=$(echo "scale=8; ($END_LAT - $START_LAT) / $STEPS" | bc)
LNG_STEP=$(echo "scale=8; ($END_LNG - $START_LNG) / $STEPS" | bc)

echo "🚀 Starting live tracking simulation..."
echo ""

# Simulate movement
for i in $(seq 0 $STEPS); do
    # Calculate current position
    PROGRESS=$(echo "scale=8; $i / $STEPS" | bc)
    CURRENT_LAT=$(echo "scale=8; $START_LAT + ($END_LAT - $START_LAT) * $PROGRESS" | bc)
    CURRENT_LNG=$(echo "scale=8; $START_LNG + ($END_LNG - $START_LNG) * $PROGRESS" | bc)
    
    # Calculate percentage
    PERCENT=$(echo "scale=0; $PROGRESS * 100" | bc)
    
    echo "📍 Step $((i+1))/$((STEPS+1)): ${PERCENT}% - Moving to ($CURRENT_LAT, $CURRENT_LNG)"
    
    # Update database via Supabase REST API
    curl -s -X PATCH \
        "$SUPABASE_URL/rest/v1/drivers?id=eq.$DRIVER_ID" \
        -H "apikey: $ANON_KEY" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=minimal" \
        -d "{\"current_latitude\": $CURRENT_LAT, \"current_longitude\": $CURRENT_LNG, \"location_updated_at\": \"$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")\"}" \
        > /dev/null
    
    # Wait 3 seconds before next update (except for last step)
    if [ $i -lt $STEPS ]; then
        sleep 3
    fi
done

echo ""
echo "================================"
echo "✅ Simulation complete!"
echo "📍 Final position: Centrul Galați ($END_LAT, $END_LNG)"
echo "================================"
