#!/usr/bin/env osascript

(*
 * Set Default Browser with Automatic Dialog Clicking
 *
 * This script wraps the `defaultbrowser` CLI tool and automatically clicks
 * the macOS confirmation dialog that appears when changing the default browser.
 *
 * Usage: osascript set-default-browser.applescript "BrowserName"
 *
 * Exit codes:
 *   0 = Success
 *   1 = General failure (browser not found, timeout, etc.)
 *   2 = Accessibility permission denied
 *)

on run argv
    -- Validate input
    if (count of argv) < 1 then
        return 1
    end if

    set browserName to item 1 of argv

    -- Execute defaultbrowser command in background
    try
        do shell script "defaultbrowser " & quoted form of browserName
        -- Wait for dialog to appear
        delay 1.5
    on error errMsg
        -- If browser not found or other errors, still try to click dialog in case it appeared
        -- We'll let the dialog click attempt handle any errors
    end try

    -- Try to click the confirmation dialog
    try
        tell application "System Events"
            tell application process "CoreServicesUIAgent"
                tell window 1
                    tell (first button whose name starts with "use")
                        perform action "AXPress"
                    end tell
                end tell
            end tell
        end tell
        return 0 -- Success
    on error errMsg number errNum
        -- Check for accessibility permission denied error
        if errNum is -1728 then
            return 2 -- Accessibility permission denied
        else
            -- If no dialog appeared (browser might already be default), still consider it a success
            -- Check if the defaultbrowser command succeeded
            try
                do shell script "defaultbrowser " & quoted form of browserName & " >/dev/null 2>&1"
                return 0 -- Command succeeded even if no dialog
            on error
                return 1 -- General failure
            end try
        end if
    end try
end run
