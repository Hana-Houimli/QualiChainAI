from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

def ingest_document(vector_db ,file_path,chunk_size, chunk_overlap):

        loader = PyMuPDFLoader(file_path)
        documents = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        chunks = splitter.split_documents(documents)

        vector_db.add_documents(chunks)

        return {
            "message": "Document successfully indexed.",
            "pages": len(documents),
            "chunks": len(chunks)
        }