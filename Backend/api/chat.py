from fastapi import APIRouter
from pymongo import MongoClient
from langchain_core.messages import HumanMessage, AIMessage
from agents import regulatory_agent
from pydantic import BaseModel
from datetime import datetime

chat_router = APIRouter()

client = MongoClient("mongodb://localhost:27017")
db = client["qualichainAI"]
chat_collection = db["chat_histories"]


class QuestionRequest(BaseModel):
    question: str
    conversation_id: str


@chat_router.post("/chat")
def chat(request: QuestionRequest):

    conversation = chat_collection.find_one(
        {"conversation_id": request.conversation_id}
    )

    if not conversation:
        conversation = {
            "conversation_id": request.conversation_id,
            "title": request.question[:50],
            "created_at": datetime.utcnow(),
            "messages": [],
            "updated_at": datetime.utcnow(),
        }

        chat_collection.insert_one(conversation)

    messages = []

    # Derniers 20 messages pour éviter un contexte trop grand
    history = conversation["messages"][-5:]

    for msg in history:
        if msg["role"] == "user":
            messages.append(
                HumanMessage(content=msg["content"])
            )
        else:
            messages.append(
                AIMessage(content=msg["content"])
            )

    messages.append(
        HumanMessage(content=request.question)
    )

    result = regulatory_agent.invoke(
        {
            "messages": messages
        }
    )

    answer = result["messages"][-1].content

    chat_collection.update_one(
        {"conversation_id": request.conversation_id},
        {
            "$push": {
                "messages": {
                    "$each": [
                        {
                            "role": "user",
                            "content": request.question,
                            "timestamp": datetime.utcnow()
                        },
                        {
                            "role": "assistant",
                            "content": answer,
                            "timestamp": datetime.utcnow()
                        }
                    ]
                }
            },
            "$set": {
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {
        "answer": answer
    }


@chat_router.get("/conversations/{conversation_id}")
def get_chat(conversation_id: str):

    conversation = chat_collection.find_one(
        {"conversation_id": conversation_id},
        {"_id": 0}
    )

    return conversation


@chat_router.get("/conversations")
def get_conversations():

    conversations = list(
        chat_collection.find(
            {},
            {
                "_id": 0,
                "conversation_id": 1,
                "title": 1
            }
        ).sort("updated_at", -1)
    )

    return conversations


@chat_router.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: str):

    result = chat_collection.delete_one(
        {"conversation_id": conversation_id}
    )

    if result.deleted_count == 0:
        return {"message": "Conversation introuvable"}

    return {"message": "Conversation supprimée avec succès"}