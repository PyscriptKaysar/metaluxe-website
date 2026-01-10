from PIL import Image
import os

path = 'public/images/metaluxe.png'
try:
    if os.path.exists(path):
        img = Image.open(path)
        img = img.convert('RGB')
        # Sample the top-left corner color
        color = img.getpixel((0, 0))
        print(f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}")
    else:
        print("File not found")
except ImportError:
    print("PIL_MISSING")
except Exception as e:
    print(f"Error: {e}")
