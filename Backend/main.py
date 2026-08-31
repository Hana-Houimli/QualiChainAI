from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import chat_router, audit_router, analysis_router, capa_router , report_router

app = FastAPI(
    title="QualiChain AI API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    chat_router,
    prefix="/api",
    tags=["Chat"]
)

app.include_router(
    audit_router,
    prefix="/api/audits",
    tags=["Audit"]
)

app.include_router(
    analysis_router,
    prefix="/api/analysis",
    tags=["Analysis"]
)

app.include_router(
    capa_router,
    prefix="/api/capa",
    tags=["CAPA"]
)

app.include_router(
    report_router,
    prefix="/api/reports",
    tags=["Reports"]
)
