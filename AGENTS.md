# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) and other agents when working with code in this repository.

## Project Overview

**raycast-default-browser** is a Raycast extension for macOS that lists installed browsers and allows users to change their default browser through the Raycast launcher. It's a productivity tool with a simple, focused interface.

## Technology Stack

- **Framework**: Raycast extension using React + TypeScript
- **Runtime Dependencies**: `@raycast/api` (^1.97.0), `@raycast/utils` (^1.17.0)
- **External CLI**: `defaultbrowser` (forked version ^1.2.1) - required for all browser operations
- **Build System**: Raycast CLI (`ray`)
- **Code Quality**: TypeScript (strict mode), ESLint (Raycast config), Prettier (120px width)

## Architecture

**Single-Command Extension Structure:**

The extension has one command entry point: `list-browsers` (view mode)

**Main Component** (`src/list-browsers.tsx`):
- React component that renders a Raycast `List` with installed browsers
- Uses `usePromise()` hook for async browser fetching
- Displays default browser with CheckCircle icon + Star accessory
- Conditional action panel: only shows "Set as Default" for non-default browsers
- Provides toast notifications for all user operations

**Key Functions:**
- `isDefaultBrowserInstalled()`: Validates CLI availability with three fallback approaches (direct paths, `which` command, direct execution)
- `getBrowsers()`: Parses CLI output (default browser marked with `*` prefix)
- `setDefaultBrowser()`: Async function to change default browser via CLI
- `handleSetDefaultBrowser()`: Click handler with loading/success/error toast feedback

**Critical Design Pattern:**
- `COMMON_EXEC_OPTIONS` centralized config for all child process calls includes:
  - Custom PATH: `/opt/homebrew/bin:/usr/local/bin:/usr/bin` (Homebrew compatibility)
  - 5-second timeout
  - Increased maxBuffer for large outputs

## Common Commands

```bash
npm run dev              # Start development mode
npm run build           # Build extension for distribution
npm run lint            # Run ESLint checks
npm run fix-lint        # Auto-fix ESLint issues
npm run publish         # Publish to Raycast Store
```

**Setup:**
```bash
npm install && npm run dev
```

## File Structure

| File | Purpose |
|------|---------|
| `src/list-browsers.tsx` | Main React component - UI, state, browser operations |
| `package.json` | Extension metadata, commands, dependencies |
| `tsconfig.json` | TypeScript config (ES2023, CommonJS, strict mode) |
| `eslint.config.js` | ESLint rules (Raycast config, FlatConfig format) |
| `.prettierrc` | Prettier config (120px width, double quotes) |
| `README.md` | User documentation and installation guide |
| `assets/` | Extension icons/images |

## Important Notes

**External Dependency:**
- The extension depends on the `defaultbrowser` CLI tool being installed on the user's system
- Uses a forked version to fix CLI output formatting issues
- Gracefully handles missing CLI with validation checks and user-friendly error messages

**Error Handling:**
- Multiple validation layers ensure robustness across different macOS setups
- Conservative approach with three fallback methods to locate the CLI tool
- All operations provide user feedback via toast notifications

**Development Setup:**
- The extension uses Raycast's development mode which hot-reloads changes
- Ensure `defaultbrowser` CLI is installed: `brew install igor-kupczynski/default-browser/defaultbrowser`
