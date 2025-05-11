import requests
import re
import os

# Replace with your API key
PEXELS_API_KEY = 'dr3VUyaLfyUrpaETMcnzpPMsQF2oz6JaN4yOmV4TmRr3riLHwdVTE0jd'

# File containing summaries
input_file = "file.txt"

# Directory to save images
output_dir = "images"
os.makedirs(output_dir, exist_ok=True)

# API headers
headers = {
    "Authorization": PEXELS_API_KEY
}

# Function to extract the first sentence from a summary
def extract_first_sentence(text):
    # Use regex to match up to the first period, exclamation, or question mark
    match = re.match(r"^(.*?[\.\?!])", text.strip())
    return match.group(1) if match else None

# Read the input file
with open(input_file, "r", encoding="utf-8") as file:
    content = file.read()

# Split the file content into individual summaries
summaries = content.split("--------------------------------------------------")
image_counter = 1

# Process each summary
for summary in summaries:
    # Extract the first sentence
    match = re.search(r"First Three Sentences of the Summary:\n(.+)", summary)
    if match:
        first_sentence = extract_first_sentence(match.group(1))
        if first_sentence:
            print(f"Processing: {first_sentence}")

            # Query the Pexels API
            url = f"https://api.pexels.com/v1/search?query={first_sentence}&per_page=1"
            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                data = response.json()
                if data['photos']:
                    # Take the first photo
                    photo = data['photos'][0]
                    image_url = photo['src']['original']

                    # Download the image
                    image_response = requests.get(image_url)
                    if image_response.status_code == 200:
                        # Save the image
                        image_path = os.path.join(output_dir, f"image{image_counter}.jpg")
                        with open(image_path, 'wb') as file:
                            file.write(image_response.content)
                        print(f"Image saved as {image_path}")
                        image_counter += 1
                    else:
                        print(f"Failed to download image for: {first_sentence}")
                else:
                    print(f"No images found for: {first_sentence}")
            else:
                print(f"Error fetching image for: {first_sentence}. Status Code: {response.status_code}")

print("All images processed.")
