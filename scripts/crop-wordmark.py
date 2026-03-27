#!/usr/bin/env python3
"""Crop whitespace from NEXGEN wordmark image"""

import urllib.request
from PIL import Image
import io
import os

# Ensure output directory exists
os.makedirs("public/images", exist_ok=True)

# Download the original image from blob URL
url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Transparent%20NEXGEN-F4aq7K4UbfTFE5DKJwFXOKxYLT7DIM.png"
output_path = "public/images/nexgen-wordmark.png"

try:
    print("[v0] Downloading original image from blob...")
    with urllib.request.urlopen(url) as response:
        img_data = response.read()
    
    # Open image from bytes
    img = Image.open(io.BytesIO(img_data))
    print(f"[v0] Original image size: {img.size}")
    
    # Convert to RGBA if needed for transparency handling
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get the bounding box of the non-transparent content
    bbox = img.getbbox()
    
    if bbox is None:
        print("[v0] Error: Image is completely transparent")
        exit(1)
    
    # Crop with minimal margin (5 pixels top/bottom)
    margin = 5
    left = max(0, bbox[0] - margin)
    top = max(0, bbox[1] - margin)
    right = min(img.width, bbox[2] + margin)
    bottom = min(img.height, bbox[3] + margin)
    
    cropped = img.crop((left, top, right, bottom))
    
    # Save the cropped image
    cropped.save(output_path, 'PNG', optimize=True)
    
    print(f"[v0] Successfully cropped image")
    print(f"[v0] Original size: {img.size}")
    print(f"[v0] Cropped size: {cropped.size}")
    print(f"[v0] Saved to: {output_path}")
    
except Exception as e:
    print(f"[v0] Error: {e}")
    exit(1)
