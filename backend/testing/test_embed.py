import urllib.request
import json
import sys

URL = "http://127.0.0.1:8000/api/v1/standards/embed"

print("1. Testing valid embed request...")
valid_payload = {
    "normalized_text": "Product: Mooring Hawser\nApplication: Single Point Mooring (SPM) system\nTechnical Requirements:\n- Circumference: 14 inch\n- Length: 175 ±5 ft\n"
}

req1 = urllib.request.Request(URL, data=json.dumps(valid_payload).encode("utf-8"), headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req1) as response:
        print(f"Status: {response.status}")
        data = json.loads(response.read().decode("utf-8"))
        dimension = data.get("dimension")
        embedding = data.get("embedding", [])
        
        print(f"Dimension returned: {dimension}")
        print(f"Embedding list length: {len(embedding)}")
        
        assert dimension == 384, f"Expected dimension 384, got {dimension}"
        assert len(embedding) == 384, f"Expected embedding list length 384, got {len(embedding)}"
        print("Valid request passed successfully!")
except urllib.error.HTTPError as e:
    print(f"Failed with status: {e.code}")
    print(e.read().decode("utf-8"))
    sys.exit(1)
except AssertionError as e:
    print(f"Assertion failed: {e}")
    sys.exit(1)

print("\n2. Testing empty text validation...")
empty_payload = {
    "normalized_text": "   "
}
req2 = urllib.request.Request(URL, data=json.dumps(empty_payload).encode("utf-8"), headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req2) as response:
        print("Failed: Empty text should have been rejected.")
        sys.exit(1)
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    if e.code in [400, 422]:
        print("Success: Empty text was correctly rejected.")
    else:
        print(f"Failed with status: {e.code}")
        print(e.read().decode("utf-8"))
        sys.exit(1)
