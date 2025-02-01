from django.contrib import admin
from property.models.property import Property
from property.models.image import Image

# Register your models here.
admin.register(Property)
admin.register(Image)
admin.site.register(Property)
admin.site.register(Image)
