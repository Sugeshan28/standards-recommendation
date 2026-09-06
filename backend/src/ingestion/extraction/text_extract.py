import fitz

def extract_text_file(file:str):
    
    PAGES = []
    pagecount = 0
    document = fitz.open(file)

    for page in document:
        pagecount+=1
        text = page.get_text("text")
        PAGES.append(text)

    document.close()

    return {
        "data":PAGES,
        "pagecount":pagecount
        }