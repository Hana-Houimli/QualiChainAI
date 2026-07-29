from rag.config import *
from rag.vector_store import VectorStore
from rag.generator import Generator
from rag.RAGPipeline import RAGPipeline
from rag.gdp_prompt import gdp_prompt
from rag.sop_prompt import sop_prompt
from rag.remote_llm import RemoteLLM


from agents.regulatory_agent.regulatory_prompt import regulatory_prompt 
from agents.regulatory_agent.tools import (
    create_rag_tool, regulatory_watch
)

from agents.regulatory_agent.agent import RegulatoryAgent
from langchain_ollama import ChatOllama


vectordb_gdp = VectorStore(embedding_model= EMBEDDING_MODEL,collection_name="gdp_documents",persist_directory="../storage/chroma_db")

vectordb_sop = VectorStore(embedding_model=EMBEDDING_MODEL,collection_name="sop_documents",persist_directory="../storage/chroma_db")


remote_llm = RemoteLLM(
    "https://happening-colt-delouse.ngrok-free.dev/generate"
)

generator = Generator(
    remote_llm
)

#generator = Generator(model_name="qwen3:1.7b",temperature=0.2,max_new_tokens=512)
rag_pipeline_gdp = RAGPipeline(vectordb_gdp,generator,gdp_prompt)

rag_pipeline_sop = RAGPipeline(vectordb_sop,generator,sop_prompt)


# Tools
# GDP Tool
gdp_research = create_rag_tool(
    name="gdp_research",
    description="""
    Search and answer questions related to Good Distribution Practices (GDP/BPD) and pharmaceutical distribution rules.
    """,
    rag_pipeline=rag_pipeline_gdp
)


# SOP Tool
sop_research = create_rag_tool(
    name="sop_research",
    description="""
    Search internal pharmaceutical Standard Operating Procedures (SOPs).
    """,
    rag_pipeline=rag_pipeline_sop
)



llm = ChatOllama(
            model="qwen3:1.7b",
            temperature=0.2,
            num_predict=512,
        )
# Agent
regulatory_agent = RegulatoryAgent(
    model=llm,
    tools=[gdp_research,sop_research,regulatory_watch],
    system_prompt=regulatory_prompt
)