from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
import rest_framework.status as STATUS
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.pagination import PageNumberPagination
from agreement.serializers import AgreementSerializer
from payment.khalti import UserEntity, get_khalti_url
from payment.models import Payment
from payment.serializers.payment_serializer import PaymentSerializer


class PaymentView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        payment_serialized = PaymentSerializer(data=request.data)

        if not payment_serialized.is_valid():
            return Response(
                payment_serialized.errors, status=STATUS.HTTP_400_BAD_REQUEST
            )

        # TODO(aashutosh): check already stuff

        agreement = payment_serialized.validated_data["agreement"]

        if agreement.applicant != request.user.rentaluser:
            return Response(
                {"message": "You are not authorized to perform this action"},
                STATUS.HTTP_403_FORBIDDEN,
            )

        if agreement.status != "ACCEPTED":
            return Response(
                {
                    "message": "Payment not allowed to initiate on aggrements that has not yet been accepted"
                },
                status=STATUS.HTTP_403_FORBIDDEN,
            )

        payment = Payment.objects.create(
            amount=payment_serialized.validated_data["amount"], agreement=agreement
        )

        data = get_khalti_url(
            amount=payment_serialized.validated_data["amount"],
            uuid=str(payment.id),
            recipeint=UserEntity(
                name=f"{agreement.landlord.user.first_name} {agreement.landlord.user.last_name}",
                email=agreement.landlord.user.email,
                phone=agreement.landlord.phone,
            ),
        )

        if not data:
            Payment.objects.filter(id=payment.id).update(status="URL_FAILED")

            return Response(
                {
                    "message": "Failed to get khalti URL",
                },
                status=STATUS.HTTP_503_SERVICE_UNAVAILABLE,
            )

        Payment.objects.filter(id=payment.id).update(
            status="URL_SUCCESFUL", link=data["payment_url"]
        )

        return Response(data, STATUS.HTTP_202_ACCEPTED)

    def put(self, request: Request, id=None) -> Response:
        if id is None:
            return Response({}, status=STATUS.HTTP_400_BAD_REQUEST)

        status = request.query_params.get("status")

        if not status or status not in ["FAILED", "SUCCESSFUL"]:
            return Response({}, STATUS.HTTP_400_BAD_REQUEST)

        Payment.objects.filter(id=id).update(status=status)

        return Response({}, STATUS.HTTP_202_ACCEPTED)

    def get(self, request: Request) -> Response:
        _as = request.query_params.get("as")

        paginator = PageNumberPagination()

        limit = request.query_params.get("limit")

        if not limit or type(limit) != int:
            limit = 10

        if not _as:
            return Response(
                {"error": "Need the as property!"}, status=STATUS.HTTP_400_BAD_REQUEST
            )

        payments = []
        if _as == "landlord":
            payments = Payment.objects.filter(
                agreement__landlord=request.user.rentaluser
            )
        else:
            payments = Payment.objects.filter(
                agreement__applicant=request.user.rentaluser
            )

        paginated = paginator.paginate_queryset(payments, request)

        serialized = PaymentSerializer(paginated, many=True)

        return paginator.get_paginated_response(serialized.data)
