from fastapi import APIRouter
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph.workflow import app

capa_router = APIRouter()


class ChecklistIdRequest(BaseModel):
    checklist_id: str


@capa_router.post("/generate")
def generate_capa(request: ChecklistIdRequest):

    result = app.invoke(
        {
            "messages": [
                HumanMessage(
                    content=(
                        f"Génère CAPA pour "
                        f"la checklist {request.checklist_id}"
                    )
                )
            ]
        }
    )

    return {
        "capa":
        result["messages"][-1].content
    }