# website_searcher.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import argparse
import sys

def perform_search(driver, search_query, input_name="search_query", input_type="name"):
    """
    Performs a search on the current webpage.
    """
    try:
        selector_map = {
            'name': By.NAME,
            'id': By.ID,
            'class': By.CLASS_NAME
        }
        selector = selector_map.get(input_type.lower(), By.NAME)
        
        wait = WebDriverWait(driver, 10)
        search_box = wait.until(
            EC.presence_of_element_located((selector, input_name))
        )
        
        print(f"Searching for: {search_query}")
        search_box.clear()
        search_box.send_keys(search_query)
        search_box.send_keys(Keys.RETURN)
        
        return True
        
    except Exception as e:
        print(f"Error performing search: {str(e)}", file=sys.stderr)
        return False

def main(parameters):
    """
    Main function that will be called by the script manager.
    
    Args:
        parameters: Dict containing the driver and other parameters
    """
    driver = parameters.get('driver')
    if not driver:
        return "Error: No WebDriver instance provided"
    
    search_query = parameters.get('search_query')
    if not search_query:
        return "Error: No search query provided"
    
    input_name = parameters.get('input_name', 'search_query')
    input_type = parameters.get('input_type', 'name')
    
    success = perform_search(driver, search_query, input_name, input_type)
    return "Search completed successfully" if success else "Search failed"

if __name__ == "__main__":
    print("This script is designed to be run through the automation client")