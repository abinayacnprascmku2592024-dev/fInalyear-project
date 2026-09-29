from django.db import models

class Bus(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Maintenance', 'Maintenance'),
    )

    BUS_TYPES = (
        ('Express', 'Express'),
        ('City Bus', 'City Bus'),
        ('AC Sleeper', 'AC Sleeper'),
        ('Non-AC Seater', 'Non-AC Seater'),
        ('Mini Bus', 'Mini Bus'),
    )

    bus_number = models.CharField(max_length=50, unique=True)
    registration_number = models.CharField(max_length=50, unique=True)
    bus_type = models.CharField(max_length=50, choices=BUS_TYPES, default='City Bus')
    capacity = models.IntegerField(default=40)
    driver_name = models.CharField(max_length=100)
    driver_phone = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'buses'
        ordering = ['bus_number']

    def __str__(self):
        return f"Bus {self.bus_number} ({self.registration_number})"
