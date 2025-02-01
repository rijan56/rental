from string import Template
import rest_framework.status as status
from core.models import RentalUser
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from core.templates.templates import REGISTRATION_TEMPLATE
from core.utils.thread import run_in_thread


class RegisterUser(APIView):
    def post(self, request: Request):
        username: str = request.data.get("username")
        first_name: str = request.data.get("first_name")
        last_name: str = request.data.get("last_name")
        email: str = request.data.get("email")
        password: str = request.data.get("password")
        phone: str = request.data.get("phone")
        user_type: str = request.data.get("type")

        if not user_type:
            user_type = "tenant"

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )

            user.save()

        except IntegrityError as e:
            return Response(
                {"error": "Resource Already Exists!", "detail": str(e)},
                status=status.HTTP_409_CONFLICT,
            )

        ru = RentalUser.objects.create(user=user, phone=phone, user_type=user_type)

        ru.save()

        text_data = REGISTRATION_TEMPLATE.substitute(
            first_name=f"{first_name} {last_name}"
        )

        email_instance = EmailMultiAlternatives(
            "Welcome to PropertyHub!",
            text_data,
            "Rijan Basnet <hello@propertyhub.com>",
            [email],
        )

        email_html = render_to_string(
            "register.html", context={"first_name": first_name}
        )

        email_instance.attach_alternative(email_html, "text/html")

        run_in_thread(email_instance.send)

        return Response(
            {
                "message": "Entity Created",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginUser(APIView):
    def post(self, request: Request):
        username: str = request.data.get("username")
        password: str = request.data.get("password")
        type: str = request.data.get("type")

        if type != "landlord":
            type = "tenant"

        user = authenticate(username=username, password=password)

        if not user:
            return Response({"message": "Invalid Credentials"}, status=409)

        if user.rentaluser.user_type != type:
            return Response({"message": f"Invalid Account Type {type}"}, status=409)

        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {"token": token.key, "success": True, "created": created},
            status=status.HTTP_200_OK,
        )


class GetSelfView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # user = User.objects.get(username=request.user)

        content = {
            "user": {
                "email": request.user.email,
                "type": request.user.rentaluser.user_type,
                "phone": request.user.rentaluser.phone,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
                "created_at": request.user.rentaluser.created_at,
            },
            "auth": str(request.auth),
        }

        return Response(content, status=status.HTTP_200_OK)


class LogOutView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        token = Token.objects.get(user=request.user)
        token.delete()
        return Response({}, status=status.HTTP_200_OK)
