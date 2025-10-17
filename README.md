# Default Browser

This extension lists and allows users to change their default browsers on macOS.

## Prerequisites

This extension requires the `defaultbrowser` CLI tool to be installed on your system. It is recommended to use the version from my fork. You can install it using Homebrew with the following tap:

```bash
brew tap igor-kupczynski/homebrew-defaultbrowser-igor-kupczynski
brew install defaultbrowser-igor-kupczynski
```

## Setup Instructions

### First-Time Setup

This extension uses AppleScript automation to automatically click the default browser confirmation dialog. To enable this automation, Raycast needs accessibility permissions:

1. Open **System Settings**
2. Navigate to **Privacy & Security** > **Accessibility**
3. Find **Raycast** in the list and enable it
4. If Raycast is not in the list, click the **+** button and add it from your Applications folder
5. You may need to restart Raycast after granting permission

### Why is this permission needed?

When you change your default browser, macOS displays a security confirmation dialog. This extension uses AppleScript to automatically click the confirmation button, eliminating the need for manual interaction. Raycast needs accessibility permission to interact with UI elements.

## Features

- Lists all installed browsers on your macOS system
- Shows which browser is currently set as default
- Allows you to change your default browser with a single click
- Automatically clicks the confirmation dialog (no manual interaction needed after setup)
- Provides clear feedback on success or failure

## How to Use

1. Open Raycast
2. Search for "List Browsers"
3. Select a browser from the list to set it as your default
4. The extension automatically clicks the confirmation dialog for you
5. Your default browser is now changed

## Troubleshooting

### Error: "Accessibility Permission Required"

This error appears when Raycast doesn't have accessibility permission. Follow the setup instructions above to grant permission:

1. Open **System Settings**
2. Go to **Privacy & Security** > **Accessibility**
3. Enable **Raycast**
4. Restart Raycast

If Raycast is already in the list but still shows this error, try:
- Removing Raycast from the Accessibility list and adding it again
- Restarting your Mac

### Error: "defaultbrowser CLI not installed"

Install the `defaultbrowser` CLI tool using:

```bash
brew tap igor-kupczynski/homebrew-defaultbrowser-igor-kupczynski
brew install defaultbrowser-igor-kupczynski
```

### Dialog appears but doesn't get clicked

If the confirmation dialog still appears and isn't automatically clicked:

1. Verify that Raycast has accessibility permission (see setup instructions)
2. Try clicking the dialog manually this time
3. Restart Raycast and try again
4. Check System Settings > Privacy & Security > Accessibility to confirm Raycast is enabled

### Browser not recognized

Ensure the browser is actually installed on your system. The extension lists all browsers that the `defaultbrowser` CLI can detect. If your browser doesn't appear in the list, it may not be installed or may not be recognized by the system.


## Development

```sh
npm install && npm run dev
```

## Differences from Upstream

This extension recommends using a forked version of the `defaultbrowser` CLI tool.

- **Upstream:** [kerma/defaultbrowser 1.1](https://github.com/kerma/defaultbrowser/releases/tag/1.1)
- **Fork:** [igor-kupczynski/defaultbrowser 1.2.1](https://github.com/igor-kupczynski/defaultbrowser/releases/tag/1.2.1)

**Key differences:**
- Fixed a bug where `*` was not present with the default browser name ([PR #26](https://github.com/kerma/defaultbrowser/pull/26))

[View full diff on GitHub](https://github.com/igor-kupczynski/defaultbrowser/compare/kerma:1.1...1.2.1)