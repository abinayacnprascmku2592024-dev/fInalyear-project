from rest_framework import serializers
from .models import Applicant, Application
from apps.pass_types.serializers import PassTypeSerializer
from apps.routes.serializers import RouteSerializer, BusStopSerializer

class ApplicantSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    id_proof_url = serializers.SerializerMethodField()

    class Meta:
        model = Applicant
        fields = '__all__'

    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

    def get_id_proof_url(self, obj):
        if obj.id_proof:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.id_proof.url)
            return obj.id_proof.url
        return None


class ApplicationReadSerializer(serializers.ModelSerializer):
    applicant = ApplicantSerializer(read_only=True)
    pass_type = PassTypeSerializer(read_only=True)
    route = RouteSerializer(read_only=True)
    source_stop = BusStopSerializer(read_only=True)
    destination_stop = BusStopSerializer(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'


class ApplicationWriteSerializer(serializers.ModelSerializer):
    # Applicant details embedded for creation
    name = serializers.CharField(write_only=True)
    date_of_birth = serializers.DateField(write_only=True)
    gender = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    phone = serializers.CharField(write_only=True)
    address = serializers.CharField(write_only=True)
    city = serializers.CharField(write_only=True)
    state = serializers.CharField(write_only=True)
    pincode = serializers.CharField(write_only=True)
    organization = serializers.CharField(write_only=True)
    id_number = serializers.CharField(write_only=True)
    photo = serializers.FileField(write_only=True, required=False, allow_null=True)
    id_proof = serializers.FileField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Application
        fields = [
            'id', 'application_id', 'pass_type', 'route', 'source_stop', 'destination_stop',
            'start_date', 'duration_days', 'remarks', 'status', 'rejection_reason',
            'name', 'date_of_birth', 'gender', 'email', 'phone', 'address',
            'city', 'state', 'pincode', 'organization', 'id_number', 'photo', 'id_proof'
        ]
        read_only_fields = ['id', 'application_id', 'status', 'rejection_reason']

    def create(self, validated_data):
        applicant_data = {
            'name': validated_data.pop('name'),
            'date_of_birth': validated_data.pop('date_of_birth'),
            'gender': validated_data.pop('gender'),
            'email': validated_data.pop('email'),
            'phone': validated_data.pop('phone'),
            'address': validated_data.pop('address'),
            'city': validated_data.pop('city'),
            'state': validated_data.pop('state'),
            'pincode': validated_data.pop('pincode'),
            'organization': validated_data.pop('organization'),
            'id_number': validated_data.pop('id_number'),
            'photo': validated_data.pop('photo', None),
            'id_proof': validated_data.pop('id_proof', None),
        }
        applicant = Applicant.objects.create(**applicant_data)
        application = Application.objects.create(applicant=applicant, **validated_data)
        return application
