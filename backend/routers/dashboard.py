from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/", response_model=schemas.DashboardSummary)
def get_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_summary(db)
