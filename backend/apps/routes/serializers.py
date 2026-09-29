from rest_framework import serializers
from .models import Route, BusStop

class BusStopSerializer(serializers.ModelSerializer):
    route_number = serializers.ReadOnlyField(source='route.route_number')

    class Meta:
        model = BusStop
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    stops = BusStopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = '__all__'
