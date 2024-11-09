# video_selector.py
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from difflib import get_close_matches
import argparse
import sys

def get_and_click_video(driver, target_title=None):
    """
    Gets video titles and clicks on the best match or first non-ad video.
    
    Args:
        driver: Selenium WebDriver instance
        target_title (str, optional): Specific video title to match
        
    Returns:
        tuple: (success_status, selected_title_or_error)
    """
    try:
        # Wait for video titles to be present
        wait = WebDriverWait(driver, 10)
        video_elements = wait.until(
            EC.presence_of_all_elements_located((By.ID, "video-title"))
        )
        
        # Get video titles and elements, excluding ads
        videos = []
        for element in video_elements:
            title = element.get_attribute("title")
            if title and not _is_ad(title):
                videos.append((title, element))
        
        if not videos:
            return False, "No non-ad videos found"
        
        if target_title:
            # Find best match using difflib
            titles = [title for title, _ in videos]
            matches = get_close_matches(target_title, titles, n=1, cutoff=0.6)
            
            if not matches:
                return False, f"No matching video found for: {target_title}"
            
            # Find and click the matching video
            best_match = matches[0]
            for title, element in videos:
                if title == best_match:
                    element.click()
                    return True, title
        else:
            # Click first non-ad video
            title, element = videos[0]
            element.click()
            return True, title
            
        return False, "No suitable video found"
        
    except Exception as e:
        error_msg = f"Error selecting video: {str(e)}"
        print(error_msg, file=sys.stderr)
        return False, error_msg

def _is_ad(title):
    """Check if a video title appears to be an advertisement."""
    ad_keywords = ['ad', 'advertisement', 'sponsored', 'promotion', '#ad']
    title_lower = title.lower()
    return any(keyword in title_lower for keyword in ad_keywords)

def main():
    parser = argparse.ArgumentParser(description='Select and click a YouTube video')
    parser.add_argument('--title', type=str, help='Specific video title to match')
    
    args = parser.parse_args()
    
    # Note: This script expects an active WebDriver instance
    print("This script is designed to be imported and used with an existing WebDriver instance")
    print("Example usage in Python:")
    print(f"success, result = get_and_click_video(driver, '{args.title if args.title else None}')")

if __name__ == "__main__":
    main()