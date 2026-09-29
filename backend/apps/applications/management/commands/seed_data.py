import random
import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.pass_types.models import PassType
from apps.buses.models import Bus
from apps.routes.models import Route, BusStop
from apps.applications.models import Applicant, Application
from apps.passes.models import BusPass
from apps.renewals.models import Renewal

class Command(BaseCommand):
    help = 'Seeds database with realistic demo data for Bus Pass Management System'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))

        # 1. Seed Pass Types
        pass_types_data = [
            {'name': 'Daily Pass', 'description': 'Unlimited bus travel for 1 day across all city routes.', 'duration_days': 1, 'price': 5.00, 'status': 'Active'},
            {'name': 'Weekly Pass', 'description': 'Convenient 7-day pass for short-term commuters.', 'duration_days': 7, 'price': 25.00, 'status': 'Active'},
            {'name': 'Monthly Pass', 'description': 'Standard monthly pass ideal for regular city commuters.', 'duration_days': 30, 'price': 80.00, 'status': 'Active'},
            {'name': 'Quarterly Pass', 'description': '90 days unlimited commuting with a 15% discount bonus.', 'duration_days': 90, 'price': 210.00, 'status': 'Active'},
            {'name': 'Student Special Pass', 'description': 'Concessional pass for high school and university students.', 'duration_days': 30, 'price': 40.00, 'status': 'Active'},
            {'name': 'Employee Corporate Pass', 'description': 'Premium corporate commute pass for accredited company staff.', 'duration_days': 30, 'price': 70.00, 'status': 'Active'},
        ]

        pass_type_objs = []
        for item in pass_types_data:
            obj, created = PassType.objects.get_or_create(name=item['name'], defaults=item)
            pass_type_objs.append(obj)

        self.stdout.write(f"Seeded {len(pass_type_objs)} Pass Types.")

        # 2. Seed Buses
        buses_data = [
            {'bus_number': 'B-101', 'registration_number': 'BUS-REG-8001', 'bus_type': 'Electric Low Floor', 'capacity': 45, 'driver_name': 'Robert Miller', 'driver_phone': '+1 555-0101', 'status': 'Active'},
            {'bus_number': 'B-102', 'registration_number': 'BUS-REG-8002', 'bus_type': 'AC Express', 'capacity': 50, 'driver_name': 'James Wilson', 'driver_phone': '+1 555-0102', 'status': 'Active'},
            {'bus_number': 'B-103', 'registration_number': 'BUS-REG-8003', 'bus_type': 'Non-AC Standard', 'capacity': 55, 'driver_name': 'David Anderson', 'driver_phone': '+1 555-0103', 'status': 'Active'},
            {'bus_number': 'B-104', 'registration_number': 'BUS-REG-8004', 'bus_type': 'AC Deluxe', 'capacity': 48, 'driver_name': 'John Thomas', 'driver_phone': '+1 555-0104', 'status': 'Active'},
            {'bus_number': 'B-105', 'registration_number': 'BUS-REG-8005', 'bus_type': 'Electric Shuttle', 'capacity': 35, 'driver_name': 'Michael Jackson', 'driver_phone': '+1 555-0105', 'status': 'Active'},
            {'bus_number': 'B-106', 'registration_number': 'BUS-REG-8006', 'bus_type': 'AC Express', 'capacity': 50, 'driver_name': 'William White', 'driver_phone': '+1 555-0106', 'status': 'Maintenance'},
            {'bus_number': 'B-107', 'registration_number': 'BUS-REG-8007', 'bus_type': 'Non-AC Standard', 'capacity': 55, 'driver_name': 'Charles Harris', 'driver_phone': '+1 555-0107', 'status': 'Active'},
            {'bus_number': 'B-108', 'registration_number': 'BUS-REG-8008', 'bus_type': 'Double Decker', 'capacity': 70, 'driver_name': 'Richard Martin', 'driver_phone': '+1 555-0108', 'status': 'Active'},
            {'bus_number': 'B-109', 'registration_number': 'BUS-REG-8009', 'bus_type': 'Electric City Bus', 'capacity': 42, 'driver_name': 'Joseph Thompson', 'driver_phone': '+1 555-0109', 'status': 'Active'},
            {'bus_number': 'B-110', 'registration_number': 'BUS-REG-8010', 'bus_type': 'AC Deluxe', 'capacity': 48, 'driver_name': 'Thomas Garcia', 'driver_phone': '+1 555-0110', 'status': 'Inactive'},
        ]

        bus_objs = []
        for item in buses_data:
            obj, created = Bus.objects.get_or_create(bus_number=item['bus_number'], defaults=item)
            bus_objs.append(obj)

        self.stdout.write(f"Seeded {len(bus_objs)} Buses.")

        # 3. Seed Routes and Bus Stops
        routes_data = [
            {
                'route_number': 'R-101', 'route_name': 'Downtown - Tech Park Central',
                'starting_point': 'Central Railway Station', 'destination': 'Silicon Tech Park',
                'distance': 18.5, 'estimated_time': '40 mins', 'status': 'Active',
                'stops': [
                    ('Central Railway Station', 'Platform 1 Gate', 1),
                    ('City Plaza', 'Main Mall Boulevard', 2),
                    ('Financial District', 'Bankers Avenue', 3),
                    ('University Campus', 'West Gate', 4),
                    ('Tech Innovation Hub', 'Sector 4 Junction', 5),
                    ('Silicon Tech Park', 'Main Entrance', 6),
                ]
            },
            {
                'route_number': 'R-102', 'route_name': 'North Suburb - City Center Circle',
                'starting_point': 'Greenwood Gardens', 'destination': 'Civic Center Hub',
                'distance': 22.0, 'estimated_time': '50 mins', 'status': 'Active',
                'stops': [
                    ('Greenwood Gardens', 'North Terminal', 1),
                    ('Oakwood Heights', 'High School Circle', 2),
                    ('Suburban Metro', 'Station Plaza', 3),
                    ('Central Hospital', 'Emergency Care Gate', 4),
                    ('Market Square', 'Grand Bazaar', 5),
                    ('Civic Center Hub', 'Terminal 2', 6),
                ]
            },
            {
                'route_number': 'R-103', 'route_name': 'Airport Express Corridor',
                'starting_point': 'Central Bus Terminal', 'destination': 'International Airport T3',
                'distance': 32.5, 'estimated_time': '45 mins', 'status': 'Active',
                'stops': [
                    ('Central Bus Terminal', 'Platform 12', 1),
                    ('Grand Hotel Stop', 'Hospitality Row', 2),
                    ('Convention Center', 'South Hall', 3),
                    ('Express Flyover Stop', 'Highway Junction', 4),
                    ('Airport Terminal 1', 'Domestic Arrival', 5),
                    ('International Airport T3', 'Departure Gate 4', 6),
                ]
            },
            {
                'route_number': 'R-104', 'route_name': 'East Harbor - West Industrial Estate',
                'starting_point': 'Maritime Dockyard', 'destination': 'Western Logistics Park',
                'distance': 26.8, 'estimated_time': '55 mins', 'status': 'Active',
                'stops': [
                    ('Maritime Dockyard', 'Gate A', 1),
                    ('Harbor View Crossing', 'Pier 9', 2),
                    ('Midtown Junction', 'Crossroads Plaza', 3),
                    ('Freight Cargo Yard', 'Depot Entrance', 4),
                    ('Tech Logistics Depot', 'North Gate', 5),
                    ('Western Logistics Park', 'Main Office', 6),
                ]
            },
            {
                'route_number': 'R-105', 'route_name': 'University Ring Route',
                'starting_point': 'Student Housing Village', 'destination': 'Medical Research Institute',
                'distance': 14.2, 'estimated_time': '30 mins', 'status': 'Active',
                'stops': [
                    ('Student Housing Village', 'Dorm 3 Circle', 1),
                    ('Science & Tech Complex', 'Engineering Block', 2),
                    ('Central Library Plaza', 'Academic Square', 3),
                    ('Sports Complex Stadium', 'East Gate', 4),
                    ('Arts & Humanities Quad', 'South Campus', 5),
                    ('Medical Research Institute', 'Hospital Complex', 6),
                ]
            },
        ]

        route_objs = []
        stop_count = 0
        for r_data in routes_data:
            stops_info = r_data.pop('stops')
            route_obj, created = Route.objects.get_or_create(route_number=r_data['route_number'], defaults=r_data)
            route_objs.append(route_obj)
            for stop_name, location, seq in stops_info:
                BusStop.objects.get_or_create(
                    route=route_obj,
                    stop_name=stop_name,
                    defaults={'location': location, 'sequence_number': seq, 'status': 'Active'}
                )
                stop_count += 1

        self.stdout.write(f"Seeded {len(route_objs)} Routes with {stop_count} total Bus Stops.")

        # 4. Seed Applicants & Applications
        applicants_sample = [
            {'name': 'Alex Johnson', 'dob': '1998-05-14', 'gender': 'Male', 'email': 'alex.johnson@example.com', 'phone': '+1 555-1001', 'address': '123 Pine St', 'city': 'Metropolis', 'state': 'NY', 'pincode': '10001', 'org': 'TechCorp Systems', 'id_num': 'EMP-9081'},
            {'name': 'Sarah Williams', 'dob': '2001-09-22', 'gender': 'Female', 'email': 'sarah.williams@example.com', 'phone': '+1 555-1002', 'address': '456 Oak Ave', 'city': 'Metropolis', 'state': 'NY', 'pincode': '10002', 'org': 'State University', 'id_num': 'STU-4412'},
            {'name': 'Michael Brown', 'dob': '1995-11-03', 'gender': 'Male', 'email': 'michael.brown@example.com', 'phone': '+1 555-1003', 'address': '789 Maple Rd', 'city': 'Metropolis', 'state': 'NY', 'pincode': '10003', 'org': 'Global Logistics', 'id_num': 'EMP-7714'},
            {'name': 'Emily Davis', 'dob': '2002-03-18', 'gender': 'Female', 'email': 'emily.davis@example.com', 'phone': '+1 555-1004', 'address': '321 Elm St', 'city': 'Metropolis', 'state': 'NY', 'pincode': '10004', 'org': 'City College', 'id_num': 'STU-9921'},
            {'name': 'Daniel Miller', 'dob': '1989-07-30', 'gender': 'Male', 'email': 'daniel.miller@example.com', 'phone': '+1 555-1005', 'address': '654 Birch Ct', 'city': 'Metropolis', 'state': 'NY', 'pincode': '10005', 'org': 'Financial Trust', 'id_num': 'EMP-2201'},
            {'name': 'Jessica Taylor', 'dob': '1999-12-12', 'gender': 'Female', 'email': 'jessica.taylor@example.com', 'phone': '+1 555-1006', 'address': '987 Cedar Way', 'city': 'Metropolis', 'state': 'NY', 'pincode': '10006', 'org': 'Design Studio X', 'id_num': 'EMP-3319'},
            {'name': 'David Martinez', 'dob': '2003-01-25', 'gender': 'Male', 'email': 'david.martinez@example.com', 'phone': '+1 555-1007', 'address': '147 Walnut Dr', 'city': 'Metropolis', 'state': 'NY', 'pincode': '10007', 'org': 'Institute of Tech', 'id_num': 'STU-6652'},
            {'name': 'Amanda Anderson', 'dob': '1997-08-09', 'gender': 'Female', 'email': 'amanda.anderson@example.com', 'phone': '+1 555-1008', 'address': '258 Ash Blvd', 'city': 'Metropolis', 'state': 'NY', 'pincode': '10008', 'org': 'BioHealth Labs', 'id_num': 'EMP-1198'},
            {'name': 'James Wilson', 'dob': '1992-04-17', 'gender': 'Male', 'email': 'james.wilson@example.com', 'phone': '+1 555-1009', 'address': '369 Spruce St', 'city': 'Metropolis', 'state': 'NY', 'pincode': '10009', 'org': 'Urban Metro Authority', 'id_num': 'EMP-5541'},
            {'name': 'Olivia Thomas', 'dob': '2000-06-05', 'gender': 'Female', 'email': 'olivia.thomas@example.com', 'phone': '+1 555-1010', 'address': '741 Magnolia Ave', 'city': 'Metropolis', 'state': 'NY', 'pincode': '10010', 'org': 'National Medical Academy', 'id_num': 'STU-8823'},
        ]

        app_statuses = ['Issued', 'Issued', 'Issued', 'Approved', 'Pending', 'Pending', 'Rejected', 'Issued', 'Approved', 'Issued']
        
        applications_created = []
        passes_created = []

        for idx, app_info in enumerate(applicants_sample):
            applicant = Applicant.objects.create(
                name=app_info['name'],
                date_of_birth=app_info['dob'],
                gender=app_info['gender'],
                email=app_info['email'],
                phone=app_info['phone'],
                address=app_info['address'],
                city=app_info['city'],
                state=app_info['state'],
                pincode=app_info['pincode'],
                organization=app_info['org'],
                id_number=app_info['id_num']
            )

            route_obj = route_objs[idx % len(route_objs)]
            stops = list(route_obj.stops.all())
            source_stop = stops[0]
            dest_stop = stops[-1]
            pt_obj = pass_type_objs[idx % len(pass_type_objs)]
            st = app_statuses[idx]

            app_code = f"APP-2026{idx+10:02d}"
            today = datetime.date.today()
            start_d = today - datetime.timedelta(days=random.randint(0, 15))

            application = Application.objects.create(
                application_id=app_code,
                applicant=applicant,
                pass_type=pt_obj,
                route=route_obj,
                source_stop=source_stop,
                destination_stop=dest_stop,
                start_date=start_d,
                duration_days=pt_obj.duration_days,
                remarks='Standard application via seed script.',
                status=st,
                rejection_reason='Incomplete document verification proof provided.' if st == 'Rejected' else None
            )
            applications_created.append(application)

            if st == 'Issued':
                pass_num = f"PASS-2026{idx+10:02d}"
                exp_date = start_d + datetime.timedelta(days=pt_obj.duration_days)
                bus_pass = BusPass.objects.create(
                    pass_number=pass_num,
                    application=application,
                    pass_type=pt_obj,
                    route=route_obj,
                    source_stop=source_stop,
                    destination_stop=dest_stop,
                    issue_date=start_d,
                    expiry_date=exp_date,
                    status='Active' if exp_date >= today else 'Expired',
                    qr_identifier=f"VERIFY-{pass_num}-SEEDKEY"
                )
                passes_created.append(bus_pass)

        self.stdout.write(f"Seeded {len(applications_created)} Applications and {len(passes_created)} Bus Passes.")

        # 5. Seed Renewal Records
        if passes_created:
            for idx, p in enumerate(passes_created[:3]):
                ren_code = f"REN-2026{idx+10:02d}"
                ren_status = 'Approved' if idx == 0 else ('Pending' if idx == 1 else 'Rejected')
                Renewal.objects.create(
                    renewal_id=ren_code,
                    bus_pass=p,
                    requested_duration=p.pass_type.duration_days,
                    renewal_fee=p.pass_type.price,
                    status=ren_status,
                    new_expiry_date=p.expiry_date + datetime.timedelta(days=p.pass_type.duration_days) if ren_status == 'Approved' else None,
                    remarks='Renewal request via online seed process.'
                )

        self.stdout.write(self.style.SUCCESS('Successfully completed database seeding!'))
