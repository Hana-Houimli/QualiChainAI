from fastapi import APIRouter , HTTPException
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph.workflow import app
from datetime import datetime, timezone
from pymongo import MongoClient
import json


capa_router = APIRouter()
client = MongoClient("mongodb://localhost:27017/")
db = client["qualichainAI"]
capa_collection = db["capa_plans"]


class auditIdRequest(BaseModel):
    audit_id: str

class CapaGenerateRequest(BaseModel):
    message: str

class UpdateActionStatusRequest(BaseModel):
    statut_action: str



@capa_router.post("/generate")
def generate_capa(request: CapaGenerateRequest):

    result = app.invoke(
            {
                "messages": [
                    HumanMessage(
                        content=(
                            f"{request.message}\n\n"
                            "Quelle CAPA faut-il mettre en place ? "
                        )
                    )
                ]
            }
        )


    content = result["messages"][-1].content


    try:
        capa = json.loads(content)

    except json.JSONDecodeError:

            raise HTTPException(
                status_code=500,
                detail="La réponse de l'IA n'est pas un JSON valide."
            )

    capa_id = (
            f"CAPA-{capa_collection.count_documents({}) + 1:03d}"
        )



    capa_document = {
            "capa_id": capa_id,
            "created_at": datetime.now(timezone.utc),
            "description_probleme": request.message,
            **capa
        }


    capa_collection.insert_one(
            capa_document
        )


    return {
            "message": "CAPA générée avec succès.",
            "capa_id": capa_id
        }


@capa_router.get("/")
def get_all_capa():

    capas = list(
        capa_collection.find(
            {},
            {"_id": 0}
        )
    )

    for capa in capas:
        if isinstance(capa.get("created_at"), datetime):

            capa["created_at"] = (
                capa["created_at"]
                .isoformat()
            )

    return capas



@capa_router.get("/{capa_id}/actions/{action_index}")
def get_capa_action(
    capa_id: str,
    action_index: int
):
    capa = capa_collection.find_one(
        {"capa_id": capa_id},
        {"_id": 0}
    )

    if not capa:
        raise HTTPException(
            status_code=404,
            detail="CAPA introuvable."
        )

    actions = capa.get("actions", [])

    if action_index < 0 or action_index >= len(actions):
        raise HTTPException(
            status_code=404,
            detail="Action CAPA introuvable."
        )

    return {
        "capa_id": capa["capa_id"],
        "audit_id": capa.get("audit_id"),
        "created_at": capa.get("created_at"),
        "description_probleme": capa.get(
            "description_probleme"
        ),
        "resume": capa.get("resume"),
        "action_index": action_index,
        "action": actions[action_index]
    }


@capa_router.post("/audit/generate")
def generate_capa(request: auditIdRequest):

    result = app.invoke(
        {
            "messages": [
                HumanMessage(
                    content=(
                        f"Génère CAPA pour "
                        f"la checklist {request.audit_id}"
                    )
                )
            ]
        }
    )
    capa = json.loads(
                result["messages"][-1].content
            )

    existing_capa = capa_collection.find_one(
        {
            "audit_id": request.audit_id
        }
    )

    if existing_capa:
        capa_id = existing_capa["capa_id"]
    else:
        capa_id = (
            f"CAPA-{capa_collection.count_documents({}) + 1:03d}"
        )

    capa_document = {
        "capa_id": capa_id,
        "audit_id": request.audit_id,
        "created_at": datetime.now(timezone.utc),
        **capa
    }
    
    capa_collection.update_one(
        {
            "audit_id": request.audit_id
        },
        {
            "$set": capa_document
        },
        upsert=True
    )

    return {
        "message": "CAPA sauvegardé avec succès.",
        "capa_id": capa_id,
        "audit_id": request.audit_id
    }

@capa_router.get("/audit/{audit_id}")
def get_capa_by_audit(audit_id: str):

    capa = capa_collection.find_one(
        {
            "audit_id": audit_id
        },
        {
            "_id": 0
        }
    )
    if not capa:
        raise HTTPException(
            status_code=404,
            detail="Aucun CAPA trouvé pour cet audit."
        )

    return capa
@capa_router.patch("/{capa_id}/actions/{action_index}/status")
def update_action_status(
    capa_id: str,
    action_index: int,
    request: UpdateActionStatusRequest):

    allowed_statuses = [
        "Ouverte",
        "Terminé",
        "Expiré"
    ]

    if request.statut_action not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Statut invalide."
        )

    capa = capa_collection.find_one(
        {"capa_id": capa_id}
    )

    if not capa:
        raise HTTPException(
            status_code=404,
            detail="CAPA introuvable."
        )

    actions = capa.get("actions", [])

    if action_index < 0 or action_index >= len(actions):
        raise HTTPException(
            status_code=404,
            detail="Action CAPA introuvable."
        )

    capa_collection.update_one(
        {"capa_id": capa_id},
        {
            "$set": {
                f"actions.{action_index}.statut_action":
                    request.statut_action
            }
        }
    )

    return {
        "message": "Statut de l'action mis à jour.",
        "capa_id": capa_id,
        "action_index": action_index,
        "statut_action": request.statut_action
    }


@capa_router.delete("/{capa_id}/actions/{action_index}")
def delete_capa_action(
    capa_id: str,
    action_index: int
):
    capa = capa_collection.find_one({
        "capa_id": capa_id
    })

    if not capa:
        raise HTTPException(
            status_code=404,
            detail="CAPA introuvable."
        )

    actions = capa.get("actions", [])

    if action_index < 0 or action_index >= len(actions):
        raise HTTPException(
            status_code=404,
            detail="Action CAPA introuvable."
        )

    # Supprimer l'action du tableau
    actions.pop(action_index)

    # Mettre à jour MongoDB
    result = capa_collection.update_one(
        {
            "capa_id": capa_id
        },
        {
            "$set": {
                "actions": actions
            }
        }
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=500,
            detail="Impossible de supprimer l'action."
        )

    return {
        "message": "Action supprimée avec succès.",
        "capa_id": capa_id,
        "action_index": action_index
    }