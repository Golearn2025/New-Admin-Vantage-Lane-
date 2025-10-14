# Vantage Lane Admin Dashboard

![QA](https://github.com/Golearn2025/New-Admin-Vantage-Lane-/actions/workflows/qa.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)

## Overview
Admin dashboard for Vantage Lane ride-hailing platform providing comprehensive management capabilities for operators, drivers, and business operations.

## Project Structure

This project follows the Feature-Sliced Design architecture with strict module boundaries and frozen interfaces.

## Development

### Quick Start
```bash
npm install
npm run dev        # Start development server
npm run check:all  # Run full QA pipeline
```

### QA Pipeline
- **TypeScript**: `npm run check:ts`
- **ESLint**: `npm run check:lint`  
- **Build**: `npm run check:next`
- **All checks**: `npm run check:all`
- **Lighthouse**: `npm run lh:login`

### Branch Protection
- All pushes run pre-push QA validation via Husky
- PRs require passing QA workflow + 1 approval
- CODEOWNERS review required for protected paths

See `docs/` folder for detailed documentation:
- `PROJECT-PLAN.md` - Project roadmap and milestones
- `ARCHITECTURE.md` - Technical architecture and design decisions
- `DEVELOPMENT.md` - Development setup and guidelines
- `FREEZE-LIST.md` - List of frozen modules that require special approval to modify

## Quick Start

```bash
npm install
npm run dev
```

## Documentation

All documentation is maintained in the `/apps/admin/docs` folder.

## Status

🚧 **Phase M0.1** - Structure + Freeze (Current)
