import sys
import json
import subprocess
import os
from winreg import OpenKey, QueryValueEx, HKEY_LOCAL_MACHINE, HKEY_CURRENT_USER

# Maps app names from the GenAI model to actual system commands or search paths
APP_MAPPINGS = {
    "Chrome": {
        "windows": [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        ],
        "darwin": [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        ],
        "linux": [
            "google-chrome",
            "google-chrome-stable",
        ]
    },
    "Firefox": {
        "windows": [
            r"C:\Program Files\Mozilla Firefox\firefox.exe",
            r"C:\Program Files (x86)\Mozilla Firefox\firefox.exe",
        ],
        "darwin": [
            "/Applications/Firefox.app/Contents/MacOS/firefox",
        ],
        "linux": [
            "firefox",
        ]
    },
    "text_editor": {
        "windows": ["notepad.exe"],
        "darwin": ["open", "-a", "TextEdit"],
        "linux": ["gedit", "nano", "vim"],
    },
    "Spotify": {
        "windows": [
            r"C:\Users\amane\AppData\Roaming\Spotify\Spotify.exe",
            r"C:\Program Files\WindowsApps\SpotifyAB.SpotifyMusic_*\Spotify.exe",
        ],
        "darwin": [
            "/Applications/Spotify.app/Contents/MacOS/Spotify",
        ],
        "linux": [
            "spotify",
        ]
    }
}

def get_chrome_path_from_registry():
    try:
        with OpenKey(HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe") as key:
            return QueryValueEx(key, "")[0]
    except:
        try:
            with OpenKey(HKEY_CURRENT_USER, r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe") as key:
                return QueryValueEx(key, "")[0]
        except:
            return None

def find_executable(app):
    platform = sys.platform
    if platform.startswith('win'):
        platform = 'windows'
    elif platform == 'darwin':
        platform = 'darwin'
    else:
        platform = 'linux'

    # Normalize app name (capitalize first letter to match APP_MAPPINGS keys)
    app = app.capitalize()

    if app not in APP_MAPPINGS:
        return None

    paths = APP_MAPPINGS[app][platform]

    # Special case for Chrome on Windows
    if app == "Chrome" and platform == "windows":
        registry_path = get_chrome_path_from_registry()
        if registry_path:
            paths.insert(0, registry_path)

    # Special case for Spotify on Windows (handle wildcard in path)
    if app == "Spotify" and platform == "windows":
        for path in paths:
            if "*" in path:
                import glob
                expanded_paths = glob.glob(os.path.expandvars(path))
                if expanded_paths:
                    return expanded_paths[0]

    for path in paths:
        expanded_path = os.path.expandvars(path)  # Expand environment variables
        if os.path.exists(expanded_path):
            return expanded_path

    return None

def open_application(app_command, task=None):
    try:
        if isinstance(app_command, list):
            command = app_command + [task] if task else app_command
        else:
            command = [app_command, task] if task else [app_command]
        
        subprocess.Popen(command)
        return f"Opened {' '.join(command)}"
    except Exception as e:
        return f"Error opening {' '.join(command)}: {str(e)}"

def perform_action(app, action, task):
    app_path = find_executable(app)
    if not app_path:
        return f"Application {app} is not found or not supported."

    if action == "open":
        return open_application(app_path, task)
    else:
        return f"Action {action} is not supported for {app}."

def main(command_json):
    try:
        command = json.loads(command_json)
        result = perform_action(command['application'], command['action'], command['task'])
        print(result)
    except json.JSONDecodeError:
        print("Error: Invalid JSON input")
    except KeyError as e:
        print(f"Error: Missing key in JSON: {str(e)}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        print("Error: No command provided")
