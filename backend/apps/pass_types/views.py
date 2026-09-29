from rest_framework import viewsets, filters
from .models import PassType
from .serializers import PassTypeSerializer

class PassTypeViewSet(viewsets.ModelViewSet):
    queryset = PassType.objects.all()
    serializer_class = PassTypeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'duration_days', 'created_at']
