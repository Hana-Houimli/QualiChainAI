
from pymongo import MongoClient
from langchain_core.tools import tool


# Connexion MongoDB
client = MongoClient(
    "mongodb://localhost:27017"
)

db = client["qualichainAI"]

checklist_collection = db["audit_checklists"]


@tool
def checklist_search(audit_type: str):
    """
    Recherche une checklist d'audit dans MongoDB selon le type d'audit.
    """

    checklist = checklist_collection.find_one(
        {
            "type_audit": {
                "$regex": audit_type,
                "$options": "i"
            }
        }
    )

    if checklist:

        questions = []

        for section in checklist.get("sections", []):

            nom_section = section.get("nom_section", "")

            for point in section.get("points_controle", []):

                questions.append({
                    "question": point.get("question", ""),
                    "criticite": point.get("criticite", "")
                })

        return {
            "success": True,
            "checklist": {
                "type_audit": checklist["type_audit"],
                "questions": questions
                }
            }


    return {
        "success": False,
        "message": f"Aucune checklist trouvée pour le type d'audit: {audit_type}"
    }
