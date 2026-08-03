from datetime import datetime


def checklist_format(checklist):

    return {
        "type_audit": checklist["type_audit"],
        "date_creation": datetime.today().strftime("%Y-%m-%d"),
        "date_audit": "",
        "status": "en cours",
        "responsable": "",
        
        "questions": [
            {
                "question": q["question"],
                "criticite": q["criticite"],
                "statut_conformite": "",
                "commentaire_auditeur": ""
            }
            for q in checklist["questions"]
        ]
    }