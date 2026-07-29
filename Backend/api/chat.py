from fastapi import APIRouter
from pydantic import BaseModel

from core.dependencies import regulatory_agent


router = APIRouter(
    prefix="/regulatory",
    tags=["Regulatory"]
)


class QuestionRequest(BaseModel):
    question: str



@router.post("/chat")
def chat(request: QuestionRequest):

    result = regulatory_agent.run(
        request.question
    )

    answer = result["messages"][-1].content

    return {
        "answer": answer
    }