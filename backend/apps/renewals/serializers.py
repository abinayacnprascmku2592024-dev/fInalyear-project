from rest_framework import serializers
from .models import Renewal
from apps.passes.models import BusPass
from apps.passes.serializers import BusPassSerializer

class RenewalReadSerializer(serializers.ModelSerializer):
    bus_pass = BusPassSerializer(read_only=True)

    class Meta:
        model = Renewal
        fields = '__all__'


class RenewalWriteSerializer(serializers.ModelSerializer):
    pass_number = serializers.CharField(write_only=True, required=False)
    bus_pass = serializers.PrimaryKeyRelatedField(queryset=BusPass.objects.all(), required=False)

    class Meta:
        model = Renewal
        fields = ['id', 'renewal_id', 'bus_pass', 'pass_number', 'requested_duration', 'renewal_fee', 'status', 'remarks']
        read_only_fields = ['id', 'renewal_id', 'status']

    def validate(self, attrs):
        pass_num = attrs.get('pass_number')
        bus_pass = attrs.get('bus_pass')

        if not bus_pass and pass_num:
            found_pass = BusPass.objects.filter(pass_number__iexact=pass_num).first()
            if not found_pass:
                raise serializers.ValidationError({'pass_number': f'Pass number "{pass_num}" not found.'})
            attrs['bus_pass'] = found_pass
        elif not bus_pass and not pass_num:
            raise serializers.ValidationError({'bus_pass': 'Please provide either bus_pass ID or pass_number.'})

        return attrs

    def create(self, validated_data):
        validated_data.pop('pass_number', None)
        return super().create(validated_data)
