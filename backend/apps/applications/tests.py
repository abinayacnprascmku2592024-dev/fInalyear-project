import datetime
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.pass_types.models import PassType
from apps.routes.models import Route, BusStop
from apps.applications.models import Applicant, Application
from apps.passes.models import BusPass
from apps.renewals.models import Renewal

class BusPassSystemTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.pass_type = PassType.objects.create(
            name='Monthly Pass Test',
            description='Test Pass Description',
            duration_days=30,
            price=800.00,
            status='Active'
        )

        self.route = Route.objects.create(
            route_number='R-TEST',
            route_name='Test Route',
            starting_point='Start Point',
            destination='End Point',
            distance='10 km',
            estimated_time='20 mins',
            status='Active'
        )

        self.stop1 = BusStop.objects.create(
            route=self.route,
            stop_name='Start Point',
            sequence_number=1,
            status='Active'
        )

        self.stop2 = BusStop.objects.create(
            route=self.route,
            stop_name='End Point',
            sequence_number=2,
            status='Active'
        )

    def test_create_application(self):
        payload = {
            'name': 'Test User',
            'date_of_birth': '1995-05-15',
            'gender': 'Male',
            'email': 'testuser@example.com',
            'phone': '9876543210',
            'address': '123 Test Street',
            'city': 'Pune',
            'state': 'Maharashtra',
            'pincode': '411001',
            'organization': 'Test Corp',
            'id_number': 'ID-12345',
            'pass_type': self.pass_type.id,
            'route': self.route.id,
            'source_stop': self.stop1.id,
            'destination_stop': self.stop2.id,
            'start_date': str(datetime.date.today()),
            'duration_days': 30,
            'remarks': 'Testing application creation'
        }

        response = self.client.post('/api/applications/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('APP-', response.data['application_id'])

    def test_approve_reject_and_issue_pass(self):
        applicant = Applicant.objects.create(
            name='Jane Doe',
            date_of_birth=datetime.date(1998, 8, 20),
            gender='Female',
            email='jane@example.com',
            phone='9876500000',
            address='456 Tech Park',
            city='Pune',
            state='Maharashtra',
            pincode='411002',
            organization='Tech High',
            id_number='ID-99'
        )

        app = Application.objects.create(
            applicant=applicant,
            pass_type=self.pass_type,
            route=self.route,
            source_stop=self.stop1,
            destination_stop=self.stop2,
            start_date=datetime.date.today(),
            duration_days=30
        )

        # 1. Approve
        approve_resp = self.client.post(f'/api/applications/{app.id}/approve/')
        self.assertEqual(approve_resp.status_code, status.HTTP_200_OK)
        app.refresh_from_db()
        self.assertEqual(app.status, 'Approved')

        # 2. Issue Pass
        issue_resp = self.client.post(f'/api/applications/{app.id}/issue-pass/')
        self.assertEqual(issue_resp.status_code, status.HTTP_200_OK)
        self.assertIn('pass_number', issue_resp.data)
        pass_num = issue_resp.data['pass_number']

        # 3. Verify Pass
        verify_resp = self.client.get(f'/api/passes/verify/?pass_number={pass_num}')
        self.assertEqual(verify_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(verify_resp.data['valid'])

        # 4. Create Renewal
        ren_payload = {
            'pass_number': pass_num,
            'requested_duration': 30,
            'renewal_fee': 800.00,
            'remarks': 'Extension'
        }
        ren_resp = self.client.post('/api/renewals/', ren_payload, format='json')
        self.assertEqual(ren_resp.status_code, status.HTTP_201_CREATED)
        ren_id = ren_resp.data['data']['id']

        # 5. Approve Renewal
        ren_appr_resp = self.client.post(f'/api/renewals/{ren_id}/approve/')
        self.assertEqual(ren_appr_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(ren_appr_resp.data['success'])
