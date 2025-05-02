import { ActionPanel, Action, Icon, List, showToast, Toast } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { execSync, exec, ExecSyncOptions, ExecOptions } from "child_process";
import { useCallback } from "react";

interface Browser {
  name: string;
  isDefault: boolean;
}

// Common options for all exec/execSync calls
const COMMON_EXEC_OPTIONS = {
  env: { ...process.env, PATH: `${process.env.PATH}:/opt/homebrew/bin:/usr/local/bin:/usr/bin` },
  timeout: 5000, // 5 second timeout
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
    } catch (error) {
      // Continue to next path
    }
  }

  // Then try which command
  try {
    execSync("which defaultbrowser", execOptions);
    return true;
  } catch (error) {
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

// Set default browser using defaultbrowser CLI
function setDefaultBrowser(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Use common exec options
    exec(`defaultbrowser ${name}`, COMMON_EXEC_OPTIONS, (error, stdout, stderr) => {
      if (error) {
        console.error("Error setting default browser:", error);
        reject(stderr || stdout || error.message);
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
        throw new Error("defaultbrowser CLI is not installed. Install it with: brew install defaultbrowser");
      }
      return getBrowsers();
    },
    []
  );

  // Show error toast if there's an error
  useCallback(async () => {
    if (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error loading browsers",
        message: String(error),
      });
    }
  }, [error])();

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
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to set default browser",
          message: String(error),
        });
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
