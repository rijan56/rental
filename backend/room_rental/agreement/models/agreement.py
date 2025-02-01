from django.db import models
from core.models.base import BaseModel
from property.models import PropertyModel
from core.models import RentalUser


class AgreementStatus(models.TextChoices):
    APPLIED = "APPLIED"
    ACCEPTED = "ACCEPTED"
    REJECETED = "REJECTED"


class Agreement(BaseModel):
    property = models.ForeignKey(PropertyModel, on_delete=models.CASCADE)
    landlord = models.ForeignKey(
        RentalUser, on_delete=models.CASCADE, related_name="agreements_as_landlord"
    )
    applicant = models.ForeignKey(
        RentalUser, on_delete=models.CASCADE, related_name="agreements_as_applicant"
    )
    amount = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    message = models.CharField(max_length=200)
    status = models.CharField(
        choices=AgreementStatus, default=AgreementStatus.APPLIED, max_length=30
    )
