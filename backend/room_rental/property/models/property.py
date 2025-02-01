import core.models as core_models
from django.db import models

from core.models.base import BaseModel


class PropertyType(models.TextChoices):
    APARTMENT = "APARTMENT"
    HOUSE = "HOUSE"


class PropertyLocation(models.TextChoices):
    KATHMANDU = "KATHMANDU"
    BHAKTAPUR = "BHAKTAPUR"
    LALITPUR = "LALITPUR"


class Property(BaseModel):
    owner = models.ForeignKey(
        core_models.RentalUser, on_delete=models.CASCADE, related_name="properties"
    )
    description = models.TextField()

    type = models.CharField(
        choices=PropertyType, default=PropertyType.APARTMENT, max_length=10
    )

    title = models.CharField(max_length=255)
    address = models.TextField()

    location = models.CharField(
        choices=PropertyLocation, default=PropertyLocation.KATHMANDU, max_length=15
    )

    price = models.BigIntegerField()

    thumbnail = models.ImageField(upload_to="thumbnail/")

    area = models.IntegerField()

    bedrooms_count = models.IntegerField()
    bathrooms_count = models.IntegerField()

    can_accomodate = models.IntegerField()

    facts = models.JSONField()  # type: ignore
