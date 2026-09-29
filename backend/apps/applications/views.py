import datetime
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Application, Applicant
from .serializers import ApplicationReadSerializer, ApplicationWriteSerializer, ApplicantSerializer
from apps.passes.models import BusPass

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.select_related(
        'applicant', 'pass_type', 'route', 'source_stop', 'destination_stop'
    ).all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'application_id', 'applicant__name', 'applicant__phone',
        'applicant__email', 'route__route_number', 'status'
    ]
    ordering_fields = ['created_at', 'application_date', 'status']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ApplicationWriteSerializer
        return ApplicationReadSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            application = serializer.save()
            read_serializer = ApplicationReadSerializer(application, context={'request': request})
            return Response({
                'success': True,
                'message': 'Application submitted successfully',
                'data': read_serializer.data,
                'application_id': application.application_id
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        application = self.get_object()
        application.status = 'Approved'
        application.rejection_reason = None
        application.save()
        serializer = ApplicationReadSerializer(application, context={'request': request})
        return Response({
            'success': True,
            'message': f'Application {application.application_id} approved successfully',
            'data': serializer.data
        })

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        application = self.get_object()
        reason = request.data.get('rejection_reason', 'Details provided do not match documents.')
        application.status = 'Rejected'
        application.rejection_reason = reason
        application.save()
        serializer = ApplicationReadSerializer(application, context={'request': request})
        return Response({
            'success': True,
            'message': f'Application {application.application_id} rejected',
            'data': serializer.data
        })

    @action(detail=True, methods=['post'], url_path='issue-pass')
    def issue_pass(self, request, pk=None):
        application = self.get_object()
        if application.status not in ['Approved', 'Pending']:
            return Response({
                'success': False,
                'message': f'Cannot issue pass for application with status {application.status}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if pass already issued
        existing_pass = BusPass.objects.filter(application=application).first()
        if existing_pass:
            return Response({
                'success': True,
                'message': 'Pass has already been issued',
                'pass_number': existing_pass.pass_number,
                'data': ApplicationReadSerializer(application, context={'request': request}).data
            })

        issue_date = datetime.date.today()
        duration = application.duration_days or application.pass_type.duration_days
        expiry_date = issue_date + datetime.timedelta(days=duration)

        bus_pass = BusPass.objects.create(
            application=application,
            pass_type=application.pass_type,
            route=application.route,
            source_stop=application.source_stop,
            destination_stop=application.destination_stop,
            issue_date=issue_date,
            expiry_date=expiry_date,
            status='Active'
        )

        application.status = 'Issued'
        application.save()

        return Response({
            'success': True,
            'message': f'Bus pass issued successfully: {bus_pass.pass_number}',
            'pass_number': bus_pass.pass_number,
            'issue_date': issue_date,
            'expiry_date': expiry_date
        })

    @action(detail=False, methods=['get'], url_path='status-check')
    def status_check(self, request):
        app_id = request.query_params.get('app_id', '').strip()
        if not app_id:
            return Response({
                'success': False,
                'message': 'Please provide Application ID'
            }, status=status.HTTP_400_BAD_REQUEST)

        application = Application.objects.filter(application_id__iexact=app_id).first()
        if not application:
            return Response({
                'success': False,
                'message': f'No application found with ID {app_id}'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ApplicationReadSerializer(application, context={'request': request})
        return Response({
            'success': True,
            'message': 'Application status retrieved successfully',
            'data': serializer.data
        })
