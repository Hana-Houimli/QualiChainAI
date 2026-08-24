from pymongo import MongoClient
from langchain.tools import tool

client = MongoClient("mongodb://localhost:27017/")
db = client["qualichainAI"]


@tool
def get_audit_history(type_audit: str,site_audit: str) -> dict:
    """
    Récupère l'historique d'audit nécessaire à la génération
    d'une nouvelle checklist.
    Ces informations servent uniquement de contexte
    pour personnaliser la checklist selon l'historique qualité.
    """

    report = db.audit_reports.find_one(
        {
            "informations_generales.type_audit": {
                "$regex": type_audit,
                "$options": "i"
            },
            "informations_generales.site_audit": {
                "$regex": site_audit,
                "$options": "i"
            }
        },
        sort=[
            (
                "informations_generales.date_audit",
                -1
            )
        ]
    )

    if not report:
        return {
            "historique_disponible": False
        }

    return {
        "historique_disponible": True,
        "checklist_id": report.get(
            "checklist_id"
        ),
        "non_conformites": report.get(
            "non_conformites",
            []
        ),
        "observations": report.get(
            "observations",
            []
        ),
        "plan_capa": report.get(
            "plan_capa",
            {}
        )
    }
