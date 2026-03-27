"""
Crops the whitespace/transparent padding from the NEXGEN wordmark
so CSS can govern all spacing consistently.
"""
from PIL import Image, ImageChops
import urllib.request
import os

url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Transparent%20NEXGEN-F4aq7K4UbfTFE5DKJwFXOKxYLT7DIM.png"
out_path = "/vercel/share/v0-project/public/images/nexgen-wordmark.png"

os.makedirs(os.path.dirname(out_path), exist_ok=True)

# Download
urllib.request.urlretrieve(url, "/tmp/nexgen-wordmark-raw.png")

img = Image.open("/tmp/nexgen-wordmark-raw.png").convert("RGBA")

# Get bounding box of non-white, non-transparent content
r, g, b, a = img.split()

# Create a mask: pixels that are NOT near-white and NOT fully transparent
bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
diff = ImageChops.difference(img.convert("RGB"), bg.convert("RGB"))

# Find bounding box of actual content
bbox = diff.getbbox()
print(f"Original size: {img.size}")
print(f"Content bbox: {bbox}")

if bbox:
    # Add 2px padding for clean edges
    pad = 2
    x1 = max(0, bbox[0] - pad)
    y1 = max(0, bbox[1] - pad)
    x2 = min(img.width, bbox[2] + pad)
    y2 = min(img.height, bbox[3] + pad)
    cropped = img.crop((x1, y1, x2, y2))
    print(f"Cropped size: {cropped.size}")
    cropped.save(out_path, "PNG")
    print(f"Saved to: {out_path}")
else:
    print("No content found — saving original")
    img.save(out_path, "PNG")
