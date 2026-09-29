import datetime
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Renewal
from .serializers import RenewalReadSerializer, RenewalWriteSerializer

class RenewalViewSet(viewsets.ModelViewSet):
    queryset = Renewal.objects.select_related('bus_pass', 'bus_pass__application__applicant').all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'renewal_id', 'bus_pass__pass_number',
        'bus_pass__application__applicant__name', 'status'
    ]
    ordering_fields = ['created_at', 'request_date', 'status']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return RenewalWriteSerializer
        return RenewalReadSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            renewal = serializer.save()
            read_serializer = RenewalReadSerializer(renewal, context={'request': request})
            return Response({
                'success': True,
                'message': 'Renewal request submitted successfully',
                'renewal_id': renewal.renewal_id,
                'data': read_serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        renewal = self.get_object()
        if renewal.status == 'Approved':
            return Response({'success': True, 'message': 'Renewal already approved'})

        bus_pass = renewal.bus_pass
        today = datetime.date.today()
        base_date = max(bus_pass.expiry_date, today)
        new_expiry = base_date + datetime.timedelta(days=renewal.requested_duration)

        renewal.new_expiry_date = new_expiry
        renewal.status = 'Approved'
        renewal.save()

        bus_pass.expiry_date = new_expiry
        bus_pass.status = 'Active'
        bus_pass.save()

        return Response({
            'success': True,
            'message': f'Renewal {renewal.renewal_id} approved. New pass expiry date is {new_expiry}',
            'new_expiry_date': new_expiry,
            'data': RenewalReadSerializer(renewal, context={'request': request}).data
        })

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        renewal = self.get_object()
        reason = request.data.get('remarks', 'Renewal request rejected by administrator.')
        renewal.status = 'Rejected'
        renewal.remarks = reason
        renewal.save()

        return Response({
            'success': True,
            'message': f'Renewal {renewal.renewal_id} rejected',
            'data': RenewalReadSerializer(renewal, context={'request': request}).data
        })
