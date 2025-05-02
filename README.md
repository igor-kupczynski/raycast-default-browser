# Default Browser

This extension lists and allows users to change their default browsers on macOS.

## Prerequisites

This extension requires the `defaultbrowser` CLI tool to be installed on your system. You can install it using Homebrew:

```bash
brew install defaultbrowser
```

## Features

- Lists all installed browsers on your macOS system
- Shows which browser is currently set as default
- Allows you to change your default browser with a single click
- Provides clear feedback on success or failure

## How to Use

1. Open Raycast
2. Search for "List Browsers"
3. Select a browser from the list to set it as your default
4. macOS may prompt you to confirm the change

## Troubleshooting

If you see an error message about the `defaultbrowser` CLI not being installed, please install it using the command above.


## Development

```sh
npm install && npm run dev
```