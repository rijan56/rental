from core.models import RentalUser
from rest_framework.serializers import ModelSerializer


class RentalUserSerializer(ModelSerializer):
    class Meta:
        model = RentalUser

        fields = ["user_type", "number"]
