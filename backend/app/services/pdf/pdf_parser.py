"""
PDF Parser Service
Extracts text and metadata from PDF files
"""
import PyPDF2
import pdfplumber
from pathlib import Path
from typing import Dict, Optional
import re


class PDFParser:
    """Service for parsing PDF documents"""
    
    @staticmethod
    def extract_text(pdf_path: str) -> str:
        """
        Extract all text from PDF
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            Extracted text
        """
        text = ""
        
        try:
            # Try pdfplumber first (better for complex layouts)
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n\n"
        except Exception as e:
            print(f"pdfplumber failed: {e}, trying PyPDF2")
            
            # Fallback to PyPDF2
            try:
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        text += page.extract_text() + "\n\n"
            except Exception as e2:
                print(f"PyPDF2 also failed: {e2}")
                raise Exception(f"Failed to extract text from PDF: {e2}")
        
        return text.strip()
    
    @staticmethod
    def extract_metadata(pdf_path: str) -> Dict[str, any]:
        """
        Extract PDF metadata
        
        Returns:
            Dict with title, author, subject, etc.
        """
        metadata = {
            "title": None,
            "author": None,
            "subject": None,
            "creator": None,
            "producer": None,
            "creation_date": None,
            "num_pages": 0
        }
        
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                metadata["num_pages"] = len(pdf_reader.pages)
                
                if pdf_reader.metadata:
                    metadata["title"] = pdf_reader.metadata.get("/Title")
                    metadata["author"] = pdf_reader.metadata.get("/Author")
                    metadata["subject"] = pdf_reader.metadata.get("/Subject")
                    metadata["creator"] = pdf_reader.metadata.get("/Creator")
                    metadata["producer"] = pdf_reader.metadata.get("/Producer")
                    metadata["creation_date"] = pdf_reader.metadata.get("/CreationDate")
        
        except Exception as e:
            print(f"Metadata extraction error: {e}")
        
        return metadata
    
    @staticmethod
    def extract_title_from_text(text: str) -> Optional[str]:
        """
        Attempt to extract title from paper text
        Usually the first significant line
        """
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        for line in lines[:10]:  # Check first 10 lines
            # Skip common headers
            if any(skip in line.lower() for skip in ['abstract', 'introduction', 'arxiv', 'doi']):
                continue
            
            # Title is usually longer than 10 chars and doesn't end with a period
            if len(line) > 10 and not line.endswith('.'):
                return line
        
        return lines[0] if lines else None
    
    @staticmethod
    def extract_authors_from_text(text: str) -> list:
        """
        Attempt to extract author names from paper text
        This is a heuristic approach
        """
        authors = []
        lines = text.split('\n')[:20]  # Check first 20 lines
        
        # Look for lines with name patterns
        name_pattern = r'\b[A-Z][a-z]+ [A-Z][a-z]+\b'
        
        for line in lines:
            line = line.strip()
            
            # Skip if line contains common non-author keywords
            if any(kw in line.lower() for kw in ['university', 'department', 'abstract', 'email', '@']):
                continue
            
            # Find potential names
            matches = re.findall(name_pattern, line)
            if matches:
                authors.extend(matches)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_authors = []
        for author in authors:
            if author not in seen:
                seen.add(author)
                unique_authors.append(author)
        
        return unique_authors[:10]  # Limit to 10 authors


# Global instance
pdf_parser = PDFParser()
