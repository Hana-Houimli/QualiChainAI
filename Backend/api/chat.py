from fastapi import APIRouter
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from graph.workflow import app
from agents import regulatory_agent

chat_router = APIRouter()


class QuestionRequest(BaseModel):
    question: str



@chat_router.post("/chat")
def chat(request: QuestionRequest):

    result = regulatory_agent.invoke(
    {
        "messages":[
            HumanMessage(
                content=request.question
            )
        ]
    }
)

    answer = result["messages"][-1].content

    return {
        "answer": answer
    }