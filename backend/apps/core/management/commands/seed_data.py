import datetime
import random
from django.core.management.base import BaseCommand
from apps.pass_types.models import PassType
from apps.buses.models import Bus
from apps.routes.models import Route, BusStop
from apps.applications.models import Applicant, Application
from apps.passes.models import BusPass
from apps.renewals.models import Renewal

class Command(BaseCommand):
    help = 'Seeds realistic sample data for Online Bus Pass Management System'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))

        # 1. Pass Types
        pass_types_data = [
            {'name': 'Daily Pass', 'description': 'Unlimited city bus travel for 1 day', 'duration_days': 1, 'price': 50.00, 'status': 'Active'},
            {'name': 'Weekly Pass', 'description': 'Unlimited bus travel for 7 consecutive days', 'duration_days': 7, 'price': 250.00, 'status': 'Active'},
            {'name': 'Monthly Pass', 'description': 'Standard monthly travel pass for commuters', 'duration_days': 30, 'price': 800.00, 'status': 'Active'},
            {'name': 'Quarterly Pass', 'description': 'Pass valid for 90 days with 15% discount', 'duration_days': 90, 'price': 2100.00, 'status': 'Active'},
            {'name': 'Student Pass', 'description': 'Discounted pass for school and college students', 'duration_days': 30, 'price': 400.00, 'status': 'Active'},
            {'name': 'Employee Pass', 'description': 'Corporate concession pass for workforce commuters', 'duration_days': 30, 'price': 700.00, 'status': 'Active'},
        ]

        pass_type_objs = []
        for pt in pass_types_data:
            obj, _ = PassType.objects.get_or_create(name=pt['name'], defaults=pt)
            pass_type_objs.append(obj)
        self.stdout.write(f'Seeded {len(pass_type_objs)} Pass Types.')

        # 2. Buses
        buses_data = [
            {'bus_number': 'BUS-101', 'registration_number': 'MH-12-AB-1001', 'bus_type': 'City Bus', 'capacity': 45, 'driver_name': 'Ramesh Kumar', 'driver_phone': '9876543210', 'status': 'Active'},
            {'bus_number': 'BUS-102', 'registration_number': 'MH-12-AB-1002', 'bus_type': 'Express', 'capacity': 50, 'driver_name': 'Suresh Patil', 'driver_phone': '9876543211', 'status': 'Active'},
            {'bus_number': 'BUS-103', 'registration_number': 'MH-12-AB-1003', 'bus_type': 'AC Sleeper', 'capacity': 36, 'driver_name': 'Vijay Singh', 'driver_phone': '9876543212', 'status': 'Active'},
            {'bus_number': 'BUS-104', 'registration_number': 'MH-12-AB-1004', 'bus_type': 'City Bus', 'capacity': 45, 'driver_name': 'Anil Deshmukh', 'driver_phone': '9876543213', 'status': 'Active'},
            {'bus_number': 'BUS-105', 'registration_number': 'MH-12-AB-1005', 'bus_type': 'Non-AC Seater', 'capacity': 40, 'driver_name': 'Mahesh Joshi', 'driver_phone': '9876543214', 'status': 'Maintenance'},
            {'bus_number': 'BUS-106', 'registration_number': 'MH-12-AB-1006', 'bus_type': 'Mini Bus', 'capacity': 25, 'driver_name': 'Prakash Shinde', 'driver_phone': '9876543215', 'status': 'Active'},
            {'bus_number': 'BUS-107', 'registration_number': 'MH-12-AB-1007', 'bus_type': 'Express', 'capacity': 50, 'driver_name': 'Dinesh Pawar', 'driver_phone': '9876543216', 'status': 'Active'},
            {'bus_number': 'BUS-108', 'registration_number': 'MH-12-AB-1008', 'bus_type': 'City Bus', 'capacity': 45, 'driver_name': 'Rajesh Sharma', 'driver_phone': '9876543217', 'status': 'Inactive'},
            {'bus_number': 'BUS-109', 'registration_number': 'MH-12-AB-1009', 'bus_type': 'AC Sleeper', 'capacity': 36, 'driver_name': 'Ganesh Kadam', 'driver_phone': '9876543218', 'status': 'Active'},
            {'bus_number': 'BUS-110', 'registration_number': 'MH-12-AB-1010', 'bus_type': 'Mini Bus', 'capacity': 25, 'driver_name': 'Sunil Chavan', 'driver_phone': '9876543219', 'status': 'Active'},
        ]

        bus_objs = []
        for b in buses_data:
            obj, _ = Bus.objects.get_or_create(bus_number=b['bus_number'], defaults=b)
            bus_objs.append(obj)
        self.stdout.write(f'Seeded {len(bus_objs)} Buses.')

        # 3. Routes & Bus Stops
        routes_data = [
            {
                'route_number': 'R-101', 'route_name': 'Central Station to Tech Park',
                'starting_point': 'Central Station', 'destination': 'Tech Park',
                'distance': '22 km', 'estimated_time': '45 mins', 'status': 'Active',
                'stops': ['Central Station', 'Market Yard', 'City Mall', 'University Gate', 'IT Hub North', 'Tech Park']
            },
            {
                'route_number': 'R-102', 'route_name': 'Airport to City Center',
                'starting_point': 'International Airport', 'destination': 'City Center',
                'distance': '18 km', 'estimated_time': '35 mins', 'status': 'Active',
                'stops': ['International Airport', 'VIP Square', 'Cargo Terminal', 'Hotel Regency', 'City Center']
            },
            {
                'route_number': 'R-103', 'route_name': 'Suburban East to West Terminal',
                'starting_point': 'East Colony', 'destination': 'West Terminal',
                'distance': '30 km', 'estimated_time': '60 mins', 'status': 'Active',
                'stops': ['East Colony', 'Railway Crossing', 'Civil Hospital', 'State College', 'Industrial Estate', 'West Terminal']
            },
            {
                'route_number': 'R-104', 'route_name': 'University Express',
                'starting_point': 'Bus Stand North', 'destination': 'University Main Campus',
                'distance': '15 km', 'estimated_time': '30 mins', 'status': 'Active',
                'stops': ['Bus Stand North', 'Science Complex', 'Engineering Hostel', 'Library Circle', 'University Main Campus']
            },
            {
                'route_number': 'R-105', 'route_name': 'South Ring Line',
                'starting_point': 'South Metro', 'destination': 'Harbor Gate',
                'distance': '25 km', 'estimated_time': '50 mins', 'status': 'Active',
                'stops': ['South Metro', 'Green Park', 'Stadium Cross', 'Tech Zone 2', 'Custom House', 'Harbor Gate']
            },
        ]

        route_objs = []
        total_stops = 0
        for r_data in routes_data:
            stops_list = r_data.pop('stops')
            route, _ = Route.objects.get_or_create(route_number=r_data['route_number'], defaults=r_data)
            route_objs.append(route)

            for idx, stop_name in enumerate(stops_list, start=1):
                BusStop.objects.get_or_create(
                    route=route,
                    stop_name=stop_name,
                    defaults={'sequence_number': idx, 'location': f"Location near {stop_name}", 'status': 'Active'}
                )
                total_stops += 1

        self.stdout.write(f'Seeded {len(route_objs)} Routes and {total_stops} Bus Stops.')

        # 4. Applicants & Applications
        sample_applicants = [
            {'name': 'Aarav Sharma', 'email': 'aarav.sharma@example.com', 'phone': '9811223344', 'city': 'Pune', 'org': 'MIT World Peace University', 'id_num': 'STU-9921'},
            {'name': 'Priya Patel', 'email': 'priya.patel@example.com', 'phone': '9822334455', 'city': 'Pune', 'org': 'Infosys Technologies', 'id_num': 'EMP-4402'},
            {'name': 'Rohan Verma', 'email': 'rohan.verma@example.com', 'phone': '9833445566', 'city': 'Mumbai', 'org': 'College of Engineering', 'id_num': 'STU-1088'},
            {'name': 'Ananya Iyer', 'email': 'ananya.iyer@example.com', 'phone': '9844556677', 'city': 'Pune', 'org': 'TCS Corporate', 'id_num': 'EMP-8819'},
            {'name': 'Karan Gupta', 'email': 'karan.gupta@example.com', 'phone': '9855667788', 'city': 'Thane', 'org': 'National Institute of Tech', 'id_num': 'STU-3321'},
            {'name': 'Neha Deshmukh', 'email': 'neha.d@example.com', 'phone': '9866778899', 'city': 'Pune', 'org': 'Tech Mahindra', 'id_num': 'EMP-1192'},
            {'name': 'Aditya Joshi', 'email': 'aditya.j@example.com', 'phone': '9877889900', 'city': 'Nashik', 'org': 'Fergusson College', 'id_num': 'STU-6520'},
            {'name': 'Sneha Kulkarni', 'email': 'sneha.k@example.com', 'phone': '9888990011', 'city': 'Pune', 'org': 'Wipro Digital', 'id_num': 'EMP-7721'},
            {'name': 'Vikram Rathore', 'email': 'vikram.r@example.com', 'phone': '9899001122', 'city': 'Nagpur', 'org': 'Symbiosis International', 'id_num': 'STU-9012'},
            {'name': 'Tanvi Shah', 'email': 'tanvi.shah@example.com', 'phone': '9900112233', 'city': 'Pune', 'org': 'Cognizant Technology', 'id_num': 'EMP-3044'},
        ]

        app_statuses = ['Issued', 'Issued', 'Issued', 'Approved', 'Pending', 'Pending', 'Rejected', 'Issued', 'Pending', 'Approved']
        applications_created = []

        for idx, app_info in enumerate(sample_applicants):
            applicant, _ = Applicant.objects.get_or_create(
                email=app_info['email'],
                defaults={
                    'name': app_info['name'],
                    'date_of_birth': datetime.date(2000 + (idx % 4), (idx % 12) + 1, (idx % 25) + 1),
                    'gender': 'Male' if idx % 2 == 0 else 'Female',
                    'phone': app_info['phone'],
                    'address': f"{101 + idx}, Park Avenue Road",
                    'city': app_info['city'],
                    'state': 'Maharashtra',
                    'pincode': f"41100{idx}",
                    'organization': app_info['org'],
                    'id_number': app_info['id_num']
                }
            )

            route = route_objs[idx % len(route_objs)]
            stops = list(route.stops.all())
            source_stop = stops[0]
            dest_stop = stops[-1]
            pass_type = pass_type_objs[idx % len(pass_type_objs)]
            st = app_statuses[idx]

            app_id_val = f"APP-10000{idx+1}"
            app_obj, _ = Application.objects.get_or_create(
                application_id=app_id_val,
                defaults={
                    'applicant': applicant,
                    'pass_type': pass_type,
                    'route': route,
                    'source_stop': source_stop,
                    'destination_stop': dest_stop,
                    'start_date': datetime.date.today() - datetime.timedelta(days=idx*3),
                    'duration_days': pass_type.duration_days,
                    'status': st,
                    'rejection_reason': 'Invalid document proof uploaded' if st == 'Rejected' else None,
                    'remarks': 'Regular daily route commuter request'
                }
            )
            applications_created.append(app_obj)

        self.stdout.write(f'Seeded {len(applications_created)} Applications.')

        # 5. Issued Passes for 'Issued' applications
        passes_created = []
        for idx, app in enumerate(applications_created):
            if app.status == 'Issued':
                p_num = f"PASS-20000{idx+1}"
                issue_d = datetime.date.today() - datetime.timedelta(days=15 - idx)
                exp_d = issue_d + datetime.timedelta(days=app.pass_type.duration_days)
                st = 'Active' if exp_d >= datetime.date.today() else 'Expired'

                p_obj, _ = BusPass.objects.get_or_create(
                    pass_number=p_num,
                    defaults={
                        'application': app,
                        'pass_type': app.pass_type,
                        'route': app.route,
                        'source_stop': app.source_stop,
                        'destination_stop': app.destination_stop,
                        'issue_date': issue_d,
                        'expiry_date': exp_d,
                        'status': st,
                    }
                )
                passes_created.append(p_obj)

        self.stdout.write(f'Seeded {len(passes_created)} Bus Passes.')

        # 6. Renewal Requests
        renewals_created = 0
        for p in passes_created[:2]:
            ren_id = f"REN-30000{p.id}"
            Renewal.objects.get_or_create(
                renewal_id=ren_id,
                defaults={
                    'bus_pass': p,
                    'requested_duration': 30,
                    'renewal_fee': 800.00,
                    'status': 'Pending',
                    'remarks': 'Requesting 30-day renewal extension'
                }
            )
            renewals_created += 1

        self.stdout.write(f'Seeded {renewals_created} Renewal requests.')
        self.stdout.write(self.style.SUCCESS('Successfully completed database seeding!'))
