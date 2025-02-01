import uuid
from django.db import models
from agreement.models.agreement import Agreement
from core.models.base import BaseModel


class PaymentStatus(models.TextChoices):
    INITIATED = "INITIATED"
    URL_FAILED = "URL_FAILED"
    URL_SUCCESSFUL = "URL_SUCCESFULL"
    SUCCESSFUL = "SUCCESFUL"
    FAILED = "FAILED"


class Payment(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    link = models.CharField(max_length=500, null=True)
    amount = models.IntegerField()
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE)
    status = models.CharField(
        choices=PaymentStatus, default=PaymentStatus.INITIATED, max_length=40
    )
