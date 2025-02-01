import os
import uuid

from property.models import PropertyModel
from django.db import models


def random_filename(instance, filename):
    """Generate a random filename while preserving the file extension."""
    ext = filename.split(".")[-1]  # Get the file extension
    new_filename = f"{uuid.uuid4().hex}.{ext}"  # Generate a random UUID filename
    return os.path.join("properties", new_filename)  # Save inside 'media/properties/'


class Image(models.Model):
    file = models.ImageField(upload_to=random_filename)

    property = models.ForeignKey(
        PropertyModel, related_name="images", on_delete=models.CASCADE
    )
