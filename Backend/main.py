from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.audit import audit_router
from api.chat import chat_router

app = FastAPI()

app.include_router(chat_router)
app.include_router(audit_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


