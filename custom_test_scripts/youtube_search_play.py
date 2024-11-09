from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import argparse

class YouTubeSearchScript:
    def __init__(self):
        self.base_url = "https://www.youtube.com"

def create_instance():
    return YouTubeSearchScript()

def execute(self, args, parameters):
    """Execute the YouTube search and open second result"""
    try:
        # Parse arguments
        parser = argparse.ArgumentParser()
        parser.add_argument('--query', '--search_query', dest='query',
                          type=str, required=True, help='Search term')
        
        # Handle the case where args might be a string instead of a list
        if isinstance(args, str):
            args = [args]
        
        # Convert args list to the right format if needed
        formatted_args = []
        i = 0
        while i < len(args):
            if args[i].startswith('--'):
                formatted_args.append(args[i])
                if i + 1 < len(args):
                    formatted_args.append(args[i + 1])
                i += 2
            else:
                formatted_args.append(args[i])
                i += 1

        try:
            parsed_args = parser.parse_args(formatted_args)
        except SystemExit:
            # If parsing fails, try to extract the search query directly
            search_term = None
            for i, arg in enumerate(args):
                if arg in ['--query', '--search_query'] and i + 1 < len(args):
                    search_term = args[i + 1]
                    break
            if search_term is None:
                return "Error: Search query not provided properly"
        else:
            search_term = parsed_args.query

        driver = parameters.get('driver')
        if not driver:
            return "Error: WebDriver not provided"
        
        # Navigate to YouTube
        driver.get(self.base_url)
        
        # Wait for and find the search box
        search_box = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "search_query"))
        )
        
        # Clear any existing text and enter search term
        search_box.clear()
        search_box.send_keys(search_term)
        search_box.send_keys(Keys.RETURN)
        
        # Wait for search results to load with a longer timeout
        video_results = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "ytd-video-renderer"))
        )
        
        if len(video_results) < 2:
            return "Error: Not enough search results found"
            
        # Get the second video result and its link
        second_video = video_results[0]
        video_link = second_video.find_element(By.CSS_SELECTOR, "a#video-title")
        video_title = video_link.get_attribute("title")
        video_url = video_link.get_attribute("href")
        
        # Navigate to the video
        driver.get(video_url)
        
        # Wait for the video player to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "video.html5-main-video"))
        )
        
        return f"Successfully opened video: {video_title}"
        
    except TimeoutException:
        return "Error: Timeout waiting for page elements to load"
    except Exception as e:
        return f"Error during execution: {str(e)}"

YouTubeSearchScript.execute = execute