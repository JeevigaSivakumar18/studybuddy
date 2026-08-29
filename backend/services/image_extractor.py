from pathlib import Path

def extract_text_from_image(file_path: str) -> str:
    """
    Extract text from an image using pytesseract (OCR).
    Returns empty string if pytesseract is not installed.
    """
    try:
        from PIL import Image
        import pytesseract

        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text

    except ImportError:
        # pytesseract or Pillow not installed
        return ""
    except Exception as e:
        print(f"OCR error: {e}")
        return ""