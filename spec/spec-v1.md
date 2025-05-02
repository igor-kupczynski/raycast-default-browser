# Raycast Extension Spec: List and Set Default Browser on macOS (using `defaultbrowser` CLI)

## Overview

Build a **Raycast extension** for macOS with the command `List Browsers`, which:
- **Lists installed browsers** (HTTP handlers) using the `defaultbrowser` CLI tool.
- Lets the user select a browser to set as default (via the CLI tool).
- Provides clear success/failure feedback.

**Important:**  
All browser listing and default browser changes **must use the [`defaultbrowser`](https://github.com/jonasbn/defaultbrowser) command-line tool**.  
Do **not** use direct macOS native APIs, AppleScript, or command-line invocations of browser apps (e.g. `open -a ... --args --make-default-browser`).

---

## User Experience (UX)

1. **Command Name:** `List Browsers`
2. **Flow:**
    - User opens `List Browsers` in Raycast.
    - A list of installed browsers (from `defaultbrowser`) is shown.
        - Current default should be visually marked (icon or accessory).
    - User selects a browser and hits Enter.
    - The extension runs `defaultbrowser ` to set the new default.
        - Success: Show confirmation toast.
        - Failure: Show error toast (with reason).
    - No confirmation dialog needed from the extension (macOS may prompt as required).

---

## Technical Constraints

- **macOS only.**
- **All functionality must depend on the `defaultbrowser` CLI** (not macOS APIs, not AppleScript, not browser command-line flags).
- Extension must be in JavaScript/TypeScript, using the [Raycast API](https://developers.raycast.com/).
- **Do not implement direct Launch Services, Objective-C, or Swift code.**

---

## Implementation Details

### Browser Listing

- Run the CLI tool:  
  ```
defaultbrowser
  ```
- Parse output, e.g.:
  ```
* chrome
  firefox
  safari
  edge
  ```
  - A line starting with `*` indicates the current default.

**Parsing Example (Node/TS):**
```
import { execSync } from "child_process";
export function getBrowsers() {
const result = execSync("defaultbrowser", { encoding: "utf-8" });
return result.split("\n")
.filter(line => !!line.trim())
.map(line => {
const isDefault = line.trim().startsWith("*");
const name = line.replace("*", "").trim();
return { name, isDefault };
});
}
```

---

### Set Default Browser

- Use the CLI tool:
  ```
defaultbrowser
  ```
- `` should match one of the IDs from the list.
- If the selected browser is already default, show an info toast and take no action.

**Execution Example:**
```
import { exec } from "child_process";
export function setDefaultBrowser(name: string): Promise {
return new Promise((resolve, reject) => {
exec(`defaultbrowser ${name}`, (error, stdout, stderr) => {
if (error) {
reject(stderr || stdout || error.message);
} else {
resolve();
}
});
});
}
```

---

### Handling `defaultbrowser` CLI Prerequisite

- **Check for CLI presence:**  
  Try `which defaultbrowser` or attempt execution and catch failure.
- If missing, **show an error toast** instructing the user to install with:
  ```
brew install defaultbrowser
  ```
- Provide this instruction in the README and as an error message.

---

### Raycast UI Integration

- Use Raycast's `List` view.
- Mark the current default browser (icon or accessory).
- On browser selection:
    1. Run `setDefaultBrowser`.
    2. Show toast on success/failure.

**Pseudocode Structure:**
```
import { List, showToast, Toast, ActionPanel, Action } from "@raycast/api";
// ...getBrowsers, setDefaultBrowser as above

export default function Command() {
const browsers = getBrowsers();
// ...loading/async state omitted for brevity

return (

      {browsers.map(b => (
        
               {
                  try {
                    await setDefaultBrowser(b.name);
                    showToast({ style: Toast.Style.Success, title: "Browser changed!" });
                  } catch (e) {
                    showToast({ style: Toast.Style.Failure, title: "Failed", message: String(e) });
                  }
                }}
                disabled={b.isDefault}
              />
            
          }
        />
      ))}

);
}
```

---

## Edge Cases & Error Handling

- **`defaultbrowser` not installed:**  
  Show an error with installation instructions.
- **No browsers detected:**  
  Show a suitable error or empty state.
- **Selection failure:**  
  Show the error from the CLI.
- **macOS confirmation dialogs:**  
  No need to automate or bypass; user handles prompt as required.

---

## Deliverables

- Raycast extension (TypeScript/JS).
- README with requirement to install `defaultbrowser` CLI.
- Code *only* relies on the `defaultbrowser` CLI for all functionality.

---

## References

- [`defaultbrowser` GitHub](https://github.com/jonasbn/defaultbrowser)
- [Raycast API Docs](https://developers.raycast.com/)

---

**Questions? Ask before starting.**