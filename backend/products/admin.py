from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "price",
        "unit",
        "is_active",
        "created_at",
    )

    list_filter = ("is_active", "unit")
    search_fields = ("name", "description")
    list_editable = ("price", "is_active")