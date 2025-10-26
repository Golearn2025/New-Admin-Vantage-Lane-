#!/bin/bash
# Clean restart script
# Fixes "Invalid Server Actions request" errors

echo "🧹 Cleaning Next.js cache..."
rm -rf .next

echo "🔄 Restarting development server..."
npm run dev
