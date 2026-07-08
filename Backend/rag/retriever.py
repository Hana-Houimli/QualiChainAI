

class Retriever:
    def __init__(self, vector_db, k ):
        self.retriever = vector_db.db.as_retriever(search_type = "similarity", search_kwargs={"k": k})
    
    def retrieve(self, query):
        return self.retriever.invoke(query)