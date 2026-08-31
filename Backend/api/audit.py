from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph.workflow import app
import json
from utils import checklist_format
from pymongo import MongoClient



audit_router = APIRouter()
client = MongoClient("mongodb://localhost:27017/")
db = client["qualichainAI"]
audit_collection = db["audit_checklists"]

class ChecklistRequest(BaseModel):
    type_audit: str
    site_audit: str

class ChecklistUpdateRequest(BaseModel):
    checklist: dict



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

    try:
        checklist = checklist_format( json.loads(content) )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur parsing checklist : {str(e)}"
        )

    # Générer un ID unique pour la checklist
    checklist_id = (
        f"CHK-{audit_collection.count_documents({}) + 1:03d}"
    )

    checklist = {
        "checklist_id": checklist_id,
        **checklist
    }
    
    
    audit_collection.insert_one(checklist)

    return {
        "checklist_id": checklist_id,
        "status": checklist["status"]
    }


@audit_router.get("/")
def get_audits():

    audits = list(
        audit_collection.find(
            {},
            {
                "_id": 0,
                "checklist_id": 1,
                "type_audit": 1,
                "site_audite": 1,
                "status": 1,
                "date_creation": 1,
                "date_audit": 1,
                "responsable": 1
            }
        )
    )

    return audits


@audit_router.get("/{checklist_id}")
def get_audit(checklist_id: str):

    checklist = audit_collection.find_one(
        {
            "checklist_id": checklist_id
        },
        {
            "_id": 0
        }
    )

    if not checklist:
        raise HTTPException(
            status_code=404,
            detail="Checklist introuvable."
        )

    return checklist


@audit_router.put("/{checklist_id}")
def update_checklist(
    checklist_id: str,
    request: ChecklistUpdateRequest
):

    result = audit_collection.update_one(
        {
            "checklist_id": checklist_id
        },
        {
            "$set": request.checklist
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Checklist introuvable."
        )

    return {
        "message": "Checklist sauvegardée avec succès.",
        "checklist_id": checklist_id
    }