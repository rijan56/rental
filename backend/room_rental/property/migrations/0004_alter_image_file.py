# Generated by Django 5.1.6 on 2025-03-07 14:26

import property.models.image
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("property", "0003_alter_image_file_alter_property_owner_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="image",
            name="file",
            field=models.ImageField(upload_to=property.models.image.random_filename),
        ),
    ]
