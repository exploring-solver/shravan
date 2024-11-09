import pickle
import os
from selenium import webdriver
from selenium.webdriver.remote.webdriver import WebDriver
import argparse
import sys
import tempfile

class WebDriverManager:
    """
    Manages WebDriver sessions between multiple scripts.
    Handles saving and loading WebDriver state using temporary files.
    """
    
    _TEMP_DIR = tempfile.gettempdir()
    _SESSION_FILE = os.path.join(_TEMP_DIR, 'webdriver_session.pkl')
    
    @classmethod
    def save_driver_session(cls, driver):
        """
        Saves the WebDriver session information to a temporary file.
        
        Args:
            driver: Selenium WebDriver instance
            
        Returns:
            str: Path to the session file
        """
        session = {
            'command_executor_url': driver.command_executor._url,
            'session_id': driver.session_id
        }
        
        with open(cls._SESSION_FILE, 'wb') as f:
            pickle.dump(session, f)
        
        return cls._SESSION_FILE
    
    @classmethod
    def load_driver_session(cls):
        """
        Loads a saved WebDriver session.
        
        Returns:
            WebDriver: Restored WebDriver instance or None if failed
        """
        try:
            if not os.path.exists(cls._SESSION_FILE):
                print("No saved session found", file=sys.stderr)
                return None
                
            with open(cls._SESSION_FILE, 'rb') as f:
                session = pickle.load(f)
                
            # Create a new driver instance
            driver = webdriver.Remote(
                command_executor=session['command_executor_url'],
                options=webdriver.ChromeOptions()
            )
            
            # Attach to the existing browser session
            driver.session_id = session['session_id']
            
            # Verify the session is still valid
            try:
                driver.current_url
                return driver
            except:
                print("Saved session is no longer valid", file=sys.stderr)
                cls.cleanup_session()
                return None
                
        except Exception as e:
            print(f"Error loading driver session: {str(e)}", file=sys.stderr)
            return None
    
    @classmethod
    def cleanup_session(cls):
        """Removes the temporary session file."""
        try:
            if os.path.exists(cls._SESSION_FILE):
                os.remove(cls._SESSION_FILE)
        except Exception as e:
            print(f"Error cleaning up session file: {str(e)}", file=sys.stderr)

def get_driver_from_args(parser):
    """
    Adds WebDriver session arguments to an ArgumentParser and returns the driver.
    
    Args:
        parser: argparse.ArgumentParser instance
        
    Returns:
        tuple: (WebDriver instance or None, modified ArgumentParser)
    """
    parser.add_argument('--session-file', type=str,
                      help='Path to saved WebDriver session file')
    
    args, remaining_args = parser.parse_known_args()
    
    driver = None
    if hasattr(args, 'session_file') and args.session_file:
        driver = WebDriverManager.load_driver_session()
    
    return driver, parser