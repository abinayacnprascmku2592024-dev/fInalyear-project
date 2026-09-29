from rest_framework import viewsets, filters
from .models import Route, BusStop
from .serializers import RouteSerializer, BusStopSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['route_number', 'route_name', 'starting_point', 'destination']
    ordering_fields = ['route_number', 'created_at']


class BusStopViewSet(viewsets.ModelViewSet):
    queryset = BusStop.objects.all()
    serializer_class = BusStopSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['stop_name', 'location', 'route__route_number']
    ordering_fields = ['sequence_number', 'stop_name']

    def get_queryset(self):
        queryset = super().get_queryset()
        route_id = self.request.query_params.get('route_id')
        if route_id:
            queryset = queryset.filter(route_id=route_id)
        return queryset
