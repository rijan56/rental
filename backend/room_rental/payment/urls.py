from django.urls import path
from payment.views import PaymentView

urlpatterns = [
    path("", PaymentView.as_view(), name="payment-initiate"),
    path("<str:id>", PaymentView.as_view(), name="set-payment-verdict"),
]
