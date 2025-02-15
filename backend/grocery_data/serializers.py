# grocery_data/serializers.py
from rest_framework import serializers
from .models import Grocery, GroceryPrice

class GroceryPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryPrice
        fields = ['date', 'price']  # Adjust fields as needed

class GrocerySerializer(serializers.ModelSerializer):
    # Include prices as a nested field; these will be sorted by date thanks to the model's ordering.
    prices = GroceryPriceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Grocery
        fields = ['id', 'name', 'prices']
