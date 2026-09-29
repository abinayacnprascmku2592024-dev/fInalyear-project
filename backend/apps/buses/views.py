from rest_framework import viewsets, filters
from .models import Bus
from .serializers import BusSerializer

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['bus_number', 'registration_number', 'driver_name', 'driver_phone', 'bus_type']
    ordering_fields = ['bus_number', 'capacity', 'created_at']
