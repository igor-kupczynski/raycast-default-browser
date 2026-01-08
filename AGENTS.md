# AGENTS.md

This repository contains a [Raycast](https://raycast.com) extension to manage the default browser on macOS.

## Tech Stack
- **Framework**: React + TypeScript + `@raycast/api`
- **External Dependency**: `defaultbrowser` CLI (forked)
- **Automation**: AppleScript for UI interaction

## Key Files
- `src/list-browsers.tsx`: Main entry point. Lists browsers, handles "Set Default" action.
- `assets/set-default-browser.applescript`: Automates the macOS "Change Default Browser" confirmation dialog.

## Setup & Dependencies
The extension **requires** the `defaultbrowser` CLI tool.
```bash
brew tap igor-kupczynski/homebrew-defaultbrowser-igor-kupczynski
brew install defaultbrowser-igor-kupczynski
```

## Architecture Notes
1.  **CLI Wrapper**: `src/list-browsers.tsx` calls `defaultbrowser` to list installed browsers.
2.  **Dialog Automation**: Changing the default browser triggers a macOS system dialog. We use AppleScript (`assets/set-default-browser.applescript`) to click "Use [Browser]" automatically.
3.  **Permissions**: Raycast requires **Accessibility** permissions for the AppleScript to work.

## Development
- `npm install && npm run dev`
