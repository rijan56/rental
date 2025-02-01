import json
import requests
from dataclasses import dataclass


FRONTEND_URL = "http://localhost:5173"


@dataclass
class UserEntity:
    name: str
    email: str
    phone: str


class Config:
    secret_key = "a72bd087765240b5bc3d0cd716c51e22"
    public_key = "a4240dd9255f4c50b91101dd0b8df578"
    end_point = "https://dev.khalti.com/api/v2/epayment/initiate/"
    tax = 1300


def get_khalti_url(
    amount: int, uuid: str, recipeint: UserEntity
) -> dict[str, str | int] | None:
    amount_in_paisa = amount * 100

    data = {
        "return_url": f"{FRONTEND_URL}/payment/verdict/{uuid}",
        "website_url": f"{FRONTEND_URL}",
        "amount": str((amount_in_paisa) + Config.tax),  # amount in paisa
        "purchase_order_id": f"rent_payment_{uuid}",
        "purchase_order_name": f"Rent Payment @ PropertyHub",
        "customer_info": {
            "name": recipeint.name,
            "email": recipeint.email,
            "phone": recipeint.phone,
        },
        "amount_breakdown": [
            {"label": "Rent Amount", "amount": amount_in_paisa},
            {"label": "PropertyHub Tax", "amount": Config.tax},
        ],
    }

    headers = {
        "Authorization": f"key {Config.secret_key}",
        "Content-Type": "application/json",
    }

    response = requests.post(Config.end_point, headers=headers, data=json.dumps(data))

    if response.ok:
        success = response.json()
        return success

    return None
