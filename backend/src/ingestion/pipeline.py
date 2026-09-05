from pathlib import Path
from ..ingestion.extraction.text_extract import extract_text_file
from ..ingestion.cleaning.clean_text import clean_extracted_text

UPLOAD_FOLDER = Path(r"D:\Code\procurment-microservice\backend\src\db\objectstorage")

def run(file):
    filepath = UPLOAD_FOLDER / file
    extracted_text = extract_text_file(file=filepath)
    cleaned_text = clean_extracted_text(extracted_text=extracted_text["data"])
    return {"data":cleaned_text, "page_count":extracted_text["pagecount"]}

