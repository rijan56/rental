from django.contrib.auth.models import User
from django.db import models

from .base import BaseModel


class RentalUserTypes(models.TextChoices):
    TENANT = "tenant"
    LANDLORD = "landlord"


class RentalUser(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    user_type = models.CharField(
        max_length=10, choices=RentalUserTypes.choices, default=RentalUserTypes.TENANT
    )

    phone = models.CharField(max_length=13)
