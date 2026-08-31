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
        "audit": {
                "informations_generales": {
                    "type_audit": audit.get("type_audit"),
                    "site_audit": audit.get("site_audit"),
                    "date_audit": audit.get("date_audit").strftime("%d/%m/%Y"),
                    "responsable": audit.get("responsable")
                },
                "analysis": audit.get("analysis")
            },
        "plan_capa": capa.get("actions", []) if capa else []
    }

    return {
        "error": f"Type de rapport non supporté : {report_type}"
    }