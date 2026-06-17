from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    sku: str
    price: float = Field(..., gt=0, description="Price must be greater than zero")
    quantity: int = Field(..., ge=0, description="Quantity cannot be negative")

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True

# --- Customer Schemas ---
class CustomerBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0, description="Order quantity must be positive")

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    items: List[OrderItemResponse]
    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_products: List[ProductResponse]
