from langchain_core.tools import tool

def create_rag_tool(name, description, vector_db):

    @tool(name, description=description)
    def retrieve_documents(question: str) -> str:

        docs = vector_db.retrieve(question, k=3)

        if not docs:
            return "No relevant documents found."

        sources = [
            {
                "content": doc.page_content,
                "source": doc.metadata.get("source", "Source inconnue")
            }
            for doc in docs
        ]

        return "\n\n".join(
            f"SOURCE: {item['source']}\n"
            f"CONTENT:\n{item['content']}"
            for item in sources
        )

    return retrieve_documents