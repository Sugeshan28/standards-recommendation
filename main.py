from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from backend.src.api.standardsroute import standards_router

app = FastAPI(
    title="Indian standards",
    version="v1"
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # Sanitize binary data in inputs to prevent UnicodeDecodeError during serialization
    for error in errors:
        if "input" in error and isinstance(error["input"], bytes):
            error["input"] = "<binary_data_omitted>"
            
    return JSONResponse(
        status_code=422,
        content={"detail": jsonable_encoder(errors)},
    )

app.include_router(standards_router, prefix="/api/v1/standards")