from datetime import datetime

def checklist_format(checklist):

    sections = []

    for section in checklist["sections"]:

        points = []

        for point in section["points_controle"]:

            points.append({
                "question": point["question"],
                "criticite": point["criticite"],
                "preuve_attendue": point["preuve_attendue"],

                "resultat": "",
                "commentaire": ""
            })

        sections.append({
            "nom_section": section["nom_section"],
            "points_controle": points
        })

    return {
        "type_audit": checklist["type_audit"],
        "site_audit": checklist["site_audit"],
        "date_creation": datetime.today().strftime("%Y-%m-%d"),
        "date_audit": "",
        "status": "en cours",
        "responsable": "",
        "sections": sections
    }