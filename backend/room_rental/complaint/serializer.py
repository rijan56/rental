from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
)
from agreement.models.agreement import Agreement
from complaint.models import Complaint


class ComplaintSerializer(ModelSerializer):
    agreement_id = PrimaryKeyRelatedField(
        source="agreement", queryset=Agreement.objects.all()
    )

    class Meta:
        model = Complaint

        fields = ["title", "description", "agreement_id", "id"]

        read_only_fields = ["agreement", "status", "resolved_at"]
