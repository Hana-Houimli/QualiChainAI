from fastapi import APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph.workflow import app
import json
from pymongo import MongoClient
import os
from utils.generate_pdf import generate_pdf


report_router = APIRouter()
client = MongoClient("mongodb://localhost:27017/")

db = client["qualichainAI"]
audits_collection = db["audit_checklists"]
reports_collection = db["audit_reports"]

PDF_DIR = "generated_reports"

os.makedirs(
    PDF_DIR,
    exist_ok=True
)


class ChecklistIdRequest(BaseModel):
    audit_id: str


@report_router.post("/generate")
def generate_report(request: ChecklistIdRequest):

    result = app.invoke(
        {
            "messages": [
                HumanMessage(
                    content=f"Génère un rapport pour l'audit {request.audit_id}"
                )
            ]
        }
    )


    report = json.loads(result["messages"][-1].content)
    existing_report = reports_collection.find_one(
        {
            "audit_id": request.audit_id
        }
    )

    if existing_report:
        report_id = existing_report["report_id"]
    else:
        report_id = (
            f"REP-{reports_collection.count_documents({}) + 1:03d}"
        )

    report_document = {
        "report_id": report_id,
        "audit_id": request.audit_id,
        **report
    }
    
    reports_collection.update_one(
        {
            "audit_id": request.audit_id
        },
        {
            "$set": report_document
        },
        upsert=True
    )

    audits_collection.update_one(
        {
            "audit_id": request.audit_id
        },
        {
            "$set": {
                "status": "Terminé"
            }
        }
    )


    
    return {
        "message": "Rapport généré et sauvegardé avec succès.",
        "report_id": report_id,
        "audit_id": request.audit_id,
        "status": "Terminé"
    }

@report_router.get("/")
def get_all_reports():

    reports = list(
        reports_collection.find(
            {},
            {
                "_id": 0,
                "report_id": 1,
                "audit_id": 1,
                "titre": 1

            }
        ).sort(
            "report_id",
            -1
        )
    )
    
    

    return reports


@report_router.get("/pdf/report/{report_id}")
def download_report_pdf(report_id: str):

    report = reports_collection.find_one(
        {
            "report_id": report_id
        },
        {
            "_id": 0
        }
    )

    filename = f"{report_id}.pdf"

    output_file = os.path.join(
        PDF_DIR,
        filename
    )

    generate_pdf(
        data=report,
        output_file=output_file,
        title=report.get(
            "titre",
            f"Rapport {report_id}"
        )
    )

    return FileResponse(
        path=output_file,
        media_type="application/pdf",
        filename=filename
    )