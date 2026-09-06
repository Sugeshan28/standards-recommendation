import httpx
import sys

URL = "http://127.0.0.1:8000/api/v1/standards/process"

print("Testing E2E /process endpoint...")
print(f"Target URL: {URL}")
print("This will run Extraction -> Cleaning -> Structuring -> Normalization -> Embedding")
print("This may take a minute or two as it makes LLM calls...")

# Send a dummy file payload, but with the filename that exists in the objectstorage folder
# because run_extract_text reads from that directory based on filename.
files = {
    "file": ("3 Specification of Mooring Hawsers.pdf", b"dummy content", "application/pdf")
}

try:
    # Set a high timeout because the LLM gateway calls can take up to 30-60 seconds
    with httpx.Client(timeout=120.0) as client:
        response = client.post(URL, files=files)
        
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("\n--- Successful E2E Run ---")
        print("Keys returned:", data.keys())
        
        # Verify the presence of all stages
        assert "structured_tender" in data, "Missing structured_tender"
        assert "normalized_text" in data, "Missing normalized_text"
        assert "embedding" in data, "Missing embedding"
        assert "dimension" in data, "Missing dimension"
        
        # Verify correctness
        assert data["dimension"] == 384, f"Expected dimension 384, got {data['dimension']}"
        assert len(data["embedding"]) == 384, "Embedding length mismatch"
        assert len(data["normalized_text"]) > 100, "Normalized text seems too short or empty"
        assert data["structured_tender"]["product"]["name"] != "", "Structured tender product name is empty"
        
        print("All assertions passed! E2E pipeline works!")
    else:
        print("Failed to process request.")
        print(response.text)
        sys.exit(1)
        
except Exception as e:
    print(f"Error during request: {e}")
    sys.exit(1)
