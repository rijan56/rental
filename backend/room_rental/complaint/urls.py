
from complaint.views import ComplaintView
from django.urls import  path

urlpatterns = [
    path("", ComplaintView.as_view()),
    path("<int:id>", ComplaintView.as_view())
]