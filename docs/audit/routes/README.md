# Route Inventory Summary

**Generated:** 2025-11-27T02:19:32.622Z

## Overview
- **Total Routes:** 57
- **Dynamic Routes:** 5
- **Protected Routes:** 55

## By Role
- **ADMIN:** 52 routes
- **OPERATOR:** 0 routes
- **DRIVER:** 0 routes
- **SHARED:** 5 routes

## Files Generated
- `routes.json` - Machine-readable route data
- `admin.md` - Admin routes list
- `operator.md` - Operator routes list  
- `driver.md` - Driver routes list
- `shared.md` - Shared routes list

## Usage
```bash
# Re-run route inventory
node scripts/audit-routes.mjs

# View route data
cat docs/audit/routes/routes.json | jq
```
