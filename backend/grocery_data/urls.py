# grocery_data/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GroceryViewSet, GroceryPriceViewSet

router = DefaultRouter()
router.register(r'groceries', GroceryViewSet, basename='grocery')
router.register(r'prices', GroceryPriceViewSet, basename='groceryprice')

urlpatterns = [
    path('', include(router.urls)),
]