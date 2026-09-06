async def process_standards(data):

    # Extract data received from frontend
    product_description = data.product_description
    material = data.material
    operating_rating = data.operating_rating
    language = data.language

    print("===== TEMPORARY STANDARDS PROCESSOR =====")
    print("Product:", product_description)
    print("Material:", material)
    print("Operating Rating:", operating_rating)
    print("Language:", language)

    # Temporary response.
    # This structure matches the existing frontend
    # renderRecommendations() function.

    return {
        "status": "success",

        "applicable_standards": [
            {
                "id": "temp-is-7098",
                "code": "IS 7098 (Part 2)",
                "title": "Cross-linked polyethylene insulated thermoplastic sheathed cables",
                "division": "Electrical",
                "section": "Power Cables",
                "category": "Electrical & Cables",

                "confidence": 94,

                "matchReasons": [
                    "Product description matches XLPE power cable",
                    "Operating rating matches 33kV application",
                    "Material specified as XLPE"
                ],

                "latestVersion": "2025",

                "amendments": [],

                "supersedes": [],

                "qco": {
                    "mandatory": True,
                    "scheme": "BIS Certification",
                    "mandatoryClause": "Product shall conform to the applicable requirements of the relevant Indian Standard.",
                    "orderName": "Temporary Test Order",
                    "gazetteRef": "TEMP/2026/001"
                },

                "scope": "XLPE insulated power cables suitable for high-voltage electrical power transmission and distribution.",

                "alliedStandards": {
                    "normativeReferences": [
                        {
                            "code": "IS 7098",
                            "role": "Primary cable standard reference"
                        }
                    ],

                    "testMethods": [
                        {
                            "code": "IS TEST-001",
                            "role": "Electrical and insulation testing"
                        }
                    ],

                    "safetyStandards": [
                        {
                            "code": "IS SAFETY-001",
                            "role": "Electrical safety requirements"
                        }
                    ],

                    "installationStandards": [
                        {
                            "code": "IS INSTALL-001",
                            "role": "Cable installation requirements"
                        }
                    ]
                }
            }
        ],

        "specification_gaps": [
            "Conductor size not specified",
            "Short-circuit rating not specified"
        ],

        "message": "Temporary response. Real LLM will replace this."
    }