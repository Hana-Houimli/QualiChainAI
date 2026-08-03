from rag.config import *
from rag import VectorStore
from prompts import regulatory_prompt,audit_prompt
from tools import (
    create_rag_tool, websearch_tool,checklist_search
)

from agents.agent import Agent
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

CHROMA_PATH = BASE_DIR / "storage" / "chroma_db"


vectordb_gdp = VectorStore(embedding_model= EMBEDDING_MODEL,collection_name="gdp_documents",persist_directory=CHROMA_PATH)

vectordb_sop = VectorStore(embedding_model=EMBEDDING_MODEL,collection_name="sop_documents",persist_directory=CHROMA_PATH)



# Tools
# GDP Tool
gdp_research = create_rag_tool(
    name="gdp_research",
    description="""
    Recherche des documents pertinents concernant les Bonnes Pratiques de Distribution (BPD/GDP)
    et les règles de distribution pharmaceutique.
    """,
    vector_db=vectordb_gdp
)


# SOP Tool
sop_research = create_rag_tool(
    name="sop_research",
    description="""
    Recherche des procédures opératoires standard (SOP) internes pharmaceutiques.""",
    vector_db=vectordb_sop
)




# Agents

regulatory_agent = Agent(
    tools=[gdp_research,sop_research,websearch_tool],
    system_prompt=regulatory_prompt,
    
)

audit_agent = Agent(tools=[checklist_search],system_prompt=audit_prompt)