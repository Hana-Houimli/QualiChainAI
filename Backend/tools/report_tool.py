from bson import ObjectId
from pymongo import MongoClient
from langchain.tools import tool

client = MongoClient("mongodb://localhost:27017/")

db = client["qualichainAI"]
audit_checklists_collection = db["audit_checklists"]
capa_collection = db["capa_plans"]

@tool
def get_report_data(entity_id: str, report_type: str) -> dict:
    """
    Récupère les données nécessaires à la génération d'un rapport.
    """
    if report_type == "audit":

        audit = audit_checklists_collection.find_one(
            {"checklist_id": entity_id},
            {"_id": 0}
        )

        if not audit:
            return {
                "error": "Audit introuvable."
            }

        capa = capa_collection.find_one(
        {
            "checklist_id": entity_id
        },
        {
            "_id": 0
        }
    )

        return {
        "checklist_id": entity_id,
        "audit": audit,
        "capa": capa
    }

    return {
        "error": f"Type de rapport non supporté : {report_type}"
    }