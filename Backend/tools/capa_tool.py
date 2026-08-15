from langchain.tools import tool
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["qualichainAI"]

reports_collection = db["audits_reports"]

@tool
def get_audit_report(checklist_id: str) -> dict:
    """
    Récupère les informations utiles du rapport d'audit
    pour la génération d'un CAPA.
    """

    report = reports_collection.find_one(
        {"checklist_id": checklist_id}
    )

    if not report:
        return {
            "error": f"Aucun rapport trouvé pour {checklist_id}"
        }

    report_data = report.get("report", {})

    return {
        "checklist_id": checklist_id,
        "non_conformites": report_data.get(
            "non_conformites",
            []
        ),
        "observations": report_data.get(
            "observations",
            []
        ),
        "recommandations": report_data.get(
            "recommandations",
            []
        )
    }