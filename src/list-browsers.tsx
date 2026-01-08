import { ActionPanel, Action, Icon, List, showToast, Toast, environment, Detail } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { execSync, exec, ExecSyncOptions } from "child_process";
import { useCallback } from "react";
import path from "path";

interface Browser {
  name: string;
  isDefault: boolean;
}

// Common options for all exec/execSync calls
const COMMON_EXEC_OPTIONS = {
  env: { ...process.env, PATH: `${process.env.PATH}:/opt/homebrew/bin:/usr/local/bin:/usr/bin` },
  timeout: 10000, // 10 second timeout (increased for dialog interaction)
  maxBuffer: 1024 * 1024 // Increase buffer size
};

// Check if defaultbrowser CLI is installed
function isDefaultBrowserInstalled(): boolean {
  // Exec options with encoding for this function
  const execOptions: ExecSyncOptions = {
    ...COMMON_EXEC_OPTIONS,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"]
  };

  // Try common installation paths
  const commonPaths = [
    "/opt/homebrew/bin/defaultbrowser",
    "/usr/local/bin/defaultbrowser",
    "/usr/bin/defaultbrowser"
  ];

  // First check if we can find it in common paths
  for (const path of commonPaths) {
    try {
      execSync(`test -f ${path}`, execOptions);
      return true;
    } catch {
      // Continue to next path
    }
  }

  // Then try which command
  try {
    execSync("which defaultbrowser", execOptions);
    return true;
  } catch {
    // Continue to next method
  }

  // Finally try running the command directly
  try {
    execSync("defaultbrowser --help", { ...execOptions, stdio: "ignore" });
    return true;
  } catch (error) {
    console.error("defaultbrowser CLI not found:", error);
    return false;
  }
}

// Get list of browsers using defaultbrowser CLI
function getBrowsers(): Browser[] {
  try {
    // Use common exec options with encoding
    const result = execSync("defaultbrowser", {
      ...COMMON_EXEC_OPTIONS,
      encoding: "utf-8"
    });

    // Check if we got a valid result
    if (!result || !result.trim()) {
      throw new Error("Empty response from defaultbrowser CLI");
    }

    const browsers = result
      .split("\n")
      .filter((line) => !!line.trim())
      .map((line) => {
        const isDefault = line.trim().startsWith("*");
        const name = line.replace("*", "").trim();
        return { name, isDefault };
      });

    // Check if we parsed any browsers
    if (!browsers || browsers.length === 0) {
      throw new Error("No browsers found in defaultbrowser CLI output");
    }

    return browsers;
  } catch (error) {
    console.error("Error getting browsers list:", error);
    throw new Error(`Failed to get browsers list: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Set default browser using AppleScript wrapper that clicks the confirmation dialog
function setDefaultBrowser(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(environment.assetsPath, "set-default-browser.applescript");
    const command = `osascript "${scriptPath}" "${name}"`;

    exec(command, COMMON_EXEC_OPTIONS, (error, stdout, stderr) => {
      if (error) {
        console.error("Error setting default browser:", error);

        // Check for accessibility permission error (exit code 2)
        if (error.code === 2 || stderr.includes("-1728")) {
          reject("Accessibility permission required. Please grant Raycast access in System Settings > Privacy & Security > Accessibility");
        } else {
          reject(stderr || stdout || error.message);
        }
      } else {
        resolve();
      }
    });
  });
}

export default function Command() {
  const { data: browsers, isLoading, revalidate, error } = usePromise(
    async () => {
      if (!isDefaultBrowserInstalled()) {
        throw new MissingCLIError();
      }
      return getBrowsers();
    },
    []
  );

  // Show generic error toast if there's an error (not missing CLI)
  useCallback(async () => {
    if (error && !(error instanceof MissingCLIError)) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error loading browsers",
        message: String(error),
      });
    }
  }, [error])();

  // Specific UI for missing CLI
  if (error instanceof MissingCLIError) {
    const markdown = `
# Missing Dependency

This extension requires the **defaultbrowser** CLI tool to be installed.

Please run the following commands in your terminal to install it:

\`\`\`bash
brew tap igor-kupczynski/homebrew-defaultbrowser-igor-kupczynski
brew install defaultbrowser-igor-kupczynski
\`\`\`
    `;

    return (
      <Detail
        markdown={markdown}
        actions={
          <ActionPanel>
            <Action.CopyToClipboard
              title="Copy Install Commands"
              content="brew tap igor-kupczynski/homebrew-defaultbrowser-igor-kupczynski && brew install defaultbrowser-igor-kupczynski"
            />
          </ActionPanel>
        }
      />
    );
  }

  const handleSetDefaultBrowser = useCallback(
    async (browser: Browser) => {
      if (browser.isDefault) {
        await showToast({
          style: Toast.Style.Success,
          title: `${browser.name} is already the default browser`,
        });
        return;
      }

      try {
        await showToast({
          style: Toast.Style.Animated,
          title: `Setting ${browser.name} as default browser...`,
        });

        await setDefaultBrowser(browser.name);

        await showToast({
          style: Toast.Style.Success,
          title: `${browser.name} is now your default browser`,
        });

        // Refresh the list to show updated default browser
        revalidate();
      } catch (error) {
        const errorMessage = String(error);

        // Check for specific error types
        if (errorMessage.includes("Accessibility permission")) {
          await showToast({
            style: Toast.Style.Failure,
            title: "Accessibility Permission Required",
            message: "Open System Settings > Privacy & Security > Accessibility and enable Raycast",
          });
        } else {
          await showToast({
            style: Toast.Style.Failure,
            title: "Failed to set default browser",
            message: errorMessage,
          });
        }
      }
    },
    [revalidate]
  );

  return (
    <List isLoading={isLoading}>
      {browsers?.map((browser) => (
        <List.Item
          key={browser.name}
          icon={browser.isDefault ? Icon.CheckCircle : Icon.Globe}
          title={browser.name}
          accessories={browser.isDefault ? [{ icon: Icon.Star, text: "Default" }] : []}
          actions={
            <ActionPanel>
              {!browser.isDefault && (
                <Action
                  title={`Set ${browser.name} as Default Browser`}
                  onAction={() => handleSetDefaultBrowser(browser)}
                  icon={Icon.Globe}
                />
              )}
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

class MissingCLIError extends Error {
  constructor() {
    super("Missing defaultbrowser CLI");
    this.name = "MissingCLIError";
  }
}

