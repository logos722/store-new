# ⚡ ISR Build Problem - Quick Fix

## 🔴 Problem

Production shows "No catalogs found" but works locally.

## ✅ Solution (Applied)

**File:** `src/app/page.tsx`

**Added:**
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 3600;
```

**What it does:**
- Disables pre-rendering during build
- Enables dynamic rendering on server
- Keeps ISR caching (1 hour)

## 🚀 Deploy & Test

```bash
# 1. Build
docker build -t app .

# 2. Run
docker run -p 3000:3000 \
  -e API_BASE_URL=http://backend:5000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.gelionaqua.ru \
  app

# 3. Test
curl http://localhost:3000 | grep "Наши каталоги"
```

## 📚 Docs

- [ISR_BUILD_FIX.md](./ISR_BUILD_FIX.md) - Full documentation
- [ISR_ПРОБЛЕМА_РЕШЕНИЕ.md](./ISR_ПРОБЛЕМА_РЕШЕНИЕ.md) - Russian version
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Env vars setup

---

✅ **Status:** Fixed  
📅 **Date:** 2025-11-18

