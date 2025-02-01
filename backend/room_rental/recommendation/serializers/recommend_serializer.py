from rest_framework import serializers


class RecommendationRequestSerializer(serializers.Serializer):
    land_area = serializers.FloatField()
    bedrooms = serializers.FloatField()
    bathrooms = serializers.FloatField()
    floors = serializers.FloatField()
    city = serializers.CharField(max_length=100)
    district = serializers.CharField(max_length=100)
    car_parking = serializers.FloatField()

    staying = serializers.IntegerField()
