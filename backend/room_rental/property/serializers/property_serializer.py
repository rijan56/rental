from property.models import ImageModel as Image
from property.models import (
    PropertyModel as Property,
)  # Ensure these are imported correctly
from rest_framework import serializers


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["id", "file"]


class PropertySerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Property
        fields = [
            # "owner",
            "id",
            "title",
            "description",
            "type",
            "address",
            "location",
            "price",
            "thumbnail",
            "area",
            "bedrooms_count",
            "bathrooms_count",
            "can_accomodate",
            "facts",
            "images",
            "uploaded_images",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["owner"] = request.user.rentaluser

        uploaded_images = validated_data.pop("uploaded_images", [])
        property_instance = Property.objects.create(**validated_data)

        # Save images
        for image in uploaded_images:
            Image.objects.create(file=image, property=property_instance)

        return property_instance
