from fastapi import APIRouter

from app.api.v1.endpoints import admin, contacts, health, careers

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(contacts.router)
api_router.include_router(admin.router)

api_router.include_router(careers.router)
