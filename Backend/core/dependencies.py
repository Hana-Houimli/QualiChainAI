from rag.config import *
from rag.vector_store import VectorStore
from agents.regulatory_agent.regulatory_prompt import regulatory_prompt 
from agents.regulatory_agent.tools import (
    create_rag_tool, websearch_tool
)

from agents.regulatory_agent.agent import RegulatoryAgent
from langchain_ollama import ChatOllama


vectordb_gdp = VectorStore(embedding_model= EMBEDDING_MODEL,collection_name="gdp_documents",persist_directory="../storage/chroma_db")

vectordb_sop = VectorStore(embedding_model=EMBEDDING_MODEL,collection_name="sop_documents",persist_directory="../storage/chroma_db")



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



llm = ChatOllama(
            model="qwen3:1.7b",
            temperature=0,
            num_predict=512,
            #think= False
        )
# Agents

regulatory_agent = RegulatoryAgent(
    model=llm,
    tools=[gdp_research,sop_research,websearch_tool],
    system_prompt=regulatory_prompt,
    
)