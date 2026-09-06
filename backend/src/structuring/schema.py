from typing import List, Optional, Union
from pydantic import BaseModel, Field

class Product(BaseModel):
    name: Optional[str] = Field(None, description="Name of the product")
    type: Optional[str] = Field(None, description="Type of the product")

class Measurement(BaseModel):
    value: Optional[float] = Field(None, description="Numeric value")
    unit: Optional[str] = Field(None, description="Unit of measurement")

class MeasurementWithTolerance(Measurement):
    tolerance: Optional[str] = Field(None, description="Tolerance, e.g., ±5")

class RangeMeasurement(BaseModel):
    min: Optional[float] = Field(None, description="Minimum value")
    max: Optional[float] = Field(None, description="Maximum value")
    unit: Optional[str] = Field(None, description="Unit of measurement")

class Material(BaseModel):
    composition: Optional[str] = Field(None, description="Material composition")
    core: Optional[str] = Field(None, description="Material of the core")
    sheath: Optional[str] = Field(None, description="Material of the sheath")

class Thimble(BaseModel):
    type: Optional[str] = None
    reusable: Optional[bool] = None
    size: Optional[str] = None
    material: Optional[str] = None

class ServiceLife(BaseModel):
    duration: Optional[str] = None
    alternative: Optional[str] = None

class Requirements(BaseModel):
    circumference: Optional[Measurement] = None
    length: Optional[MeasurementWithTolerance] = None
    minimum_new_wet_breaking_strength: Optional[Measurement] = None
    construction: Optional[str] = None
    material: Optional[Material] = None
    linear_density: Optional[RangeMeasurement] = None
    color: Optional[str] = None
    rope_cover: Optional[str] = None
    float_type: Optional[str] = None
    buoyancy_requirement: Optional[str] = None
    thimble: Optional[Thimble] = None
    service_life: Optional[ServiceLife] = None

class Standard(BaseModel):
    name: Optional[str] = Field(None, description="Name of the standard (e.g., OCIMF 2000)")
    title: Optional[str] = Field(None, description="Title or description of the standard")

class StructuredTender(BaseModel):
    product: Optional[Product] = None
    application: Optional[str] = None
    requirements: Optional[Requirements] = None
    standards: Optional[List[Standard]] = Field(default_factory=list)
