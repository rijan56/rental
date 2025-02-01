from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from agreement.models.agreement import Agreement
from payment.models import Payment


class PaymentSerializer(ModelSerializer):
    agreement_id = PrimaryKeyRelatedField(
        source="agreement", queryset=Agreement.objects.all()
    )

    class Meta:
        model = Payment

        fields = ["id", "amount", "agreement_id"]

        read_only_fields = ["agreement", "link", "is_successful"]
