from django.db import models

class Route(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    )

    route_number = models.CharField(max_length=50, unique=True)
    route_name = models.CharField(max_length=150)
    starting_point = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    distance = models.CharField(max_length=50, help_text="e.g. 25 km")
    estimated_time = models.CharField(max_length=50, help_text="e.g. 45 mins")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'routes'
        ordering = ['route_number']

    def __str__(self):
        return f"{self.route_number}: {self.starting_point} to {self.destination}"


class BusStop(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    )

    route = models.ForeignKey(Route, related_name='stops', on_delete=models.CASCADE)
    stop_name = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True, null=True)
    sequence_number = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bus_stops'
        ordering = ['route', 'sequence_number']

    def __str__(self):
        return f"{self.stop_name} ({self.route.route_number} - Stop #{self.sequence_number})"
