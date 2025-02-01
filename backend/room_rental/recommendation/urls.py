from django.urls import path
from recommendation.views import RecommendationView

urlpatterns = [
    path("predict", RecommendationView.as_view(), name="property-detail"),
]
