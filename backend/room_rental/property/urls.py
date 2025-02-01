from django.urls import path
from property.views import PropertyView

urlpatterns = [
    path("", PropertyView.as_view()),
    path("<int:id>", PropertyView.as_view(), name="property-detail"),
]
