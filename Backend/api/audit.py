import json
from fastapi import APIRouter
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph.workflow import app
from agents.utils.checklist_format import checklist_format
import json

from pymongo import MongoClient
client = MongoClient("mongodb://localhost:27017")

db = client["qualichainAI"]

checklists_collection = db["audit_checklists"]


audit_router = APIRouter(
    prefix="/audit",
    tags=["Audit"]
)


class AuditRequest(BaseModel):
    type_audit: str
    site_audit: str


@audit_router.post("")
def audit(request: AuditRequest):
    result = app.invoke({
        "messages": [
            HumanMessage(
                content=f"Génère une checklist pour un audit de type {request.type_audit} pour le site {request.site_audit}"
            )
        ]
    })

    answer =  checklist_format(json.loads(result["messages"][-1].content))
    checklist_id = f"CHK-{checklists_collection.count_documents({}) + 1:03d}"
    checklist = {"checklist_id": checklist_id,
                **checklist}
    checklists_collection.insert_one(checklist)


    