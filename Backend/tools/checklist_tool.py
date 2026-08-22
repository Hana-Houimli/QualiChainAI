from pymongo import MongoClient
from langchain.tools import tool


client = MongoClient("mongodb://localhost:27017/")

db = client["qualichainAI"]


@tool
def get_audit_history(
    type_audit: str,
    site_audite: str
):
    """
    Récupère l'historique d'audit nécessaire à la génération
    d'une nouvelle checklist.
    Ces informations servent uniquement de contexte
    pour personnaliser la checklist selon l'historique qualité.
    """


    # 2 - Dernier audit réalisé
    previous_audit = db.audit_reports.find_one(
    {
        "type_audit": {
            "$regex": type_audit,
            "$options": "i"
        },
        "entete.site_audite": {
            "$regex": site_audite,
            "$options": "i"
        }
    },
    {
        "_id": 0,
        "reference_rapport": 1,
        "constats_detailles": 1
    },
    sort=[("entete.date_audit", -1)]
)

    capa = None

    if previous_audit:

        capa = db.CAPA_reports.find_one(
        {
            "reference_audit_associe":
            previous_audit["reference_rapport"]
        },
        {
            "_id":0,
            "actions_correctives.id":1,
            "actions_correctives.criticite":1,
            "actions_correctives.ecart_constate":1,
            "actions_correctives.action_corrective":1,
            "actions_correctives.action_preventive":1,
            "actions_correctives.statut_action":1
        }
    )


    return {
    
    "previous_findings": (
        previous_audit.get("constats_detailles") if previous_audit else []
    ),
    "actions_correctives": (
        capa.get("actions_correctives") if capa else []
    ),
}
