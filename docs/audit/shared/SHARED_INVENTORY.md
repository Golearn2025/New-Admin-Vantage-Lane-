# Shared Inventory - Complete Analysis

**Generated:** 2025-11-27T02:57:54.649Z

## Summary

- **Admin Files:** 228 (245 unique imports)
- **Operator Files:** 13 (4 unique imports)  
- **Driver Files:** 13 (24 unique imports)

## Shared Analysis

- **All 3 Roles:** 0 shared imports
- **Admin + Operator:** 1 shared imports
- **Admin + Driver:** 2 shared imports
- **Operator + Driver:** 0 shared imports

## Shared Candidates Analysis

- **ui-core:** ✅ 150 files (`packages/ui-core/src`)
- **shared:** ✅ 52 files (`apps/admin/shared`)
- **entities:** ✅ 156 files (`apps/admin/entities`)
- **formatters:** ✅ 1 files (`packages/formatters/src`)

## Top Imports by Role

### Admin Top Imports
- `packages/ui-core/src` (104 times)
- `apps/admin/features/admin/prices-management/components/PricesManagementPage.module.css` (27 times)
- `apps/admin/entities/pricing` (26 times)
- `apps/admin/entities/user` (19 times)
- `apps/admin/features/admin/booking-create/types` (13 times)
- `apps/admin/lib/supabase/client` (13 times)
- `apps/admin/features/admin/prices-management/hooks/usePricesManagement` (11 times)
- `apps/admin/entities/driver` (8 times)
- `apps/admin/entities/review` (8 times)
- `apps/admin/features/admin/user-profile/types` (6 times)

### Operator Top Imports  
- `apps/admin/shared/hooks/useCurrentUser` (2 times)
- `apps/admin/features/operator/operator-dashboard/hooks/useOperatorDashboard` (1 times)
- `apps/admin/features/operator/operator-dashboard/components/OperatorDashboard.module.css` (1 times)
- `apps/admin/shared/config/dashboard.types` (1 times)

### Driver Top Imports
- `packages/ui-core/src` (9 times)
- `apps/admin/entities/document` (9 times)
- `apps/admin/entities/vehicle` (3 times)
- `apps/admin/features/driver/driver-documents-upload/components/DocumentUploadModal` (3 times)
- `apps/admin/shared/hooks/useDriverSession` (3 times)
- `apps/admin/features/driver/driver-documents-upload/components/AddVehicleModal` (2 times)
- `apps/admin/features/driver/driver-documents-upload/components/DocumentCard` (2 times)
- `apps/admin/entities/document/api/uploadDocument` (2 times)
- `apps/admin/features/driver/driver-documents-upload/components/AddVehicleModal.module.css` (1 times)
- `apps/admin/features/driver/driver-documents-upload/components/DocumentCard.module.css` (1 times)

## Recommendations

### Extract to Shared
*No imports shared by all 3 roles*

### Consolidate Similar


## Files Generated
- `shared.json` - Complete data export
- `SHARED_ALL.md` - All 3 roles
- `SHARED_AO.md` - Admin + Operator  
- `SHARED_AD.md` - Admin + Driver
- `SHARED_OD.md` - Operator + Driver
