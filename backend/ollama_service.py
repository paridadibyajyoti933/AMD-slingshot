"""
Ollama AI service for text processing
"""
import requests
import json

OLLAMA_BASE_URL = "http://localhost:11434"

def generate_summary(text: str, max_length: int = 500) -> str:
    """Generate a summary of the given text using Ollama"""
    try:
        prompt = f"""Please provide a concise summary of the following research paper text in about 150 words. Focus on the main findings and contributions:

{text[:2000]}

Summary:"""

        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": "mistral",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 200,
                    "num_ctx": 2048
                }
            },
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            return "Summary generation failed"
            
    except Exception as e:
        print(f"Error generating summary: {e}")
        return f"Error: {str(e)}"

def extract_key_points(text: str) -> str:
    """Extract key contributions from the text"""
    try:
        prompt = f"""From the following research paper, extract 3-5 key contributions or findings as bullet points:

{text[:2000]}

Key Contributions:"""

        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": "mistral",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.5,
                    "num_predict": 150,
                    "num_ctx": 2048
                }
            },
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            return "Key points extraction failed"
            
    except Exception as e:
        print(f"Error extracting key points: {e}")
        return f"Error: {str(e)}"

def check_ollama_status() -> bool:
    """Check if Ollama is running"""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        return response.status_code == 200
    except:
        return False
