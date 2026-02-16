"""
LLM Service - Ollama Integration
Handles local LLM inference for summarization and text generation
"""
import httpx
from typing import Optional, List, Dict
from ..config import settings


class LLMService:
    """Service for interacting with Ollama LLM"""
    
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model = settings.OLLAMA_MODEL
        self.max_tokens = settings.MAX_TOKENS
        self.temperature = settings.TEMPERATURE
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Generate text using Ollama
        
        Args:
            prompt: User prompt
            system_prompt: System instruction
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Returns:
            Generated text
        """
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature or self.temperature,
                        "num_predict": max_tokens or self.max_tokens
                    }
                }
                
                if system_prompt:
                    payload["system"] = system_prompt
                
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload
                )
                response.raise_for_status()
                result = response.json()
                return result.get("response", "")
        
        except Exception as e:
            print(f"LLM generation error: {e}")
            return ""
    
    async def extract_abstract(self, full_text: str) -> str:
        """Extract abstract from research paper text"""
        prompt = f"""Extract the abstract from the following research paper text. 
Return ONLY the abstract text, nothing else.

Paper text:
{full_text[:3000]}
"""
        system_prompt = "You are a research paper analyzer. Extract information accurately."
        return await self.generate(prompt, system_prompt, temperature=0.3)
    
    async def extract_key_contributions(self, full_text: str) -> str:
        """Extract key contributions from paper"""
        prompt = f"""Analyze this research paper and list the key contributions.
Be concise and specific.

Paper text:
{full_text[:4000]}
"""
        return await self.generate(prompt, temperature=0.3)
    
    async def extract_methodology(self, full_text: str) -> str:
        """Extract methodology section"""
        prompt = f"""Extract and summarize the methodology/methods section from this research paper.

Paper text:
{full_text[:4000]}
"""
        return await self.generate(prompt, temperature=0.3)
    
    async def extract_limitations(self, full_text: str) -> str:
        """Extract limitations from paper"""
        prompt = f"""Identify and list the limitations mentioned in this research paper.

Paper text:
{full_text[:4000]}
"""
        return await self.generate(prompt, temperature=0.3)
    
    async def generate_literature_review(
        self,
        title: str,
        abstract: str,
        key_contributions: str
    ) -> str:
        """Generate a literature review paragraph"""
        prompt = f"""Write a concise literature review paragraph for this research paper.
Include the main findings and contributions.

Title: {title}
Abstract: {abstract}
Key Contributions: {key_contributions}
"""
        system_prompt = "You are an academic writer. Write clear, formal literature reviews."
        return await self.generate(prompt, system_prompt, temperature=0.5)
    
    async def summarize_meeting(self, transcript: str) -> Dict[str, any]:
        """
        Summarize meeting transcript
        
        Returns:
            Dict with summary, key_points, decisions, action_items
        """
        prompt = f"""Analyze this meeting transcript and provide:
1. A brief summary (2-3 sentences)
2. Key points discussed (bullet list)
3. Decisions made (bullet list)
4. Action items (bullet list with assignees if mentioned)

Format your response as:
SUMMARY:
[summary text]

KEY POINTS:
- [point 1]
- [point 2]

DECISIONS:
- [decision 1]
- [decision 2]

ACTION ITEMS:
- [action 1]
- [action 2]

Transcript:
{transcript[:5000]}
"""
        response = await self.generate(prompt, temperature=0.4)
        return self._parse_meeting_summary(response)
    
    def _parse_meeting_summary(self, response: str) -> Dict[str, any]:
        """Parse structured meeting summary from LLM response"""
        result = {
            "summary": "",
            "key_points": [],
            "decisions": [],
            "action_items": []
        }
        
        sections = {
            "SUMMARY:": "summary",
            "KEY POINTS:": "key_points",
            "DECISIONS:": "decisions",
            "ACTION ITEMS:": "action_items"
        }
        
        current_section = None
        lines = response.split("\n")
        
        for line in lines:
            line = line.strip()
            
            # Check for section headers
            for header, section_key in sections.items():
                if header in line:
                    current_section = section_key
                    break
            
            # Add content to current section
            if current_section and line and not any(h in line for h in sections.keys()):
                if current_section == "summary":
                    result["summary"] += line + " "
                elif line.startswith("-") or line.startswith("•"):
                    result[current_section].append(line.lstrip("-•").strip())
        
        result["summary"] = result["summary"].strip()
        return result


# Global instance
llm_service = LLMService()
