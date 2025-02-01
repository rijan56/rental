from rest_framework.permissions import BasePermission


class IsLandLord(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "rentaluser", None)
            and getattr(request.user.rentaluser, "user_type", "") == "landlord"
        )
