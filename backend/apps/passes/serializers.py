from rest_framework import serializers
from .models import BusPass
from apps.applications.serializers import ApplicationReadSerializer
from apps.pass_types.serializers import PassTypeSerializer
from apps.routes.serializers import RouteSerializer, BusStopSerializer

class BusPassSerializer(serializers.ModelSerializer):
    application = ApplicationReadSerializer(read_only=True)
    pass_type = PassTypeSerializer(read_only=True)
    route = RouteSerializer(read_only=True)
    source_stop = BusStopSerializer(read_only=True)
    destination_stop = BusStopSerializer(read_only=True)
    qr_code_url = serializers.SerializerMethodField()

    class Meta:
        model = BusPass
        fields = '__all__'

    def get_qr_code_url(self, obj):
        if obj.qr_code_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.qr_code_image.url)
            return obj.qr_code_image.url
        return None
