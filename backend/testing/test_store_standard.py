import httpx
import sys

URL = "http://127.0.0.1:8000/api/v1/standards/storestandards"

payload = {
  "standard_number": "IS 5113:1979",
  "title": "General Requirements and Testing of AC Mooring Winches (For Ship Board Use)",
  "revision": "First Revision",
  "year": 1979,
  "document_type": "Indian Standard",
  "technical_area": "Marine Engineering",
  "status": "Reaffirmed 2002",
  "product": "AC Mooring Winches",
  "application": "Shipboard mooring",
  "scope": "Covers general requirements and testing of AC automatic and non-automatic mooring winches fitted on board ships for rope loads up to and including 40 tonnes.",
  "requirements": {
      "winch_design": "Must withstand marine environments",
      "winch_motors": "AC induction type"
  },
  "testing_requirements": [
      "Type tests",
      "Routine tests",
      "On-board acceptance tests"
  ]
}

print(f"Testing {URL}...")
try:
    with httpx.Client(timeout=30.0) as client:
        response = client.post(URL, json=payload)
        
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("Success:", data)
        assert data["status"] == "success"
        assert data["chunks_stored"] > 0
        assert data["embedding_dimension"] == 384
        assert data["collection"] == "standards_collection"
        assert data["standard_number"] == "IS 5113:1979"
        print(f"Stored {data['chunks_stored']} chunks successfully.")
    else:
        print("Failed to store standard.")
        print(response.text)
        sys.exit(1)
        
except Exception as e:
    print(f"Error during request: {e}")
    sys.exit(1)
