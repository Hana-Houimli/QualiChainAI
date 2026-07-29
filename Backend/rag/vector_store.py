from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

class VectorStore:
    def __init__(self,embedding_model,collection_name, persist_directory):
        self.embedding = HuggingFaceEmbeddings(model_name=embedding_model)
        self.db = Chroma(collection_name = collection_name,
            persist_directory = persist_directory,
            embedding_function= self.embedding
        ) 

    def add_documents(self,documents):
        self.db.add_documents(documents)

    def retrieve(self, query,k):
        retriever = self.db.as_retriever(search_type = "similarity", search_kwargs={"k": k})
        return retriever.invoke(query)


