# grocery_data/views.py
from rest_framework import viewsets
from .models import Grocery, GroceryPrice
from .serializers import GrocerySerializer, GroceryPriceSerializer

class GroceryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides a read-only API endpoint for Grocery items.
    Each Grocery item includes its related price records.
    """
    queryset = Grocery.objects.all()
    serializer_class = GrocerySerializer

class GroceryPriceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides a read-only API endpoint for GroceryPrice records.
    Useful if you need to query price data separately.
    """
    queryset = GroceryPrice.objects.all().order_by('date')
    serializer_class = GroceryPriceSerializer
