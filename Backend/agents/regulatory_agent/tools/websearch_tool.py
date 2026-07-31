from ddgs import DDGS
from langchain_core.tools import tool
from datetime import datetime
from urllib.parse import urlparse


ALLOWED_DOMAINS = [
    "ema.europa.eu",
    "fda.gov",
    "who.int",
    "ansm.sante.fr"
]


def is_allowed_domain(url: str):
    """
    Vérifie si l'URL appartient à une source réglementaire officielle.
    """
    domain = urlparse(url).netloc.lower()

    return any(
        allowed in domain
        for allowed in ALLOWED_DOMAINS
    )



def web_search(query: str, max_results: int = 5):

    current_year = datetime.now().year

    # Ajouter l'année seulement si elle n'existe pas
    if str(current_year) not in query:
        query = f"{query} {current_year}"


    results = []

    with DDGS() as ddgs:

        search_results = ddgs.text(
            query,
            max_results=max_results
        )


        for r in search_results:

            url = r.get("href", "")

            if not url:
                continue


            if is_allowed_domain(url):

                results.append(
                    {
                        "title": r.get("title"),
                        "url": url,
                        "content": r.get("body")
                    }
                )


    return results


@tool
def websearch_tool(query: str):
    """
    Recherche uniquement les mises à jour réglementaires récentes.

    Ne pas utiliser pour répondre à des questions générales sur les GDP.
    Utiliser uniquement lorsque l'utilisateur demande des nouveautés,
    des changements récents ou des mises à jour.
    Sources :
    EMA, FDA, OMS, ANSM
    Toujours rechercher des documents réglementaires spécifiques,
    pas uniquement les pages d'accueil.
    """

    results = web_search(query)


    if not results:

         return {
            "statut": "aucun_resultat",
            "message": (
                "Aucune mise à jour réglementaire officielle n'a été trouvée "
                "auprès de l'EMA, de la FDA, de l'OMS ou de l'ANSM."
            )
        }


    return {
        "statut": "success",
        "nombre_resultats": len(results),
        "resultats": results
    }