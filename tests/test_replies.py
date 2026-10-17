import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from replies import build_reply, reply_html


def test_french_reply_names_the_company_and_avoids_a_price():
    subject, body = build_reply({
        "lang": "fr",
        "first_name": "Amina",
        "last_name": "Nguema",
        "company": "BatiGabon",
        "service": "appels-offres",
        "service_label": "Appels d'offres et gestion des soumissions",
        "message": "Nous préparons une réponse pour un marché public de construction.",
        "budget": "À déterminer",
        "deadline": "1-3 mois",
    })
    assert "BatiGabon" in body
    assert "Amina" in body
    assert "liste de vérification" in body
    assert "Aucun montant" not in body
    assert "ne confirmons aucun prix" in body
    assert subject.startswith("Votre demande")
    assert "http" not in body


def test_reply_html_keeps_a_single_safe_link():
    html = reply_html("Bonjour,\n\nNous revenons vers vous.\n\nVoir https://bit.ly/secret")
    assert html.count("<a ") == 1
    assert "https://www.exportmondeprestigeinc.com" in html
    assert "bit.ly" not in html
    assert "<form" not in html
