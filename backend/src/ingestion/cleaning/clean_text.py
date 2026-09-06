def clean_extracted_text(extracted_text: str) -> str:

    cleaned_text = []

    for pages in extracted_text:
        normalized_text = pages.replace("\r\n", "\n")
        normalized_text = normalized_text.replace("\r", "\n")

        cleaned_text.append(normalized_text.strip())

    return cleaned_text