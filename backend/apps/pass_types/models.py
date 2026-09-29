from django.db import models

class PassType(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    )

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    duration_days = models.IntegerField(help_text="Duration in days (e.g. 1, 7, 30, 90, 365)")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pass_types'
        ordering = ['price']

    def __str__(self):
        return f"{self.name} - ₹{self.price} ({self.duration_days} days)"
