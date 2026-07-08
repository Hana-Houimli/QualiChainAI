from retriever import Retriever
from prompt_builder import build_prompt
from generator import Generator

class RAGPipeline:
    def __init__(self, retriever: Retriever, generator: Generator):
        self.retriever = retriever
        self.generator = generator
    
    def answer(self, question):
        retrieved_docs = self.retriever.retrieve(question)
        context = "\n".join([doc.page_content for doc in retrieved_docs])
        prompt = build_prompt(question, context)
        answer = self.generator.generate(prompt)
        sources = [{
                "source": doc.metadata.get("source"),
                "page": doc.metadata.get("page")}for doc in retrieved_docs
        ]
        return {
            "answer": answer,
            "sources": sources
        }