from django.db import models
from agreement.models.agreement import Agreement
from core.models.base import BaseModel


class ComplaintStatus(models.TextChoices):
    SUBMITTED = "SUBMITTED"
    RESLOVED = "RESOLVED"


class Complaint(BaseModel):
    id = models.AutoField(primary_key=True)

    agreement = models.ForeignKey(
        Agreement, on_delete=models.CASCADE, related_name="complaints"
    )

    title = models.CharField(max_length=255)
    description = models.TextField()

    status = models.CharField(
        choices=ComplaintStatus, default=ComplaintStatus.SUBMITTED, max_length=30
    )

    resolution_notes = models.TextField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
