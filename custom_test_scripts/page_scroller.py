# page_scroller.py
from selenium.webdriver.support.ui import WebDriverWait
import time
import argparse
import sys

def scroll_page(driver, scroll_amount=1000, smooth=True):
    """
    Scrolls the page by a specified amount.
    
    Args:
        driver: Selenium WebDriver instance
        scroll_amount (int): Amount to scroll in pixels
        smooth (bool): Whether to scroll smoothly
        
    Returns:
        bool: True if scroll was successful, False otherwise
    """
    try:
        if smooth:
            # Smooth scroll in smaller increments
            increment = 100
            scrolled = 0
            while scrolled < scroll_amount:
                amount = min(increment, scroll_amount - scrolled)
                driver.execute_script(f"window.scrollBy(0, {amount});")
                scrolled += amount
                time.sleep(0.1)
        else:
            # Instant scroll
            driver.execute_script(f"window.scrollBy(0, {scroll_amount});")
        
        # Wait for any dynamic content to load
        time.sleep(1)
        return True
        
    except Exception as e:
        print(f"Error scrolling page: {str(e)}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description='Scroll a webpage')
    parser.add_argument('--amount', type=int, default=1000, 
                        help='Amount to scroll in pixels')
    parser.add_argument('--smooth', action='store_true', 
                        help='Enable smooth scrolling')
    
    args = parser.parse_args()
    
    # Note: This script expects an active WebDriver instance
    print("This script is designed to be imported and used with an existing WebDriver instance")
    print("Example usage in Python:")
    print(f"scroll_page(driver, {args.amount}, smooth={args.smooth})")

if __name__ == "__main__":
    main()