# ⚡ Quality System - Comenzi Simple

## 🎯 CEL MAI FOLOSITE (MEMOREAZĂ ACESTEA!)

### **1. Înainte de COMMIT:**

```bash
npm run quality:check
```

→ Verifică **TOTUL**: ESLint + TypeScript + Prettier
→ Dacă vezi erori, fixează-le!

### **2. Auto-fix ce poate:**

```bash
npm run quality:fix
```

→ Repară **AUTOMAT**: formatare + unele erori ESLint
→ Rulează asta ÎNTOTDEAUNA primul!

### **3. Format doar:**

```bash
npm run format
```

→ Fixează doar **formatarea** (spacing, quotes, etc.)

---

## 📋 WORKFLOW RECOMANDAT

### **Când lucrezi la cod:**

```bash
# Pas 1: Lucrezi la feature
# ... scrii cod ...

# Pas 2: Auto-fix
npm run quality:fix

# Pas 3: Verifică ce-a rămas
npm run quality:check

# Pas 4: Fix manual erorile rămase
# (vezi în VSCode liniile roșii)

# Pas 5: Commit!
git add .
git commit -m "Add feature"
```

---

## 🔍 COMENZI INDIVIDUALE (Dacă vrei detalii)

```bash
# Doar ESLint:
npm run lint

# Doar TypeScript:
npm run check:ts

# Doar Prettier (verificare):
npm run format:check
```

---

## ✅ CE REPARĂ AUTOMAT vs CE TREBUIE MANUAL

### **✅ Auto-Fix (quality:fix):**

- Spacing și indentare
- Quotes (single vs double)
- Semicolons
- Import organization
- Unele ESLint issues

### **❌ Trebuie MANUAL:**

- `any` types → Adaugă type corect
- `console.log` → Șterge-le
- Unused variables → Șterge sau folosește
- Missing React keys → Adaugă `key={item.id}`
- Hardcoded colors → Înlocuiește cu `var(--color-*)`

---

## 🚨 ERORI COMUNE

### **Eroare: "Unexpected any"**

```typescript
// ❌ GREȘIT:
function getData(id: any) {}

// ✅ CORECT:
function getData(id: string) {}
```

### **Eroare: "Unexpected console statement"**

```typescript
// ❌ GREȘIT:
console.log('test');

// ✅ CORECT:
// Șterge sau folosește doar în development:
if (process.env.NODE_ENV === 'development') {
  console.log('test');
}
```

### **Eroare: "Missing key prop"**

```typescript
// ❌ GREȘIT:
{items.map(item => <div>{item}</div>)}

// ✅ CORECT:
{items.map(item => <div key={item.id}>{item}</div>)}
```

---

## 💡 PRO TIPS

### **1. Format on Save (VSCode)**

Sistemul deja e configurat să formateze când salvezi!
→ Apasă `Cmd + S` și vezi magia! ✨

### **2. Quick Fix in VSCode**

Când vezi linie roșie:

1. Pune cursorul pe eroare
2. Apasă: `Cmd + .`
3. Selectează fix-ul sugerat
4. Done! ✅

### **3. Problems Panel**

Vezi TOATE erorile dintr-o dată:
→ `Cmd + Shift + M` (deschide Problems Panel)

---

## ✅ VERIFICARE FINALĂ

Când totul e gata:

```bash
npm run quality:check

# Dacă vezi:
# "✓ All checks passed!"
# → Ești gata de commit! 🎉

# Dacă vezi erori:
# → Fixează-le și rulează din nou!
```

---

**MEMOREAZĂ:** `npm run quality:fix` apoi `npm run quality:check` înainte de FIECARE commit! 🚀
