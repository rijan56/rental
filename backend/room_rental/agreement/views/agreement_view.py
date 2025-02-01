from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from agreement.models import AgreementModel
from agreement.models.agreement import Agreement
from agreement.serializers import AgreementSerializer


class AgreementView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        if request.user and request.user.rentaluser.user_type == "landlord":
            return Response(
                {"error": "Landlords cannot send agreement reqeusts"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = AgreementSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request: Request, id=None) -> Response:
        agreement_status = request.query_params.get("status")
        agreement_id = id

        if not agreement_status or agreement_status not in [
            "ACCEPTED",
            "REJECTED",
            "APPLIED",
        ]:
            return Response(
                {"error": "Status cannot be that"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not agreement_id or not agreement_status:
            return Response(
                {"error": "Need property_id and property_status"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.user and request.user.rentaluser.user_type == "tenant":
            return Response(
                {
                    "error": "You are not authorized to this action",
                },
                status.HTTP_403_FORBIDDEN,
            )

        agreement = AgreementModel.objects.filter(id=agreement_id).first()

        if not agreement:
            return Response(
                {
                    "error": "Agreement Not Found!",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if agreement.landlord.user != request.user:
            return Response(
                {"error": "YOu are not authorized to perform this action"},
                status.HTTP_403_FORBIDDEN,
            )

        AgreementModel.objects.filter(id=agreement_id).update(status=agreement_status)

        return Response(
            {
                "message": "Successfully Updated",
            },
            status=status.HTTP_202_ACCEPTED,
        )

    def get(self, request: Request, id=None):
        _as = request.query_params.get("as")
        property_id = request.query_params.get("property_id")
        paginator = PageNumberPagination()

        limit = request.query_params.get("limit")

        if not limit or type(limit) != int:
            limit = 10

        if not _as:
            return Response(
                {"error": "Need the as property!"}, status=status.HTTP_400_BAD_REQUEST
            )

        if property_id:
            agreements_with_property = Agreement.objects.filter(
                property_id=property_id, landlord=request.user.rentaluser
            ).order_by("-created_at")

            paginated_agreements = paginator.paginate_queryset(
                agreements_with_property, request
            )

            serialized_agreements = AgreementSerializer(paginated_agreements, many=True)

            return paginator.get_paginated_response(serialized_agreements.data)

        if id:
            agreement = (
                Agreement.objects.filter(id=id, landlord=request.user.rentaluser)
                .select_related("property")
                .last()
            )

            serialized = AgreementSerializer(agreement)

            return Response(serialized.data, status=status.HTTP_200_OK)

        paginator.page_size = limit

        agreements = []

        if _as == "landlord":
            agreements = Agreement.objects.filter(
                landlord=request.user.rentaluser
            ).select_related("property")
        else:
            agreements = Agreement.objects.filter(
                applicant=request.user.rentaluser
            ).select_related("property")

        paginated = paginator.paginate_queryset(agreements, request)

        serialized = AgreementSerializer(paginated, many=True)

        return paginator.get_paginated_response(serialized.data)
