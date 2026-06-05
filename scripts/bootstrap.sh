#!/usr/bin/env bash
set -e
echo "🚀 On-Time Taxi bootstrap"

command -v node >/dev/null || { echo "❌ install Node 20+"; exit 1; }
command -v supabase >/dev/null || echo "⚠️  supabase CLI not found — install: brew install supabase/tap/supabase"

for d in admin-web rider-app driver-app marketing-web; do
  echo ""
  echo "📦 Installing $d..."
  (cd "$d" && npm install --no-audit --no-fund)
done

for d in admin-web rider-app driver-app marketing-web; do
  if [ ! -f "$d/.env.local" ] && [ ! -f "$d/.env" ]; then
    case $d in
      admin-web|marketing-web)
        cat > "$d/.env.local" <<EOF
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
EOF
        ;;
      rider-app|driver-app)
        cat > "$d/.env" <<EOF
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_KEY
EOF
        ;;
    esac
  fi
done

echo ""
echo "✅ Dependencies installed."
echo "Next:  fill .env files, then: supabase db push && supabase functions deploy --no-verify-jwt"
