"""
Citation Generator Service
Generates APA, IEEE, and BibTeX citations
"""
from datetime import datetime
from typing import List, Optional


class CitationService:
    """Service for generating academic citations"""
    
    @staticmethod
    def generate_apa(
        authors: List[str],
        year: Optional[int],
        title: str,
        journal: Optional[str] = None,
        volume: Optional[str] = None,
        pages: Optional[str] = None,
        doi: Optional[str] = None
    ) -> str:
        """
        Generate APA format citation
        
        Format: Author, A. A., & Author, B. B. (Year). Title of article. 
                Journal Name, volume(issue), pages. https://doi.org/xxx
        """
        # Format authors
        if not authors:
            author_str = "Unknown Author"
        elif len(authors) == 1:
            author_str = CitationService._format_apa_author(authors[0])
        elif len(authors) == 2:
            author_str = f"{CitationService._format_apa_author(authors[0])} & {CitationService._format_apa_author(authors[1])}"
        else:
            formatted_authors = [CitationService._format_apa_author(a) for a in authors[:6]]
            if len(authors) > 6:
                author_str = ", ".join(formatted_authors) + ", et al."
            else:
                author_str = ", ".join(formatted_authors[:-1]) + f", & {formatted_authors[-1]}"
        
        # Build citation
        year_str = f"({year or 'n.d.'})"
        citation = f"{author_str} {year_str}. {title}."
        
        if journal:
            citation += f" {journal}"
            if volume:
                citation += f", {volume}"
            if pages:
                citation += f", {pages}"
            citation += "."
        
        if doi:
            citation += f" https://doi.org/{doi}"
        
        return citation
    
    @staticmethod
    def generate_ieee(
        authors: List[str],
        title: str,
        journal: Optional[str] = None,
        year: Optional[int] = None,
        volume: Optional[str] = None,
        pages: Optional[str] = None
    ) -> str:
        """
        Generate IEEE format citation
        
        Format: [1] A. Author, B. Author, and C. Author, "Title of article," 
                Journal Name, vol. X, no. Y, pp. Z-Z, Month Year.
        """
        # Format authors
        if not authors:
            author_str = "Unknown"
        elif len(authors) <= 3:
            formatted = [CitationService._format_ieee_author(a) for a in authors]
            if len(formatted) == 1:
                author_str = formatted[0]
            elif len(formatted) == 2:
                author_str = f"{formatted[0]} and {formatted[1]}"
            else:
                author_str = f"{formatted[0]}, {formatted[1]}, and {formatted[2]}"
        else:
            author_str = f"{CitationService._format_ieee_author(authors[0])} et al."
        
        # Build citation
        citation = f'{author_str}, "{title}"'
        
        if journal:
            citation += f", {journal}"
        if volume:
            citation += f", vol. {volume}"
        if pages:
            citation += f", pp. {pages}"
        if year:
            citation += f", {year}"
        
        citation += "."
        return citation
    
    @staticmethod
    def generate_bibtex(
        cite_key: str,
        authors: List[str],
        title: str,
        year: Optional[int] = None,
        journal: Optional[str] = None,
        volume: Optional[str] = None,
        pages: Optional[str] = None
    ) -> str:
        """Generate BibTeX format citation"""
        author_str = " and ".join(authors) if authors else "Unknown"
        
        bibtex = f"""@article{{{cite_key},
  author = {{{author_str}}},
  title = {{{title}}},"""
        
        if journal:
            bibtex += f"\n  journal = {{{journal}}},"
        if year:
            bibtex += f"\n  year = {{{year}}},"
        if volume:
            bibtex += f"\n  volume = {{{volume}}},"
        if pages:
            bibtex += f"\n  pages = {{{pages}}},"
        
        bibtex += "\n}"
        return bibtex
    
    @staticmethod
    def _format_apa_author(name: str) -> str:
        """Format author name for APA (Last, F. M.)"""
        parts = name.strip().split()
        if len(parts) == 1:
            return parts[0]
        
        last_name = parts[-1]
        initials = ". ".join([p[0].upper() for p in parts[:-1]]) + "."
        return f"{last_name}, {initials}"
    
    @staticmethod
    def _format_ieee_author(name: str) -> str:
        """Format author name for IEEE (F. M. Last)"""
        parts = name.strip().split()
        if len(parts) == 1:
            return parts[0]
        
        last_name = parts[-1]
        initials = ". ".join([p[0].upper() for p in parts[:-1]]) + "."
        return f"{initials} {last_name}"


# Global instance
citation_service = CitationService()
