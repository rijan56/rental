# Generated by Django 5.1.6 on 2025-03-04 15:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
        ("property", "0002_property_area_property_bathrooms_count_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="image",
            name="file",
            field=models.ImageField(upload_to="properties/"),
        ),
        migrations.AlterField(
            model_name="property",
            name="owner",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="properties",
                to="core.rentaluser",
            ),
        ),
        migrations.AlterField(
            model_name="property",
            name="thumbnail",
            field=models.ImageField(upload_to="thumbnail/"),
        ),
    ]
