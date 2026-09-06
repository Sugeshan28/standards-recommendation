import urllib.request
import json
import sys

URL = "http://127.0.0.1:8000/api/v1/standards/normalize"

test_payload = {
    "product": {
        "name": "Mooring Hawser",
        "type": "Single Point Mooring (SPM) Hawser"
    },
    "application": "Single Point Mooring (SPM) system",
    "requirements": {
        "circumference": {
            "value": 14.0,
            "unit": "inch"
        },
        "length": {
            "value": 175.0,
            "unit": "ft",
            "tolerance": "±5"
        },
        "minimum_new_wet_breaking_strength": {
            "value": 271.0,
            "unit": "tons"
        },
        "construction": "Single Leg Hawser, Double Braided Nylon Rope (2 in 1), provision for Bell Mouth Thimble, spliced ends",
        "material": {
            "composition": "100% Nylon, braided nylon core and braided nylon sheath",
            "core": "braided nylon core",
            "sheath": "braided nylon sheath"
        },
        "linear_density": {
            "min": 7.9,
            "max": 8.1,
            "unit": "kg/m"
        },
        "color": "Natural White",
        "rope_cover": "100% encapsulated with Polyurethane Elastomer",
        "float_type": "Lace-on floats",
        "buoyancy_requirement": "Adequate reserve buoyancy for supporting hawser in sea water",
        "thimble": {
            "type": "SPM Type Hawser Bell Mouth Thimble",
            "reusable": True,
            "size": "For 14 inch rope size / suitable for hawser and 130-ton heavy-duty D shackle",
            "material": "Galvanized body with stainless steel roller"
        },
        "service_life": {
            "duration": "12 months continuous operation",
            "alternative": "100 tanker operations"
        }
    },
    "standards": [
        {
            "name": "OCIMF 2000",
            "title": "Guidelines for Purchasing and Testing of SPM Hawsers"
        }
    ],
    "vendor_info": "Delivery within 30 days. Vendor must be ISO 9001 certified."
}

print("1. Testing valid structured JSON...")
req1 = urllib.request.Request(URL, data=json.dumps(test_payload).encode("utf-8"), headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req1) as response:
        print(f"Status: {response.status}")
        data = json.loads(response.read().decode("utf-8"))
        normalized_text = data.get("normalized_text", "")
        # Reconfigure stdout to utf-8 to avoid UnicodeEncodeError on Windows console
        sys.stdout.reconfigure(encoding='utf-8')
        print("\n--- Normalized Text Output ---")
        print(normalized_text)
        print("------------------------------\n")
        
        # Assertions
        assert "175.0 ±5 ft" in normalized_text or "175 ±5 ft" in normalized_text, "Missing or incorrectly formatted length with tolerance"
        assert "271 tons" in normalized_text or "271.0 tons" in normalized_text, "Missing NWBS"
        assert "7.9" in normalized_text and "8.1" in normalized_text and "kg/m" in normalized_text, "Missing linear density"
        assert "100% Nylon" in normalized_text, "Missing material"
        assert "Polyurethane Elastomer" in normalized_text, "Missing rope cover"
        assert "OCIMF 2000" in normalized_text, "Missing standard"
        assert "ISO 9001" not in normalized_text, "Commercial info (ISO) should be excluded"
        assert "30 days" not in normalized_text, "Commercial info (delivery) should be excluded"

        
        print("All assertions passed successfully!")
except urllib.error.HTTPError as e:
    print(f"Failed with status: {e.code}")
    print(e.read().decode("utf-8"))
    sys.exit(1)
except AssertionError as e:
    print(f"Assertion failed: {e}")
    sys.exit(1)

print("\n2. Testing binary payload (to check UnicodeDecodeError fix)...")
binary_payload = b"not valid json \xb5 \xff \x00"
req2 = urllib.request.Request(URL, data=binary_payload, headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req2) as response:
        pass
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    if e.code == 422:
        print("Success: API returned 422 Validation Error without crashing.")
    else:
        print(f"Failed with status: {e.code}")
