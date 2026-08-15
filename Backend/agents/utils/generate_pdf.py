import os

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)

from reportlab.lib.pagesizes import A4


# ==========================================================
# RECURSIVE RENDER
# ==========================================================

def render_data(
    elements,
    data,
    styles,
    level=0
):

    for key, value in data.items():

        if key == "_id":
            continue

        title = key.replace(
            "_",
            " "
        ).title()

        # =====================================
        # DICTIONNAIRE
        # =====================================

        if isinstance(value, dict):

            elements.append(
                Paragraph(
                    title,
                    styles["Heading2"]
                )
            )

            elements.append(
                Spacer(1, 5)
            )

            render_data(
                elements,
                value,
                styles,
                level + 1
            )

            elements.append(
                Spacer(1, 10)
            )

        # =====================================
        # LISTE
        # =====================================

        elif isinstance(value, list):

            elements.append(
                Paragraph(
                    title,
                    styles["Heading2"]
                )
            )

            elements.append(
                Spacer(1, 5)
            )

            for item in value:

                if isinstance(item, dict):

                    render_data(
                        elements,
                        item,
                        styles,
                        level + 1
                    )

                else:

                    elements.append(
                        Paragraph(
                            f"• {item}",
                            styles["Normal"]
                        )
                    )

                elements.append(
                    Spacer(1, 3)
                )

            elements.append(
                Spacer(1, 10)
            )

        # =====================================
        # VALEUR SIMPLE
        # =====================================

        else:

            elements.append(
                Paragraph(
                    f"<b>{title} :</b> {value}",
                    styles["Normal"]
                )
            )

            elements.append(
                Spacer(1, 3)
            )


# ==========================================================
# GENERATE PDF
# ==========================================================

def generate_pdf(
    data: dict,
    output_file: str,
    title: str = "Rapport"
):

    os.makedirs(
        os.path.dirname(output_file),
        exist_ok=True
    )

    doc = SimpleDocTemplate(
        output_file,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    elements = []

    # =====================================
    # TITRE
    # =====================================

    elements.append(
        Paragraph(
            title,
            styles["Title"]
        )
    )

    elements.append(
        Spacer(1, 20)
    )

    # =====================================
    # CONTENU
    # =====================================

    render_data(
        elements,
        data,
        styles
    )

    # =====================================
    # BUILD PDF
    # =====================================

    doc.build(elements)

    return output_file