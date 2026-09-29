from rest_framework import serializers
from .models import PassType

class PassTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassType
        fields = '__all__'
