import random
import string
from django.db import models
from apps.pass_types.models import PassType
from apps.routes.models import Route, BusStop

def generate_app_id():
    chars = ''.join(random.choices(string.digits, k=6))
    return f"APP-{chars}"

class Applicant(models.Model):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )

    name = models.CharField(max_length=150)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    organization = models.CharField(max_length=150, help_text="College/School/Company Name")
    id_number = models.CharField(max_length=50)
    photo = models.FileField(upload_to='applicants/photos/', blank=True, null=True)
    id_proof = models.FileField(upload_to='applicants/id_proofs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'applicants'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.email})"


class Application(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Issued', 'Issued'),
        ('Cancelled', 'Cancelled'),
        ('Expired', 'Expired'),
    )

    application_id = models.CharField(max_length=30, unique=True, default=generate_app_id)
    applicant = models.ForeignKey(Applicant, related_name='applications', on_delete=models.CASCADE)
    pass_type = models.ForeignKey(PassType, on_delete=models.PROTECT)
    route = models.ForeignKey(Route, on_delete=models.PROTECT)
    source_stop = models.ForeignKey(BusStop, related_name='source_applications', on_delete=models.PROTECT)
    destination_stop = models.ForeignKey(BusStop, related_name='dest_applications', on_delete=models.PROTECT)
    start_date = models.DateField()
    duration_days = models.IntegerField(default=30)
    remarks = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    rejection_reason = models.TextField(blank=True, null=True)
    application_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'applications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.application_id} - {self.applicant.name} ({self.status})"
