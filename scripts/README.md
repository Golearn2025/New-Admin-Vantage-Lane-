# 🛠️ Scripts Directory

**Verification & Deployment Scripts**

---

## 📋 **AVAILABLE SCRIPTS:**

### **1. check-everything.sh** ⭐ **RECOMMENDED**

```bash
./scripts/check-everything.sh
```

**Ce face:**

- ✅ TypeScript compilation
- ✅ ESLint code quality
- ✅ Next.js production build
- ✅ P0 critical items verification
- ✅ Security audit

**Când să-l folosești:**

- Înainte de commit mare
- Înainte de Pull Request
- Înainte de merge la main
- Când vrei verificare completă

**Durată:** ~5 minute

---

### **2. check-health.sh**

```bash
./scripts/check-health.sh
# SAU
npm run check:p0
```

**Ce face:**

- ✅ Verifică P0 critical files exist
- ✅ Verifică environment variables
- ✅ Verifică security headers
- ✅ Verifică build success

**Când să-l folosești:**

- Quick check P0 items
- După modificări critice
- Verificare rapidă înainte de commit

**Durată:** ~1 minut

---

### **3. verify-pr1.sh**

```bash
./scripts/verify-pr1.sh
```

**Ce face:**

- Legacy PR verification script

**Status:** Legacy (use check-everything.sh instead)

---

## 🚀 **QUICK START:**

### **Verificare Rapidă (1 min):**

```bash
npm run check:p0
```

### **Verificare Completă (5 min):**

```bash
./scripts/check-everything.sh
```

### **Verificare Automată (pre-push):**

```bash
git push
# Auto-runs check:all
```

---

## ⚡ **NPM SCRIPTS (alternative):**

Poți rula direct din package.json:

```bash
# Quick checks
npm run check:ts          # TypeScript
npm run check:lint        # ESLint
npm run check:next        # Build
npm run check:p0          # P0 items

# Complete checks
npm run check:all         # All checks + reports
npm run check:enterprise  # Architecture checks

# Testing
npm test                  # Unit tests
npm run test:e2e          # E2E tests

# Security
npm audit                 # Vulnerabilities
```

---

## 📊 **COMPARISON:**

| Script                  | Duration | Checks              | Use Case        |
| ----------------------- | -------- | ------------------- | --------------- |
| **check:p0**            | 1 min    | P0 only             | Quick verify    |
| **check:all**           | 3 min    | TS + Lint + Build   | Standard verify |
| **check-everything.sh** | 5 min    | All + P0 + Security | Full verify     |

---

## 🎯 **RECOMMENDED WORKFLOW:**

```bash
# 1. Durante dezvoltare:
npm run check:ts        # Check types frecvent

# 2. Înainte de commit mic:
npm run check:all       # Standard check

# 3. Înainte de commit mare:
./scripts/check-everything.sh   # Full check

# 4. Înainte de PR:
./scripts/check-everything.sh   # Full check
npm test                        # Run tests

# 5. Înainte de deploy:
npm run check:all       # Final verify
npm run check:p0        # P0 check
```

---

## 🔧 **TROUBLESHOOTING:**

### **Script nu e executable:**

```bash
chmod +x scripts/check-everything.sh
chmod +x scripts/check-health.sh
```

### **Script fails cu "command not found":**

```bash
# Run din project root:
cd /path/to/Vantage\ Lane\ Admin
./scripts/check-everything.sh
```

### **npm run check:p0 fails:**

```bash
# Make sure script exists:
ls -la scripts/check-health.sh

# Run manual:
bash scripts/check-health.sh
```

---

## 📝 **OUTPUT EXAMPLES:**

### **Success:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ ALL CHECKS PASSED!
  🎉 SAFE TO COMMIT!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### **Failure:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ❌ SOME CHECKS FAILED!
  ⚠️  FIX ERRORS BEFORE COMMITTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check:
- /tmp/check_output.log for details
- Fix errors
- Re-run script
```

---

## 🎓 **BEST PRACTICES:**

1. **Rulează check-everything.sh înainte de commit mare**
2. **Rulează check:p0 după modificări P0 files**
3. **Review script output pentru warnings**
4. **Fix toate errors înainte de commit**
5. **Nu skip checks pentru "quick fixes"**

---

## 💡 **PRO TIPS:**

### **Alias în .bashrc/.zshrc:**

```bash
alias check-all='cd /path/to/project && ./scripts/check-everything.sh'
alias check-p0='cd /path/to/project && npm run check:p0'
```

### **Git Hook:**

```bash
# .git/hooks/pre-commit
#!/bin/bash
npm run check:all || exit 1
```

### **VS Code Task:**

```json
{
  "label": "Check Everything",
  "type": "shell",
  "command": "./scripts/check-everything.sh"
}
```

---

## 📚 **RELATED DOCS:**

- **PRE-COMMIT-CHECKLIST.md** - Complete checklist
- **P0-FILES-CHECKLIST.md** - P0 items reference
- **STRUCTURE.md** - Project structure

---

**Last updated:** 2025-10-19  
**Version:** 1.0.0
