import os
import jwt
import json
import sys
from typing import Optional, Dict, List, Any
from .script_manager import init_script_manager, get_script_manager
from pathlib import Path

TOKEN_FILE = os.path.expanduser("~/.shravan_token")
JWT_SECRET = 'shravan'
CONFIG_FILE = os.path.expanduser("~/.shravan_config.json")

# Updated DEFAULT_APP_CONFIGS to include scripts configuration
DEFAULT_APP_CONFIGS = {
    "windows": {
        "chrome": [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        ],
        "firefox": [
            r"C:\Program Files\Mozilla Firefox\firefox.exe",
            r"C:\Program Files (x86)\Mozilla Firefox\firefox.exe",
        ],
        "notepad": ["notepad.exe"],
    },
    "darwin": {
        "chrome": ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"],
        "firefox": ["/Applications/Firefox.app/Contents/MacOS/firefox"],
        "text_editor": ["open", "-a", "TextEdit"],
    },
    "linux": {
        "chrome": ["google-chrome", "google-chrome-stable"],
        "firefox": ["firefox"],
        "text_editor": ["gedit", "nano", "vim"],
    },
    "scripts_directory": "scripts",  # Default scripts directory
    "custom_scripts": {}  # Storage for custom scripts
}

def get_platform() -> str:
    platforms = {
        'linux': 'linux',
        'win32': 'windows',
        'darwin': 'darwin'
    }
    return platforms.get(sys.platform, 'unknown')

def load_app_configs() -> dict:
    """Load application configurations from config file."""
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r') as f:
                configs = json.load(f)
                # Ensure all default keys exist
                for key in DEFAULT_APP_CONFIGS:
                    if key not in configs:
                        configs[key] = DEFAULT_APP_CONFIGS[key]
                return configs
        return DEFAULT_APP_CONFIGS.copy()
    except Exception as e:
        print(f"Error loading config: {e}")
        return DEFAULT_APP_CONFIGS.copy()

def save_app_configs(app_configs: dict):
    """Save application configurations to config file."""
    try:
        os.makedirs(os.path.dirname(CONFIG_FILE), exist_ok=True)
        with open(CONFIG_FILE, 'w') as f:
            json.dump(app_configs, f, indent=4)
    except Exception as e:
        print(f"Error saving config: {e}")

def get_custom_scripts() -> Dict[str, str]:
    """
    Gets the dictionary of custom scripts from configuration.
    Returns a dictionary with script names as keys and file paths as values.
    """
    app_configs = load_app_configs()
    scripts_dir = Path(app_configs.get('scripts_directory', 'scripts'))
    
    if not scripts_dir.is_absolute():
        # Make path absolute relative to config file directory
        config_dir = Path(CONFIG_FILE).parent
        scripts_dir = config_dir / scripts_dir

    custom_scripts = {}
    
    # Ensure directory exists
    if scripts_dir.exists() and scripts_dir.is_dir():
        # Find all Python files in the scripts directory
        for script_file in scripts_dir.glob('*.py'):
            # Use the filename without extension as the script name
            script_name = script_file.stem.lower()
            custom_scripts[script_name] = str(script_file)
    
    # Merge with configured custom scripts
    custom_scripts.update(app_configs.get('custom_scripts', {}))
    
    return custom_scripts

def ensure_script_manager() -> None:
    """
    Ensures the script manager is initialized with the correct directory.
    """
    try:
        # Try to get existing script manager
        script_manager = get_script_manager()
    except RuntimeError:
        # Initialize if not exists
        app_configs = load_app_configs()
        scripts_dir = Path(app_configs.get('scripts_directory', 'scripts'))
        
        if not scripts_dir.is_absolute():
            config_dir = Path(CONFIG_FILE).parent
            scripts_dir = config_dir / scripts_dir
        
        # Create scripts directory if it doesn't exist
        scripts_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize script manager
        init_script_manager(str(scripts_dir))

def add_custom_script(name: str, path: str) -> bool:
    """Add a custom script to the configuration."""
    try:
        app_configs = load_app_configs()
        app_configs['custom_scripts'][name] = path
        save_app_configs(app_configs)
        return True
    except Exception as e:
        print(f"Error adding custom script: {e}")
        return False

def remove_custom_script(name: str) -> bool:
    """Remove a custom script from the configuration."""
    try:
        app_configs = load_app_configs()
        if name in app_configs['custom_scripts']:
            del app_configs['custom_scripts'][name]
            save_app_configs(app_configs)
            return True
        return False
    except Exception as e:
        print(f"Error removing custom script: {e}")
        return False

def update_custom_script(name: str, new_path: str) -> bool:
    """Update a custom script path in the configuration."""
    try:
        app_configs = load_app_configs()
        if name in app_configs['custom_scripts']:
            app_configs['custom_scripts'][name] = new_path
            save_app_configs(app_configs)
            return True
        return False
    except Exception as e:
        print(f"Error updating custom script: {e}")
        return False

def set_scripts_directory(directory: str) -> bool:
    """Set the scripts directory in the configuration."""
    try:
        app_configs = load_app_configs()
        app_configs['scripts_directory'] = str(directory)
        save_app_configs(app_configs)
        return True
    except Exception as e:
        print(f"Error setting scripts directory: {e}")
        return False

# Token management functions
def save_token(token):
    """Save the token to a file."""
    try:
        os.makedirs(os.path.dirname(TOKEN_FILE), exist_ok=True)
        with open(TOKEN_FILE, 'w') as f:
            f.write(token)
    except Exception as e:
        print(f"Error saving token: {e}")

def load_token():
    """Load the saved token from a file."""
    try:
        if os.path.exists(TOKEN_FILE):
            with open(TOKEN_FILE, 'r') as f:
                return f.read().strip()
    except Exception as e:
        print(f"Error loading token: {e}")
    return None

def load_email():
    """Extract email from the saved token."""
    token = load_token()
    if not token:
        print("No token found. Please run 'shravan login' to authenticate.")
        return None

    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = decoded_token.get('email')
        return email if email else None
    except jwt.ExpiredSignatureError:
        print("Token has expired. Please log in again.")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token. Please log in again.")
        return None

# Application path management functions remain unchanged
def add_app_path(platform: str, app_name: str, path: str) -> bool:
    """Add an application path to the configuration."""
    try:
        app_configs = load_app_configs()
        if platform not in app_configs:
            app_configs[platform] = {}
        if app_name not in app_configs[platform]:
            app_configs[platform][app_name] = []
        if path not in app_configs[platform][app_name]:
            app_configs[platform][app_name].append(path)
            save_app_configs(app_configs)
        return True
    except Exception as e:
        print(f"Error adding app path: {e}")
        return False

def remove_app_path(platform: str, app_name: str, path: str) -> bool:
    """Remove an application path from the configuration."""
    try:
        app_configs = load_app_configs()
        if platform in app_configs and app_name in app_configs[platform]:
            if path in app_configs[platform][app_name]:
                app_configs[platform][app_name].remove(path)
                if not app_configs[platform][app_name]:
                    del app_configs[platform][app_name]
                save_app_configs(app_configs)
                return True
        return False
    except Exception as e:
        print(f"Error removing app path: {e}")
        return False

def update_app_path(platform: str, app_name: str, old_path: str, new_path: str) -> bool:
    """Update an application path in the configuration."""
    try:
        app_configs = load_app_configs()
        if platform in app_configs and app_name in app_configs[platform]:
            if old_path in app_configs[platform][app_name]:
                idx = app_configs[platform][app_name].index(old_path)
                app_configs[platform][app_name][idx] = new_path
                save_app_configs(app_configs)
                return True
        return False
    except Exception as e:
        print(f"Error updating app path: {e}")
        return False

def get_app_paths(platform: str, app_name: str) -> List[str]:
    """Get all paths for a specific application."""
    try:
        app_configs = load_app_configs()
        return app_configs.get(platform, {}).get(app_name, [])
    except Exception as e:
        print(f"Error getting app paths: {e}")
        return []