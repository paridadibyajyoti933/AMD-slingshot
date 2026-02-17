"""
Test Ollama Connection and AI Features
This script tests the Ollama integration for DeepWork OS
"""
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from ollama_service import check_ollama_status, generate_summary, extract_key_points

def test_ollama_connection():
    """Test basic Ollama connectivity"""
    print("=" * 60)
    print("TESTING OLLAMA CONNECTION")
    print("=" * 60)
    
    print("\n1. Checking Ollama status...")
    status = check_ollama_status()
    if status:
        print("   ✅ Ollama is running on http://localhost:11434")
    else:
        print("   ❌ Ollama is NOT running")
        print("   Please start Ollama with: ollama serve")
        return False
    
    return True

def test_summary_generation():
    """Test AI summary generation"""
    print("\n2. Testing summary generation...")
    
    test_text = """
    This research paper presents a novel approach to deep learning optimization.
    We introduce a new algorithm called AdaptiveGrad that dynamically adjusts
    learning rates based on gradient statistics. Our experiments on ImageNet
    show a 15% improvement in training speed and 3% better accuracy compared
    to standard Adam optimizer. The method is particularly effective for
    large-scale neural networks with millions of parameters.
    """
    
    summary = generate_summary(test_text)
    
    if summary and "Error:" not in summary:
        print(f"   ✅ Summary generated successfully ({len(summary)} characters)")
        print(f"\n   Summary Preview:")
        print(f"   {summary[:200]}...")
        return True
    else:
        print(f"   ❌ Summary generation failed: {summary}")
        return False

def test_key_points_extraction():
    """Test key points extraction"""
    print("\n3. Testing key points extraction...")
    
    test_text = """
    This paper makes three key contributions:
    1. A new optimization algorithm called AdaptiveGrad
    2. Theoretical analysis proving convergence guarantees
    3. Empirical validation on multiple benchmark datasets
    
    Our results show significant improvements in both training efficiency
    and model accuracy across various deep learning architectures.
    """
    
    key_points = extract_key_points(test_text)
    
    if key_points and "Error:" not in key_points:
        print(f"   ✅ Key points extracted successfully ({len(key_points)} characters)")
        print(f"\n   Key Points Preview:")
        print(f"   {key_points[:200]}...")
        return True
    else:
        print(f"   ❌ Key points extraction failed: {key_points}")
        return False

def main():
    """Run all tests"""
    print("\n🚀 DeepWork OS - Ollama Integration Test\n")
    
    results = []
    
    # Test 1: Connection
    results.append(("Connection", test_ollama_connection()))
    
    if results[0][1]:  # Only continue if connection works
        # Test 2: Summary
        results.append(("Summary Generation", test_summary_generation()))
        
        # Test 3: Key Points
        results.append(("Key Points Extraction", test_key_points_extraction()))
    
    # Print results
    print("\n" + "=" * 60)
    print("TEST RESULTS")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:.<40} {status}")
    
    all_passed = all(result[1] for result in results)
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 ALL TESTS PASSED!")
        print("\nYour Ollama integration is working correctly.")
        print("You can now upload PDFs and get AI-powered summaries!")
    else:
        print("⚠️  SOME TESTS FAILED")
        print("\nPlease check the error messages above.")
    print("=" * 60 + "\n")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
