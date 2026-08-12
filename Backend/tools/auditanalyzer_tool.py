from bson import ObjectId
from pymongo import MongoClient
from langchain.tools import tool


client = MongoClient("mongodb://localhost:27017/")

db = client["qualichainAI"]
checklists_collection = db["audit_checklists"]

@tool
def analyze_checklist(checklist_id: str) -> dict:
    """
    Récupère une checklist d'audit remplie depuis MongoDB
    et calcule les indicateurs de conformité.
    """

    # Récupérer la checklist depuis MongoDB
    checklist = checklists_collection.find_one(
    {"checklist_id": checklist_id},
    {"_id": 0}
)
    if not checklist:
        return {
            "error": "Checklist introuvable."
        }

    conformes = 0
    non_conformes = 0
    partiellement_conformes = 0
    non_applicables = 0

    # Parcourir les sections
    for section in checklist.get("sections", []):

        # Parcourir les points de contrôle
        for point in section.get("points_controle", []):

            resultat = point.get("resultat")

            if not resultat:
                continue

            resultat = resultat.strip().lower()

            if resultat == "conforme":
                conformes += 1

            elif resultat == "non conforme":
                non_conformes += 1

            elif resultat == "partiellement conforme":
                partiellement_conformes += 1

            elif resultat == "non applicable":
                non_applicables += 1

    # Nombre de points évaluables
    total_points = (
        conformes
        + non_conformes
        + partiellement_conformes
    )

    # Calcul du score
    if total_points > 0:
        score_conformite = round(
            (
                conformes
                + 0.5 * partiellement_conformes
            )
            / total_points
            * 100,
            2
        )
    else:
        score_conformite = 0

    # Déterminer le statut global
    if score_conformite >= 90:
        statut_global = "Conforme"

    elif score_conformite >= 70:
        statut_global = "Conforme avec observations"

    else:
        statut_global = "Non conforme"
    return {
    "checklist": checklist,
    "score_conformite": score_conformite,
    "statut_global": statut_global,
    "resume": {
        "total_points": total_points,
        "conformes": conformes,
        "non_conformes": non_conformes,
        "partiellement_conformes": partiellement_conformes,
        "non_applicables": non_applicables
    }
}