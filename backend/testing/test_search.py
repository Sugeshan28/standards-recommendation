import httpx
import sys

sys.stdout.reconfigure(encoding='utf-8')

URL = "http://127.0.0.1:8000/api/v1/standards/search"

# We just send a dummy file payload but use the filename of an existing file
# in the objectstorage directory so run_extract_text can find it.
files = {
    "file": ("3 Specification of Mooring Hawsers.pdf", b"dummy content", "application/pdf")
}

print(f"Testing E2E {URL}...")
print("This will execute Extraction -> Structuring -> Normalization -> Search -> Ranking -> LLM Reasoning")
print("This may take 1-2 minutes...")

try:
    with httpx.Client(timeout=180.0) as client:
        response = client.post(URL, files=files)
        
    print(f"\nStatus: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("\n--- Search Results ---")
        print(f"Query text starts with: {data['query']['normalized_text'][:50]}...")
        
        recs = data.get("recommendations", [])
        print(f"\nFound {len(recs)} recommendation(s).")
        
        for i, rec in enumerate(recs, 1):
            print(f"\n[{i}] Standard: {rec['standard_number']}")
            print(f"Title: {rec['title']}")
            print(f"Relevance Score: {rec['relevance_score']}")
            print(f"LLM Reason: {rec['reason']}")
            
        assert len(recs) > 0, "No recommendations found, is the DB empty?"
        assert "IS 5113:1979" in [r["standard_number"] for r in recs], "The IS 5113 standard should be found."
        
        print("\nSuccess: Semantic Search and Recommendation works!")
    else:
        print("Failed to search standards.")
        print(response.text)
        sys.exit(1)
        
except Exception as e:
    print(f"Error during request: {e}")
    sys.exit(1)
