# Default Browser

This extension lists and allows users to change their default browsers on macOS.

## Prerequisites

This extension requires the `defaultbrowser` CLI tool to be installed on your system. It is recommended to use the version from my fork. You can install it using Homebrew with the following tap:

```bash
brew tap igor-kupczynski/homebrew-defaultbrowser-igor-kupczynski
brew install defaultbrowser-igor-kupczynski
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

If you see an error message about the `defaultbrowser` CLI not being installed, please install it using the commands above to use my forked version.


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