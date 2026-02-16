"""
Simple PDF text extractor using pdfplumber
"""
import pdfplumber

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract all text from a PDF file"""
    try:
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_first_page(pdf_path: str) -> str:
    """Extract text from first page only (for quick preview)"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            if len(pdf.pages) > 0:
                return pdf.pages[0].extract_text() or ""
        return ""
    except Exception as e:
        print(f"Error extracting first page: {e}")
        return ""
