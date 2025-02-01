# Create your views here.
import pickle
import pandas as pd
from rest_framework.decorators import APIView
from rest_framework.request import Request
from rest_framework.response import Response
import rest_framework.status as status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from recommendation.serializers import recommend_serializer

with open("./recommendation/model/house_prediction_model.pkl", "rb") as file:
    print("[Log] Loading Recommendation Model")
    model = pickle.load(file)


class RecommendationView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serialized = recommend_serializer.RecommendationRequestSerializer(
            data=request.data
        )

        if serialized.is_valid():
            house_data = {
                "Bedrooms": serialized.validated_data["bedrooms"],
                "Bathrooms": serialized.validated_data["bathrooms"],
                "Floors": serialized.validated_data["floors"],
                "City": serialized.validated_data["city"],
                "District": serialized.validated_data["district"],
                "Land Area": serialized.validated_data["land_area"],
                "car_parking": serialized.validated_data["car_parking"],
            }
            new_house_df = pd.DataFrame([house_data])

            predicted_price = model.predict(new_house_df)

            final_price = (predicted_price // 1000000) * serialized.validated_data.get(
                "staying"
            )

            return Response({"predicted_price": final_price}, status=status.HTTP_200_OK)

        return Response(serialized.errors, status.HTTP_400_BAD_REQUEST)
