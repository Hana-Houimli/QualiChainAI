from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any
from langchain_core.messages import HumanMessage
from graph.workflow import app
import json
from utils.checklist_format import checklist_format
from pymongo import MongoClient
import os
from utils.generate_pdf import generate_pdf


audit_router = APIRouter()
client = MongoClient("mongodb://localhost:27017/")
db = client["qualichainAI"]
audit_collection = db["audit_checklists"]

PDF_DIR = "generated_checklists"

os.makedirs(
    PDF_DIR,
    exist_ok=True
)

class ChecklistRequest(BaseModel):
    type_audit: str
    site_audit: str
    responsable: str
    date_audit : str

class AuditUpdateRequest(BaseModel):
    sections: list[dict[str, Any]]
    status: str
    date_audit: str
    responsable: str

class auditIdRequest(BaseModel):
    audit_id: str


@audit_router.post("/generate")
def generate_checklist(request: ChecklistRequest):

    result = app.invoke(
        {
            "messages": [
                HumanMessage(
                    content=(
                        f"Génère une checklist pour "
                        f"un audit {request.type_audit} "
                        f"du site {request.site_audit}"
                    )
                )
            ]
        }
    )

    content = result["messages"][-1].content
    checklist = checklist_format( json.loads(content) )
    checklist["responsable"] = request.responsable
    checklist["date_audit"] = request.date_audit

    # Générer un ID unique pour la checklist
    audit_id = (
        f"AUD-{audit_collection.count_documents({}) + 1:03d}"
    )

    checklist = {
        "audit_id": audit_id,
        **checklist
    }
    
    
    audit_collection.insert_one(checklist)

    return {
        "audit_id": audit_id,
    }


@audit_router.get("/")
def get_audits():

    audits = list(
        audit_collection.find(
            {},
            {
                "_id": 0,
                "audit_id": 1,
                "type_audit": 1,
                "site_audit": 1,
                "status": 1,
                "date_audit": 1,
                "responsable": 1,
                "analysis.score_conformite": 1
            }
        )
    )

    return audits

@audit_router.delete("/{audit_id}")
async def delete_audit(audit_id: str):

    result = audit_collection.delete_one({
        "audit_id": audit_id
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Audit introuvable"
        )

    return {
        "message": "Audit supprimé avec succès",
        "audit_id": audit_id
    }

@audit_router.get("/{audit_id}")
def get_audit(audit_id: str):

    audit = audit_collection.find_one(
        {
            "audit_id": audit_id
        },
        {
            "_id": 0
        }
    )

    if not audit:
        raise HTTPException(
            status_code=404,
            detail="Audit introuvable."
        )

    return audit

@audit_router.put("/{audit_id}")
def update_audit(
    audit_id: str,
    request: AuditUpdateRequest
):
    result = audit_collection.update_one(
        {
            "audit_id": audit_id
        },
        {
            "$set": {
                "sections": request.sections,
                "status": request.status,
                "date_audit": request.date_audit,
                "responsable": request.responsable
            }
        }
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Audit introuvable."
        )

    return {
        "message": "Audit sauvegardé avec succès.",
        "audit_id": audit_id
    }





@audit_router.post("/analyze")
def analyze_checklist(request: auditIdRequest):

    result = app.invoke(
        {
            "messages": [
                HumanMessage(
                    content=(
                        f"Analyser checklist "
                        f"{request.audit_id}"
                    )
                )
            ]
        }
    )
    analysis = json.loads(result["messages"][-1].content)

    audit_collection.update_one(
        {
            "audit_id": request.audit_id
        },
        {
            "$set": {
                "analysis": analysis
            }
        }
    )


    return {
        "message": "Analyse générée avec succès.",
        "audit_id": request.audit_id
    }


@audit_router.get("/pdf/audit/{audit_id}")
def download_audit_pdf(audit_id: str):

    audit = audit_collection.find_one(
        {
            "audit_id": audit_id
        },
        {
            "_id": 0,
            "analysis":0
        }
    )

    filename = f"{audit_id}_checklist.pdf"

    output_file = os.path.join(
        PDF_DIR,
        filename
    )

    generate_pdf(
        data=audit,
        output_file=output_file,
        title=f"Checklist Audit {audit_id}"
    )

    return FileResponse(
        path=output_file,
        media_type="application/pdf",
        filename=filename
    )

