import datetime
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import BusPass
from .serializers import BusPassSerializer

class BusPassViewSet(viewsets.ModelViewSet):
    queryset = BusPass.objects.select_related(
        'application', 'application__applicant', 'pass_type',
        'route', 'source_stop', 'destination_stop'
    ).all()
    serializer_class = BusPassSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'pass_number', 'application__applicant__name', 'application__applicant__phone',
        'route__route_number', 'status'
    ]
    ordering_fields = ['created_at', 'issue_date', 'expiry_date', 'status']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Update expired statuses automatically
        today = datetime.date.today()
        queryset.filter(status='Active', expiry_date__lt=today).update(status='Expired')
        
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    @action(detail=False, methods=['get'], url_path='lookup')
    def lookup(self, request):
        pass_num = request.query_params.get('pass_number', '').strip()
        if not pass_num:
            return Response({
                'success': False,
                'message': 'Please provide Pass Number'
            }, status=status.HTTP_400_BAD_REQUEST)

        bus_pass = BusPass.objects.filter(pass_number__iexact=pass_num).first()
        if not bus_pass:
            return Response({
                'success': False,
                'message': f'No bus pass found with number {pass_num}'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check expiry
        if bus_pass.status == 'Active' and bus_pass.expiry_date < datetime.date.today():
            bus_pass.status = 'Expired'
            bus_pass.save()

        serializer = BusPassSerializer(bus_pass, context={'request': request})
        return Response({
            'success': True,
            'message': 'Bus pass retrieved successfully',
            'data': serializer.data
        })

    @action(detail=False, methods=['get'], url_path=r'verify/(?P<pass_number>[^/.]+)')
    def verify_by_param(self, request, pass_number=None):
        return self._do_verify(request, pass_number)

    @action(detail=False, methods=['get'], url_path='verify')
    def verify(self, request):
        pass_num = request.query_params.get('pass_number', '').strip()
        return self._do_verify(request, pass_num)

    def _do_verify(self, request, pass_num):
        if not pass_num:
            return Response({
                'success': False,
                'message': 'Please provide Pass Number for verification'
            }, status=status.HTTP_400_BAD_REQUEST)

        bus_pass = BusPass.objects.filter(pass_number__iexact=pass_num).first()
        if not bus_pass:
            return Response({
                'success': False,
                'valid': False,
                'message': f'INVALID: No pass record found for {pass_num}'
            }, status=status.HTTP_404_NOT_FOUND)

        today = datetime.date.today()
        if bus_pass.expiry_date < today and bus_pass.status == 'Active':
            bus_pass.status = 'Expired'
            bus_pass.save()

        is_valid = (bus_pass.status == 'Active')
        
        return Response({
            'success': True,
            'valid': is_valid,
            'status': bus_pass.status,
            'message': 'VALID PASS' if is_valid else f'PASS IS {bus_pass.status.upper()}',
            'data': BusPassSerializer(bus_pass, context={'request': request}).data
        })
