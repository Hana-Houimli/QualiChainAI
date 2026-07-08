from langchain_chroma import Chroma

class VectorDB:
    def __init__(self,collection_name, embedding_model, persist_directory):

        self.db = Chroma(collection_name = collection_name,
            persist_directory = persist_directory,
            embedding_function= embedding_model
        ) 

    def add_documents(self,documents):
        self.db.add_documents(documents)

    def search(self, query, k):
        return self.db.similarity_search(query, k)

