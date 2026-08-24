from fastapi import APIRouter
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph.workflow import app

report_router = APIRouter()


class ChecklistIdRequest(BaseModel):
    checklist_id: str


@report_router.post("/generate")
def generate_report(request: ChecklistIdRequest):

    result = app.invoke(
        {
            "messages": [
                HumanMessage(
                    content=(
                        f"Génère un rapport "
                        f"pour la checklist "
                        f"{request.checklist_id}"
                    )
                )
            ]
        }
    )

    return {
        "report":
        result["messages"][-1].content
    }