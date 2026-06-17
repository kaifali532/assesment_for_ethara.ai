from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routers import products, customers, orders, dashboard
import seed

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize workspace with starter data if empty
db = SessionLocal()
try:
    seed.seed_database(db)
finally:
    db.close()

app = FastAPI(title="Inventory & Order Management API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Inventory & Order Management API"}
