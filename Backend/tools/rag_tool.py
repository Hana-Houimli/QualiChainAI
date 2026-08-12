from langchain_core.tools import tool

def create_rag_tool(name, description, vector_db):

    @tool(name, description=description)
    def retrieve_documents(question: str) -> str:

        docs = vector_db.retrieve(question, k=3)

        if not docs:
            return "No relevant documents found."

        return "\n\n".join(doc.page_content for doc in docs)
    return retrieve_documents