from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
import rest_framework.status as STATUS
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.pagination import PageNumberPagination
from complaint.models import Complaint
from complaint.serializer import ComplaintSerializer


class ComplaintView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        complaint_serializer = ComplaintSerializer(data=request.data)

        if complaint_serializer.is_valid():
            complaint_serializer.save()
            return Response({}, STATUS.HTTP_201_CREATED)

        return Response(complaint_serializer.errors, STATUS.HTTP_400_BAD_REQUEST)

    def get(self, request: Request) -> Response:
        _as = request.query_params.get("as")
        limit = request.query_params.get("limit")

        if not limit or type(limit) != int :
            limit = 10

        complaints = None

        if _as == "landlord":
            complaints = Complaint.objects.filter(
                agreement__landlord=request.user.rentaluser, status="SUBMITTED"
            ).order_by("-created_at")
        else:
            complaints = Complaint.objects.filter(
                agreement__applicant=request.user.rentaluser
            ).order_by("-created_at")

        paginator = PageNumberPagination()

        paginated_complaints = paginator.paginate_queryset(complaints, request)

        serialized_complaints = ComplaintSerializer(paginated_complaints, many=True)

        return paginator.get_paginated_response(serialized_complaints.data)
    

    def put(self, request: Request, id: None) -> Response:

        status = request.query_params.get("status")


        if not id or not status or status not in ["RESOLVED", "SUBMITTED"]:

            return Response({
                "message": "status and id required",
            }, status=STATUS.HTTP_400_BAD_REQUEST)
        

        obj = Complaint.objects.filter(id=id).update(status=status)

        return Response({}, status=STATUS.HTTP_202_ACCEPTED)
    




