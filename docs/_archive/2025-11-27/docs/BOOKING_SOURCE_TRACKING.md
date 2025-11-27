# 📍 **Booking Source Tracking - Implementare**

**Data:** 2025-10-22  
**Status:** ✅ IMPLEMENTAT  
**Versiune:** v1.0

---

## **🎯 OBIECTIV**

Urmărirea automată a sursei fiecărui booking pentru:
- Analytics (care canal generează cele mai multe bookings?)
- Business Intelligence (conversie landing page vs app vs telefon)
- Attribution tracking (de unde vin clienții?)

---

## **📊 SURSE DISPONIBILE**

| Source | Descriere | Status |
|--------|-----------|--------|
| `web` | Landing page / website public | ✅ ACTIV (implicit) |
| `app` | Mobile app (când va fi gata) | 🔜 VIITOR |
| `call_center` | Bookings făcute prin telefon | 🔜 VIITOR |
| `partner_api` | API-uri externe (integrations) | 🔜 VIITOR |

---

## **🔧 IMPLEMENTARE TEHNICĂ**

### **1. Schema Database**

```sql
-- Coloana adăugată în bookings table
ALTER TABLE bookings 
ADD COLUMN source VARCHAR(20) 
CHECK (source IN ('app', 'web', 'call_center', 'partner_api'));

-- Index pentru performance
CREATE INDEX idx_bookings_source_created_at 
ON bookings(source, created_at DESC);
```

### **2. TypeScript Contract**

```typescript
// apps/admin/shared/api/contracts/bookings.ts
export interface BookingListItem {
  // ...
  source: 'app' | 'web' | 'call_center' | 'partner_api';
}

// app/api/bookings/list/types.ts
export interface RawBooking {
  // ...
  source: 'app' | 'web' | 'call_center' | 'partner_api' | null;
}
```

### **3. API Transform**

```typescript
// app/api/bookings/list/transform.ts
source: booking.source || 'web', // Read from DB, fallback to 'web'
```

---

## **🚀 CUM SĂ SETEZI SOURCE AUTOMAT**

### **Opțiune A: Landing Page Form (CURRENT)**

Când userul trimite form de pe landing page:

```typescript
// În API-ul de creare booking (viitor)
const createBooking = async (data) => {
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      ...data,
      source: 'web', // ✅ Setează automat la 'web'
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
    
  return booking;
};
```

### **Opțiune B: Detectare Automată din Headers**

Pentru detectare inteligentă:

```typescript
// În API endpoint de creare booking
export async function POST(request: Request) {
  const userAgent = request.headers.get('user-agent');
  const referer = request.headers.get('referer');
  const apiKey = request.headers.get('x-api-key');
  
  // Detectare automată source
  let source: 'app' | 'web' | 'call_center' | 'partner_api' = 'web';
  
  if (apiKey) {
    source = 'partner_api'; // API extern
  } else if (userAgent?.includes('VantageLaneApp')) {
    source = 'app'; // Mobile app
  } else if (referer?.includes('admin')) {
    source = 'call_center'; // Admin panel (call center)
  } else {
    source = 'web'; // Landing page (default)
  }
  
  const booking = await createBooking({
    ...data,
    source, // ✅ Automat!
  });
}
```

### **Opțiune C: Manual (Call Center)**

În Admin Panel, când operator creează booking manual:

```typescript
// În UI Admin
const handleCreateBooking = async () => {
  await createBooking({
    ...formData,
    source: 'call_center', // ✅ Explicit
  });
};
```

---

## **📈 ANALYTICS USAGE**

### **Query pentru Raport Source**

```sql
-- Bookings pe source (ultima lună)
SELECT 
  source,
  COUNT(*) as total_bookings,
  ROUND(AVG(fare_amount), 2) as avg_revenue,
  SUM(fare_amount) as total_revenue
FROM bookings
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY source
ORDER BY total_bookings DESC;

-- Conversie rate per source
SELECT 
  source,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) as total,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE status = 'completed') / COUNT(*),
    2
  ) as conversion_rate
FROM bookings
GROUP BY source;
```

### **Dashboard Metrics**

```typescript
// În dashboard component
const sourceMetrics = await supabase
  .from('bookings')
  .select('source')
  .gte('created_at', startDate)
  .lte('created_at', endDate);

const breakdown = {
  web: sourceMetrics.filter(b => b.source === 'web').length,
  app: sourceMetrics.filter(b => b.source === 'app').length,
  call_center: sourceMetrics.filter(b => b.source === 'call_center').length,
  partner_api: sourceMetrics.filter(b => b.source === 'partner_api').length,
};
```

---

## **🔄 MIGRARE DATE EXISTENTE**

Pentru bookings create ÎNAINTE de această migrare:

```sql
-- Toate booking-urile vechi = 'web' (asumpție validă)
UPDATE bookings 
SET source = 'web' 
WHERE source IS NULL 
  AND created_at < '2025-10-22';
```

---

## **✅ CHECKLIST IMPLEMENTARE**

- [x] Migrare SQL creată (`20251022_add_booking_source.sql`)
- [x] TypeScript types actualizate (`RawBooking`, `BookingListItem`)
- [x] Transform modificat să citească din DB
- [x] Fallback la 'web' dacă NULL
- [x] Index pentru performance
- [ ] API de creare booking (când va fi implementat)
- [ ] Mobile app integration (viitor)
- [ ] Call center UI (viitor)
- [ ] Partner API documentation (viitor)

---

## **🎯 NEXT STEPS**

1. **Rulează migrarea:**
   ```bash
   # În Supabase Dashboard > SQL Editor
   # Sau via CLI (când va fi configurat)
   ```

2. **Verifică date existente:**
   ```sql
   SELECT source, COUNT(*) 
   FROM bookings 
   GROUP BY source;
   ```

3. **Implementează API de creare booking** cu auto-detection

4. **Adaugă analytics dashboard** pentru source metrics

---

**Autor:** Windsurf AI  
**Ultima actualizare:** 2025-10-22
