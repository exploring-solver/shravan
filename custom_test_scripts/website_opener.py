from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
import argparse
import sys
import uuid
from browser_manager import BrowserManager

def open_website(url, session_id=None, headless=False):
    """
    Opens a specified website and returns the driver instance.
    
    Args:
        url (str): The URL to open
        session_id (str): Optional session ID for persistent browser
        headless (bool): Whether to run in headless mode
        
    Returns:
        tuple: (success_status, driver_or_error_message, session_id)
    """
    try:
        if session_id:
            # Try to reconnect to existing session
            session_info = BrowserManager.load_session(session_id)
            if session_info:
                driver = webdriver.Remote(command_executor=session_info['executor_url'])
                driver.close()  # Close any existing window
                driver.quit()   # Quit the existing session
        
        # Create new driver
        session_id = session_id or str(uuid.uuid4())
        driver = BrowserManager.create_driver(headless)
        
        # Open the website
        print(f"Opening website: {url}")
        driver.get(url)
        
        # Save the session information
        BrowserManager.save_session(driver, session_id)
        
        return True, driver, session_id
        
    except Exception as e:
        error_msg = f"Error opening website: {str(e)}"
        print(error_msg, file=sys.stderr)
        return False, error_msg, None

def main():
    parser = argparse.ArgumentParser(description='Open a website using Selenium')
    parser.add_argument('--url', type=str, required=True, help='Website URL to open')
    parser.add_argument('--session-id', type=str, help='Session ID for browser persistence')
    parser.add_argument('--headless', action='store_true', help='Run in headless mode')
    parser.add_argument('--keep-open', action='store_true', help='Keep the browser window open')
    
    args = parser.parse_args()
    
    success, result, session_id = open_website(args.url, args.session_id, args.headless)
    if success:
        print(f"Website opened successfully. Session ID: {session_id}")
        if not args.keep_open:
            result.quit()
            BrowserManager.cleanup_session(session_id)
    else:
        print(result, file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()