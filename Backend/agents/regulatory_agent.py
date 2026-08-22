from pathlib import Path
from rag.config import *
from rag import VectorStore
from tools import create_rag_tool , websearch_tool
from prompts import regulatory_prompt
from langchain.agents import create_agent
from langchain_ollama import ChatOllama

BASE_DIR = Path(__file__).resolve().parent.parent

CHROMA_PATH = BASE_DIR / "storage" / "chroma_db"


vectordb_gdp = VectorStore(embedding_model= EMBEDDING_MODEL,collection_name="gdp_documents",persist_directory=CHROMA_PATH)

gdp_research = create_rag_tool(
    name="gdp_research",
    description="""
    Recherche des documents pertinents concernant les Bonnes Pratiques de Distribution (BPD/GDP)
    et les règles de distribution pharmaceutique.
    """,
    vector_db=vectordb_gdp
)




llm = ChatOllama(
            model="qwen3:8b",
            base_url="https://happening-colt-delouse.ngrok-free.dev",
            temperature=0,
            num_predict=1024,
            think=False
    )


regulatory_agent = create_agent(
    model = llm,
    tools=[gdp_research,websearch_tool],
    system_prompt=regulatory_prompt,
    
)