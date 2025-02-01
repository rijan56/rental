from core.permissions import IsLandLord
from django.shortcuts import get_object_or_404
from property.models.property import Property
from property.serializers.property_serializer import PropertySerializer
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.request import Request


class PropertyView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [
            IsAuthenticated(),
            IsLandLord(),
        ]

    def post(self, request: Request):
        serializer = PropertySerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request: Request, id=None):
        _as = request.query_params.get("as")

        if id:
            property_instance = get_object_or_404(Property, id=id)
            serialized = PropertySerializer(property_instance)
            return Response(serialized.data, status=status.HTTP_200_OK)

        if not _as:
            return Response("as is required", status=status.HTTP_400_BAD_REQUEST)

        paginator = PageNumberPagination()

        if request.query_params.get("limit"):
            paginator.page_size = int(request.GET.get("limit"))

        if _as == "self":
            properties = Property.objects.filter(
                owner=request.user.rentaluser
            ).order_by("-created_at")
        else:
            properties = Property.objects.all()

        paginated_properties = paginator.paginate_queryset(properties, request)

        serialized = PropertySerializer(paginated_properties, many=True)

        return paginator.get_paginated_response(serialized.data)

    def put(self, request, id):
        property_instance = get_object_or_404(Property, id=id)

        serializer = PropertySerializer(
            property_instance,
            data=request.data,
            context={"request": request},
            partial=False,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        property_instance = get_object_or_404(Property, id=id)

        serializer = PropertySerializer(
            property_instance,
            data=request.data,
            context={"request": request},
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        property_instance = get_object_or_404(Property, id=id)

        property_instance.delete()

        return Response(
            {"message": "Property deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )
