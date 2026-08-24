from fastapi import APIRouter
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph.workflow import app

analysis_router = APIRouter()


class ChecklistIdRequest(BaseModel):
    checklist_id: str


@analysis_router.post("/analyze")
def analyze_checklist(request: ChecklistIdRequest):

    result = app.invoke(
        {
            "messages": [
                HumanMessage(
                    content=(
                        f"Analyser checklist "
                        f"{request.checklist_id}"
                    )
                )
            ]
        }
    )

    return {
        "analysis":
        result["messages"][-1].content
    }