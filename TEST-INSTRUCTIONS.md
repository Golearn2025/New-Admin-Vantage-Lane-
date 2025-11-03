# 🧪 **MANUAL TESTING INSTRUCTIONS - LOGIN PERFORMANCE**

## **PREREQUISITES**
- Browser: Chrome/Edge (cu DevTools)
- Server running: `npm run dev` pe port 3000
- URL: http://localhost:3000/login

---

## **TEST 1: RE-RENDERS COUNT (React Profiler)**

### **Pași:**
1. Deschide Chrome DevTools: `Cmd+Option+I` (Mac) sau `F12` (Windows)
2. Mergi la tab **"Profiler"**
3. Click **"Record"** (butonul roșu rond)
4. În pagină:
   - Tastează în **email**: `test@example.com` (10 caractere)
   - Tastează în **password**: `password123` (12 caractere)
   - Click **"Show/Hide password"** de 5 ori
   - Bifează **"Remember me"**
   - Click **"Sign in"** de 10 ori (rapid)
5. Oprește recording (click pe butonul roșu din nou)
6. În Profiler, caută:
   - **"Flamegraph"** tab
   - **"Ranked"** tab
   - **Component name: "LoginForm"**

### **Output necesar:**
```
Total renders: X
LoginForm renders: X
FormRow (email) renders: X
FormRow (password) renders: X
Button renders: X
Wasted renders: [list components]
Render duration: X ms
```

---

## **TEST 2: MEMORY LEAK CHECK**

### **Pași:**
1. Deschide Chrome DevTools: `Cmd+Option+I`
2. Mergi la tab **"Performance"**
3. Bifează **"Memory"** checkbox (sus în toolbar)
4. Click **"Record"** (butonul gri rond)
5. În pagină:
   - Completează form cu email/password
   - Click **"Sign in"** de 20 ori (1 click per secundă)
   - Așteaptă 5 secunde
6. Oprește recording
7. În Performance tab:
   - Caută graficul **"JS Heap"** (linia albastră)
   - Notează **Initial heap**: X MB
   - Notează **Final heap**: X MB
   - Notează **Peak heap**: X MB

### **Output necesar:**
```
Initial JS Heap: X MB
Peak JS Heap: X MB
Final JS Heap: X MB
Memory Growth: X MB (Final - Initial)
Memory Leak: YES/NO (dacă growth > 5MB = YES)
```

### **✅ Target:**
- Growth < 2MB = PASS
- Growth 2-5MB = WARNING
- Growth > 5MB = FAIL (memory leak)

---

## **TEST 3: REQUEST SPAM PREVENTION (COST)**

### **Pași:**
1. Deschide Chrome DevTools: `Cmd+Option+I`
2. Mergi la tab **"Console"**
3. Clear console: `Cmd+K` sau click icon "Clear console"
4. În pagină:
   - Completează form cu email/password
   - Click **"Sign in"** de 10 ori RAPID (în 2 secunde)
5. În Console:
   - Numără câte `LOGIN_REQUEST_START` există
   - Numără câte `LOGIN_REQUEST_END` există
   - Verifică timestamp-urile (trebuie să fie sincrone)

### **Output necesar:**
```
Total LOGIN_REQUEST_START: X
Total LOGIN_REQUEST_END: X
Duplicate requests: X (START - END)
Request timestamps:
  1. START: 2025-11-02T21:45:00.123Z → END: 2025-11-02T21:45:01.456Z (duration: 1.3s)
  2. START: 2025-11-02T21:45:02.789Z → END: 2025-11-02T21:45:03.012Z (duration: 0.2s)
  ...
```

### **✅ Target:**
- 10 clicks → 10 START, 10 END = PASS
- 10 clicks → 15+ START = FAIL (spam not prevented)

### **COST ESTIMATION:**
```
Formula: Total requests × $0.000005 per request
Example: 10 requests × $0.000005 = $0.00005 (5 cents per 1000 users)
```

---

## **TEST 4: NETWORK TAB (Request Verification)**

### **Pași:**
1. Deschide Chrome DevTools: `Cmd+Option+I`
2. Mergi la tab **"Network"**
3. Clear network log (icon "Clear")
4. În pagină:
   - Completează form
   - Click **"Sign in"**
5. În Network tab:
   - Filtrează după "XHR" sau "Fetch"
   - Caută request către `/api/auth` sau similar
   - Click pe request → tab "Headers"
   - Click pe request → tab "Response"

### **Output necesar:**
```
Request count: X
Request method: POST/GET
Request URL: /api/...
Request size: X KB
Response size: X KB
Response time: X ms
Status code: 200/401/500
```

---

## **TEST 5: CONSOLE LOGS ANALYSIS**

### **Cum citești logurile:**
```javascript
// Console output example:
LOGIN_REQUEST_START 2025-11-02T21:45:00.123Z
LOGIN_REQUEST_END 2025-11-02T21:45:01.456Z STATUS: ERROR

// Analysis:
✅ Pair matched (START + END exist)
✅ Duration = 1.333s (END time - START time)
✅ Status clear (ERROR/SUCCESS/EXCEPTION)
```

### **Red flags:**
```
❌ LOGIN_REQUEST_START without LOGIN_REQUEST_END (hanging request)
❌ Multiple LOGIN_REQUEST_START with same timestamp (duplicate)
❌ LOGIN_REQUEST_END without LOGIN_REQUEST_START (logic error)
```

---

## **TEST 6: REACT COMPONENT TREE**

### **Pași:**
1. Deschide React DevTools extension
2. Tab **"Components"**
3. Selectează **"LoginForm"**
4. În sidebar dreapta:
   - Notează **"props"** (trebuie să fie handlers din hook)
   - Notează **"hooks"** (useState, useCallback)
   - Verifică dacă **inline functions** există (RED FLAG!)

### **Output necesar:**
```
Component: LoginForm
Props received:
  - (none - folosește hook intern)

Hooks used:
  - useLoginForm (custom)

Children:
  - FormRow × 2
  - Button × 1
  - Checkbox × 1
  - ErrorBanner × 1 (conditional)

Inline functions: YES/NO
```

---

## **QUICK REFERENCE - DevTools Shortcuts**

```bash
Cmd+Option+I   # Deschide DevTools (Mac)
F12            # Deschide DevTools (Windows)
Cmd+K          # Clear console
Cmd+Shift+P    # Command palette
Cmd+R          # Reload page
Cmd+Shift+R    # Hard reload (clear cache)
```

---

## **RAPORTARE FINALĂ**

După toate testele, completează:

```markdown
## PERFORMANCE TEST RESULTS

### RE-RENDERS:
- Total: X
- LoginForm: X
- Wasted: X

### MEMORY:
- Initial: X MB
- Final: X MB
- Leak: YES/NO

### REQUESTS:
- Expected: 10
- Actual: X
- Spam prevented: YES/NO

### COST:
- Requests: X
- Cost: $X (X × $0.000005)

### ISSUES FOUND:
1. [descriere]
2. [descriere]
```

---

## **TROUBLESHOOTING**

**Problem:** Profiler tab nu există
**Solution:** Instalează React DevTools extension

**Problem:** Console nu arată logs
**Solution:** Verifică că filter-ul e setat pe "All levels"

**Problem:** Memory tab nu există
**Solution:** Bifează checkbox "Memory" în Performance tab

**Problem:** Server nu pornește
**Solution:** `npm run dev` apoi așteaptă "Ready"
