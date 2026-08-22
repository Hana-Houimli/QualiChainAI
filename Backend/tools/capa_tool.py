from langchain.tools import tool
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["qualichainAI"]

checklist_collection = db["audit_checklists"]

@tool
def get_nonconformities(checklist_id: str) -> dict:
    """
    Récupère toutes les non-conformités d'une checklist d'audit.
    """

    checklist = checklist_collection.find_one(
        {"checklist_id": checklist_id}
    )

    if not checklist:
        return {
            "error": f"Aucune checklist trouvée pour {checklist_id}"
        }

    non_conformites = []

    for section in checklist.get("sections", []):

        for point in section.get("points_controle", []):

            if point.get("resultat") == "Non conforme":

                non_conformites.append(
                    {
                        "section": section["nom_section"],
                        "question": point["question"],
                        "criticite": point["criticite"],
                        "commentaire": point.get(
                            "commentaire",
                            ""
                        )
                    }
                )

    return {
        "non_conformites": non_conformites
    }