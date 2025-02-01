from auth.views import auth_view
from django.urls import path

urlpatterns = [
    path(route="sign-up", view=auth_view.RegisterUser.as_view()),
    path(route="sign-in", view=auth_view.LoginUser.as_view()),
    path(route="self", view=auth_view.GetSelfView.as_view()),
    path(route="sign-out", view=auth_view.LogOutView.as_view()),
]
