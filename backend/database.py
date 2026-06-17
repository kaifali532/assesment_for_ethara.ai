import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# The default DATABASE_URL points to the docker-compose postgres service
# In production, this will be overridden by environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/inventory_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI routers
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
