import os
import sys
import pickle
from typing import Dict, Any, Optional
from selenium import webdriver
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import tempfile
from pathlib import Path
import importlib.util
import subprocess
class ScriptManager:
    def __init__(self, scripts_directory: str):
        self.scripts_directory = Path(scripts_directory)
        self.session_file = self.scripts_directory / 'webdriver_session.pkl'
        self._driver = None

    def get_driver(self) -> Optional[WebDriver]:
        """Gets an existing WebDriver instance or creates a new one."""
        if self._driver is not None:
            try:
                self._driver.current_url
                return self._driver
            except:
                self._driver = None

        # Create new driver with specific options
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--start-maximized")
        chrome_options.add_argument("--disable-gpu")  # Helps prevent GPU errors
        chrome_options.add_experimental_option("detach", True)  # Keeps browser open
        chrome_options.add_experimental_option("excludeSwitches", ["enable-logging"])  # Reduces console noise
        
        try:
            service = Service(ChromeDriverManager().install())
            self._driver = webdriver.Chrome(service=service, options=chrome_options)
            return self._driver
        except Exception as e:
            print(f"Error creating new driver: {str(e)}", file=sys.stderr)
            return None

    def save_driver_session(self, driver: WebDriver) -> None:
        """Saves the WebDriver session information."""
        # We don't need to save the session anymore since we're using detach
        self._driver = driver

    def cleanup_session(self) -> None:
        """Cleans up the session file and reference."""
        try:
            if self.session_file.exists():
                self.session_file.unlink()
            if self._driver is not None:
                try:
                    self._driver.quit()
                except:
                    pass
            self._driver = None
        except Exception as e:
            print(f"Error cleaning up session: {str(e)}", file=sys.stderr)

    def perform_script(self, script_path: str, args: list, parameters: Dict[str, Any]) -> str:
        """Executes a script with WebDriver session handling or directly using subprocess."""
        try:
            # Convert script_path to absolute path if it's relative
            if not os.path.isabs(script_path):
                script_path = os.path.join(str(self.scripts_directory), script_path)
            
            if not script_path.endswith('.py'):
                script_path += '.py'
            
            script_path = Path(script_path)
            if not script_path.exists():
                return f"Error: Script file not found at {script_path}"

            # Import the module using importlib to check for specific functions
            spec = importlib.util.spec_from_file_location(
                script_path.stem,
                str(script_path)
            )
            if spec is None or spec.loader is None:
                return f"Error: Could not load script specification from {script_path}"
                
            script_module = importlib.util.module_from_spec(spec)
            sys.modules[script_path.stem] = script_module
            spec.loader.exec_module(script_module)
            
            # Check for specific functions: create_instance or run
            if hasattr(script_module, 'create_instance'):
                # Use create_instance if defined
                script_instance = script_module.create_instance()
                driver = self.get_driver()
                if driver is None:
                    return "Error: Could not create or get WebDriver instance"
                parameters['driver'] = driver
                result = script_instance.execute(args, parameters) if hasattr(script_instance, 'execute') else "Error: No execute method"
            elif hasattr(script_module, 'run') and callable(script_module.run):
                # Use run method if defined
                result = script_module.run(args, parameters)
            else:
                # No WebDriver needed, run script directly via subprocess
                result = subprocess.run(
                    ['python', str(script_path)] + args,
                    text=True,
                    capture_output=True
                )
                # Capture output or error
                result = result.stdout if result.returncode == 0 else result.stderr

            return result

        except Exception as e:
            return f"Error executing script: {str(e)}"
        finally:
            if script_path.stem in sys.modules:
                del sys.modules[script_path.stem]


# Singleton instance
script_manager = None

def init_script_manager(scripts_directory: str) -> ScriptManager:
    """Initializes the script manager singleton."""
    global script_manager
    if script_manager is None:
        script_manager = ScriptManager(scripts_directory)
    return script_manager

def get_script_manager() -> ScriptManager:
    """Gets the script manager instance."""
    if script_manager is None:
        raise RuntimeError("Script manager not initialized")
    return script_manager