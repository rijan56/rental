from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
    ValidationError,
)

from agreement.models import AgreementModel
from core.templates.templates import AGREEMENT_REQUEST_ARRIVING_TEMPLATE
from core.utils.thread import run_in_thread
from property.models import PropertyModel
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from property.serializers.property_serializer import PropertySerializer


class AgreementSerializer(ModelSerializer):
    property_id = PrimaryKeyRelatedField(
        source="property",
        queryset=PropertyModel.objects.all(),
    )

    # property = PropertySerializer()

    class Meta:
        model = AgreementModel

        fields = [
            "id",
            "property_id",
            "amount",
            "start_date",
            "end_date",
            "message",
            "status",
            # "property",
        ]

        read_only_fields = ["landlord", "applicant", "status", "property"]

    def create(self, validated_data):
        property_obj = validated_data.get("property")

        validated_data["landlord"] = property_obj.owner

        request = self.context.get("request")

        if request and hasattr(request, "user"):
            validated_data["applicant"] = request.user.rentaluser

        if AgreementModel.objects.filter(
            property=property_obj, applicant=request.user.rentaluser, status="APPLIED"
        ).exists():
            raise ValidationError(
                {"error": "You already have an agreement request for this property."}
            )

        print("sending email to : ", property_obj.owner.user.email)

        text_data = AGREEMENT_REQUEST_ARRIVING_TEMPLATE.safe_substitute(
            first_name=property_obj.owner.user.first_name,
            applicant_name=f"{request.user.first_name} {request.user.last_name}",
        )

        email_instance = EmailMultiAlternatives(
            "New Agreement on your property!",
            text_data,
            "Rijan Basnet <rijan.basnet@propertyhub.com>",
            [property_obj.owner.user.email],
        )

        email_html = render_to_string(
            "agreement_request.html",
            context={
                "first_name": property_obj.owner.user.first_name,
                "applicant_name": f"{request.user.first_name} {request.user.last_name}",
            },
        )

        email_instance.attach_alternative(email_html, "text/html")
        run_in_thread(email_instance.send)

        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "property" in validated_data:
            property_obj = validated_data.get("property")
            validated_data["landlord"] = property_obj.landlord

        return super().update(instance, validated_data)
