from langchain_core.tools import tool


def create_rag_tool(name, description, rag_pipeline):

    @tool(name, description=description)
    def search_tool(question: str):

        response = rag_pipeline.answer(
            k=5,
            question=question
        )

        return response["answer"]

    return search_tool