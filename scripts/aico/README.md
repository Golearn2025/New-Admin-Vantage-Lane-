# 🤖 AICO System - AI Controlled Creation

**Automated code generation following Vantage Lane Admin architecture rules**

---

## 🎯 **WHAT IS AICO?**

AICO (AI Controlled Creation) is a CLI system that generates code following:
- ✅ Feature-Sliced Design architecture
- ✅ 100% design tokens (zero hardcoding)
- ✅ TypeScript strict mode
- ✅ Files < 200 lines
- ✅ Zero logic in `app/` folder
- ✅ Proper imports (@features/@entities)

---

## 🚀 **QUICK START:**

### **Generate a Feature (UI + Hooks + Types):**
```bash
npm run aico:feature booking-form
```

**Creates:**
```
apps/admin/features/booking-form/
├── components/
│   ├── BookingForm.tsx
│   └── BookingForm.module.css
├── hooks/
│   └── useBookingForm.ts
├── types/
│   └── index.ts
├── index.ts
└── booking-form.test.ts
```

---

### **Generate an Entity (Business Logic + API):**
```bash
npm run aico:entity payment
```

**Creates:**
```
apps/admin/entities/payment/
├── model/
│   ├── schema.ts (Zod schemas)
│   └── types.ts (TypeScript types)
├── api/
│   └── paymentApi.ts (CRUD operations)
├── lib/
│   └── validatePayment.ts
├── index.ts
└── payment.test.ts
```

---

### **Generate a Page (Routing Only):**
```bash
npm run aico:page users/all
```

**Creates:**
```
app/(admin)/users/all/
└── page.tsx (imports from @features only!)
```

---

## 📋 **ALL COMMANDS:**

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run aico:feature <name>` | Generate feature | components + hooks + types |
| `npm run aico:entity <name>` | Generate entity | API + schemas + validation |
| `npm run aico:page <path>` | Generate page | routing only (zero logic) |
| `npm run aico:guardian` | Run quality checks | validates all rules |
| `npm run aico:validate` | Validate structure | checks architecture |

---

## 🏗️ **ARCHITECTURE RULES:**

### **app/ → Routing Only**
```typescript
// ✅ CORRECT:
import { UsersTable } from '@features/users-table';

export default function UsersPage() {
  return <UsersTable />;
}

// ❌ WRONG:
export default function UsersPage() {
  const [users, setUsers] = useState([]); // NO LOGIC!
  // ...
}
```

### **features/ → UI Components**
```typescript
// components/
// hooks/
// columns/
// types/

// Import from:
import { Button } from '@vantage-lane/ui-core';
import { listUsers } from '@entities/user';
```

### **entities/ → Business Logic**
```typescript
// model/ (schemas + types)
// api/ (CRUD operations)
// lib/ (helpers + validation)

// No UI imports!
// Only Supabase, Zod, utilities
```

---

## 🎨 **DESIGN TOKENS ENFORCEMENT:**

### **✅ CORRECT:**
```css
.container {
  padding: var(--spacing-6);
  background: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
}
```

### **❌ WRONG:**
```css
.container {
  padding: 24px;        /* ❌ Hardcoded! */
  background: #ffffff;  /* ❌ Hardcoded! */
  border-radius: 12px;  /* ❌ Hardcoded! */
}
```

---

## 📦 **EXAMPLE WORKFLOW:**

### **Creating "Payments" Section:**

#### **1. Create Entity (Business Logic):**
```bash
npm run aico:entity payment
```

#### **2. Edit API + Schema:**
```typescript
// apps/admin/entities/payment/model/schema.ts
export const PaymentSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  status: z.enum(['pending', 'completed', 'failed']),
  // ...
});
```

#### **3. Create Feature (UI):**
```bash
npm run aico:feature payments-table
```

#### **4. Implement Component:**
```typescript
// apps/admin/features/payments-table/components/PaymentsTable.tsx
import { listPayments } from '@entities/payment';
import { DataTable } from '@vantage-lane/ui-core';

export function PaymentsTable() {
  const { data, loading } = usePayments();
  // ...
}
```

#### **5. Create Page:**
```bash
npm run aico:page payments
```

#### **6. Validate:**
```bash
npm run aico:validate
npm run test:run
npm run check:ts
npm run lint
```

---

## ✅ **VALIDATION CHECKLIST:**

Before committing, AICO generates code that passes:

- ✅ **TypeScript:** 0 errors
- ✅ **ESLint:** 0 errors, 0 warnings
- ✅ **File Size:** All files < 200 lines
- ✅ **Design Tokens:** 100% usage
- ✅ **Architecture:** No logic in app/
- ✅ **Tests:** Generated for all code
- ✅ **Imports:** Correct aliases (@features/@entities)

---

## 🔧 **CUSTOMIZATION:**

### **Config Location:**
```
scripts/aico/config/aico-creation-rules.json
```

### **Key Settings:**
```json
{
  "rules": {
    "typescript": {
      "maxFileLines": 200,
      "maxComplexity": 15,
      "strict": true
    },
    "ui": {
      "designTokens": {
        "mandatory": true
      }
    }
  }
}
```

---

## 🐛 **TROUBLESHOOTING:**

### **Error: "Cannot find module"**
```bash
# Make sure generators are executable:
chmod +x scripts/aico/generators/*.cjs
```

### **Error: "Path does not exist"**
```bash
# Run from project root:
cd /Users/tomita/CascadeProjects/Vantage\ Lane\ Admin
npm run aico:feature my-feature
```

### **Generated code has errors**
```bash
# Validate structure first:
npm run aico:validate

# Run guardian for detailed report:
npm run aico:guardian
```

---

## 💡 **BEST PRACTICES:**

1. **Always generate from project root**
2. **Use kebab-case for names:** `users-table`, not `UsersTable`
3. **Follow naming conventions:**
   - Features: `{name}-table`, `{name}-form`, `{name}-modal`
   - Entities: singular (`user`, `payment`, `booking`)
   - Pages: match URL path (`users/all`, `payments`)
4. **Edit generated code:** Templates are starting points!
5. **Run validations before commit**
6. **Delete unused generated files**

---

## 📚 **RELATED DOCS:**

- **[RULES.md](../../RULES.md)** - Full project rules
- **[WORKFLOW.md](../../WORKFLOW.md)** - Development workflow
- **[STRUCTURE.md](../../docs/STRUCTURE.md)** - Architecture guide

---

## 🎉 **BENEFITS:**

- ⚡ **10x faster** than manual coding
- 🎯 **100% consistent** code patterns
- ✅ **Zero architecture errors**
- 📚 **Self-documenting** code
- 🚀 **Onboarding in minutes**
- 🛡️ **Built-in quality gates**

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-24  
**Adapted for:** Vantage Lane Admin (Feature-Sliced Design)
