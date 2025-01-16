import requests
from bs4 import BeautifulSoup

url = 'https://pulse.zerodha.com/'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Find all the article items
articles = soup.find_all('li', class_='box item')

for article in articles:
    # Extract the title
    title = article.find('h2', class_='title').get_text(strip=True)
    
    # Extract the link
    link = article.find('h2', class_='title').find('a')['href']
    
    # Extract the summary if available
    summary = article.find('div', class_='desc').get_text(strip=True) if article.find('div', class_='desc') else "No summary available"
    
    # Print the extracted information
    print(f"Title: {title}")
    print(f"Summary: {summary}")
    print(f"Link: {link}")
    print('-' * 80)
