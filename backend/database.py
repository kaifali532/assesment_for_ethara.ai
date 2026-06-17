import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# The default DATABASE_URL points to a local SQLite file so Render can run for completely free
# In production via docker-compose, this will be overridden by environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./inventory.db")

# Render injects 'postgres://' instead of 'postgresql://', which SQLAlchemy 1.4+ rejects
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Add connect_args for SQLite to prevent thread-sharing errors
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI routers
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
