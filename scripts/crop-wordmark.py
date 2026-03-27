#!/usr/bin/env python3
"""Crop whitespace from NEXGEN wordmark image"""

from PIL import Image
import os

# Load the original image
input_path = "public/images/nexgen-wordmark.png"
output_path = "public/images/nexgen-wordmark.png"

if not os.path.exists(input_path):
    print(f"Error: {input_path} not found")
    exit(1)

try:
    img = Image.open(input_path)
    
    # Convert to RGBA if needed for transparency handling
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get the bounding box of the non-transparent content
    bbox = img.getbbox()
    
    if bbox is None:
        print("Error: Image is completely transparent")
        exit(1)
    
    # Crop with minimal margin (5 pixels)
    margin = 5
    left = max(0, bbox[0] - margin)
    top = max(0, bbox[1] - margin)
    right = min(img.width, bbox[2] + margin)
    bottom = min(img.height, bbox[3] + margin)
    
    cropped = img.crop((left, top, right, bottom))
    
    # Save the cropped image
    cropped.save(output_path, 'PNG', optimize=True)
    
    print(f"Successfully cropped image")
    print(f"Original size: {img.size}")
    print(f"Cropped size: {cropped.size}")
    print(f"Saved to: {output_path}")
    
except Exception as e:
    print(f"Error: {e}")
    exit(1)
