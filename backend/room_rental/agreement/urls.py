from django.urls import path
from agreement.views import AgreementView

urlpatterns = [
    path("", AgreementView.as_view()),
    path("<int:id>", AgreementView.as_view()),
]
