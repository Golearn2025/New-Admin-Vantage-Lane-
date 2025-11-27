# Enterprise Code Quality Workflow

AI MUST follow these rules when creating ANY code for this project.

## 🚫 FORBIDDEN (ZERO TOLERANCE)

1. **NO `any` types** - EVER

   - Use proper TypeScript interfaces
   - Import types from contracts
   - If unsure, use `unknown` and type guard

2. **NO hardcoded values**

   - Colors: use `var(--color-*)`
   - Spacing: use `var(--spacing-*)`
   - Typography: use `var(--font-*)`

3. **NO console.log in production code**

   - Remove all console statements
   - Use proper error handling

4. **NO files over 200 lines**

   - Split into smaller components
   - Extract hooks
   - Modularize logic

5. **NO unused imports/variables**
   - Clean up before finalizing
   - Organize imports

## ✅ REQUIRED (ALWAYS)

1. **TypeScript strict types**

   ```typescript
   // ✅ GOOD
   interface Props {
     user: User;
     onUpdate: (id: string) => void;
   }

   // ❌ BAD
   interface Props {
     user: any;
     onUpdate: any;
   }
   ```

2. **Design tokens only**

   ```css
   /* ✅ GOOD */
   .component {
     background: var(--color-primary);
     padding: var(--spacing-md);
   }

   /* ❌ BAD */
   .component {
     background: #f1d16a;
     padding: 20px;
   }
   ```

3. **Component structure**

   ```
   ComponentName/
   ├── ComponentName.tsx (max 200 lines)
   ├── ComponentName.module.css
   ├── types.ts
   └── index.ts (exports)
   ```

4. **File naming**
   - Components: `PascalCase.tsx`
   - Hooks: `useCamelCase.ts`
   - Utils: `camelCase.ts`
   - Types: `PascalCase.types.ts`

## 📋 WORKFLOW STEPS

### When creating a component:

1. **Ask for requirements**

   - What does it do?
   - What props needed?
   - Any constraints?

2. **Create types FIRST**

   ```typescript
   // types.ts
   export interface ComponentNameProps {
     // ... proper types
   }
   ```

3. **Create component**

   - Max 200 lines
   - Design tokens only
   - Proper TypeScript types

4. **Create CSS Module**

   - Design tokens only
   - BEM naming if complex

5. **Export from index.ts**

   ```typescript
   export { ComponentName } from './ComponentName';
   export type { ComponentNameProps } from './types';
   ```

6. **VERIFY before showing to user**
   - Run: `pnpm quality:check`
   - Fix any errors
   - THEN show result

## 🔍 SELF-CHECK BEFORE COMPLETION

Before saying "Done", verify:

- [ ] NO `any` types
- [ ] NO hardcoded colors/spacing
- [ ] NO console.log
- [ ] Files under 200 lines
- [ ] Proper TypeScript interfaces
- [ ] Design tokens used
- [ ] Imports organized
- [ ] No unused code

## 💬 COMMUNICATION STYLE

When user asks for feature:

1. **Confirm understanding**
   "I'll create [feature] with:

   - TypeScript strict types
   - Design tokens only
   - Max 200 lines/file
   - Modular structure

   Correct?"

2. **Show plan before implementing**
   "Structure:

   - Component A (UI logic)
   - Hook useB (data logic)
   - Types C (interfaces)

   Proceed?"

3. **After implementation**
   "✅ Created [files]
   ✅ Quality checks passed
   ✅ Ready to use"

## 🎯 QUALITY GATES

Run these BEFORE showing code to user:

```bash
pnpm quality:check
```

If errors: FIX THEM, don't show broken code!

## 📝 REMEMBER

User is junior developer.
User TRUSTS you to create enterprise-quality code.
User CANNOT judge if code is good.
SYSTEM will block bad code at commit.

DO NOT disappoint!
