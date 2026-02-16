"""
Section Extractor Service
Extracts specific sections from research papers
"""
import re
from typing import Dict, List, Optional


class SectionExtractor:
    """Extract structured sections from research paper text"""
    
    # Common section headers
    ABSTRACT_HEADERS = ['abstract', 'summary']
    INTRO_HEADERS = ['introduction', '1. introduction', 'i. introduction']
    METHOD_HEADERS = ['method', 'methodology', 'methods', 'approach', 'experimental setup']
    RESULTS_HEADERS = ['results', 'experiments', 'evaluation', 'findings']
    CONCLUSION_HEADERS = ['conclusion', 'conclusions', 'discussion', 'future work']
    LIMITATION_HEADERS = ['limitations', 'limitation', 'threats to validity']
    
    @staticmethod
    def extract_section(text: str, section_headers: List[str], next_section_headers: List[str] = None) -> Optional[str]:
        """
        Extract a section based on headers
        
        Args:
            text: Full paper text
            section_headers: Possible headers for target section
            next_section_headers: Headers that indicate end of section
            
        Returns:
            Extracted section text or None
        """
        lines = text.split('\n')
        section_text = []
        in_section = False
        
        for i, line in enumerate(lines):
            line_lower = line.strip().lower()
            
            # Check if we're entering the target section
            if not in_section:
                for header in section_headers:
                    if line_lower.startswith(header) or line_lower == header:
                        in_section = True
                        break
                continue
            
            # Check if we've reached the next section
            if next_section_headers:
                for next_header in next_section_headers:
                    if line_lower.startswith(next_header):
                        return '\n'.join(section_text).strip()
            
            # Add line to section
            if line.strip():
                section_text.append(line)
            
            # Stop after reasonable length
            if len(section_text) > 100:
                break
        
        return '\n'.join(section_text).strip() if section_text else None
    
    @staticmethod
    def extract_abstract(text: str) -> Optional[str]:
        """Extract abstract section"""
        # Try structured extraction first
        abstract = SectionExtractor.extract_section(
            text,
            SectionExtractor.ABSTRACT_HEADERS,
            SectionExtractor.INTRO_HEADERS
        )
        
        if abstract and len(abstract) > 100:
            return abstract
        
        # Fallback: look for "Abstract" keyword and take next paragraph
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if 'abstract' in line.lower() and i + 1 < len(lines):
                # Collect lines until empty line or new section
                abstract_lines = []
                for j in range(i + 1, min(i + 20, len(lines))):
                    if not lines[j].strip():
                        break
                    abstract_lines.append(lines[j])
                
                result = '\n'.join(abstract_lines).strip()
                if len(result) > 100:
                    return result
        
        return None
    
    @staticmethod
    def extract_equations(text: str) -> List[str]:
        """
        Extract mathematical equations
        Looks for LaTeX-style equations or numbered equations
        """
        equations = []
        
        # Pattern for LaTeX equations
        latex_patterns = [
            r'\$\$(.+?)\$\$',  # Display math
            r'\\\[(.+?)\\\]',  # Bracket display
            r'\\begin\{equation\}(.+?)\\end\{equation\}',  # Equation environment
        ]
        
        for pattern in latex_patterns:
            matches = re.findall(pattern, text, re.DOTALL)
            equations.extend([m.strip() for m in matches])
        
        # Look for numbered equations (e.g., "(1)", "(2)")
        lines = text.split('\n')
        for line in lines:
            if re.search(r'\(\d+\)', line) and any(op in line for op in ['=', '+', '-', '*', '/']):
                equations.append(line.strip())
        
        return equations[:10]  # Limit to 10 most important equations
    
    @staticmethod
    def extract_all_sections(text: str) -> Dict[str, Optional[str]]:
        """
        Extract all major sections
        
        Returns:
            Dict with section names as keys
        """
        return {
            "abstract": SectionExtractor.extract_abstract(text),
            "introduction": SectionExtractor.extract_section(
                text,
                SectionExtractor.INTRO_HEADERS,
                SectionExtractor.METHOD_HEADERS
            ),
            "methodology": SectionExtractor.extract_section(
                text,
                SectionExtractor.METHOD_HEADERS,
                SectionExtractor.RESULTS_HEADERS
            ),
            "results": SectionExtractor.extract_section(
                text,
                SectionExtractor.RESULTS_HEADERS,
                SectionExtractor.CONCLUSION_HEADERS
            ),
            "conclusion": SectionExtractor.extract_section(
                text,
                SectionExtractor.CONCLUSION_HEADERS,
                []
            ),
            "limitations": SectionExtractor.extract_section(
                text,
                SectionExtractor.LIMITATION_HEADERS,
                []
            ),
            "equations": SectionExtractor.extract_equations(text)
        }


# Global instance
section_extractor = SectionExtractor()
