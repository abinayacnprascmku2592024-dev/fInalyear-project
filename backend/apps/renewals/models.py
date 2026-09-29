import random
import string
import datetime
from django.db import models
from apps.passes.models import BusPass

def generate_renewal_id():
    chars = ''.join(random.choices(string.digits, k=6))
    return f"REN-{chars}"

class Renewal(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    )

    renewal_id = models.CharField(max_length=30, unique=True, default=generate_renewal_id)
    bus_pass = models.ForeignKey(BusPass, related_name='renewals', on_delete=models.CASCADE)
    requested_duration = models.IntegerField(default=30, help_text="Requested duration in days")
    renewal_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    request_date = models.DateField(auto_now_add=True)
    new_expiry_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'renewals'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.renewal_id} for Pass {self.bus_pass.pass_number} ({self.status})"
