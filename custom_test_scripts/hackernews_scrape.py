import requests
from bs4 import BeautifulSoup

def fetch_hackernews_titles():
    url = "https://news.ycombinator.com/"
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all titles on the Hacker News homepage
        titles = soup.find_all("span", class_="titleline")

        # Print each title
        for i, title in enumerate(titles, start=1):
            print(f"{i}. {title.text.strip()}")

    else:
        print(f"Failed to retrieve page with status code: {response.status_code}")

# Example usage
fetch_hackernews_titles()
