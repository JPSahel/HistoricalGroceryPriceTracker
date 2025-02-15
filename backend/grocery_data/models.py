from django.db import models

# Create your models here.

class Grocery(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class GroceryPrice(models.Model):
    grocery = models.ForeignKey(Grocery, related_name='prices', on_delete=models.CASCADE)
    date = models.DateField()  # Representing the month (using day 1 for simplicity)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        unique_together = ('grocery', 'date')
        ordering = ['date']

    def __str__(self):
        return f"{self.grocery.name} on {self.date}: {self.price}"