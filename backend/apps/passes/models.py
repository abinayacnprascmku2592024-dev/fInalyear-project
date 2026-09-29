import io
import uuid
import random
import string
import qrcode
from django.db import models
from django.core.files.base import ContentFile
from apps.applications.models import Application
from apps.pass_types.models import PassType
from apps.routes.models import Route, BusStop

def generate_pass_number():
    chars = ''.join(random.choices(string.digits, k=6))
    return f"PASS-{chars}"

class BusPass(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Expired', 'Expired'),
        ('Suspended', 'Suspended'),
        ('Cancelled', 'Cancelled'),
    )

    pass_number = models.CharField(max_length=30, unique=True, default=generate_pass_number)
    application = models.ForeignKey(Application, related_name='passes', on_delete=models.CASCADE)
    pass_type = models.ForeignKey(PassType, on_delete=models.PROTECT)
    route = models.ForeignKey(Route, on_delete=models.PROTECT)
    source_stop = models.ForeignKey(BusStop, related_name='source_passes', on_delete=models.PROTECT)
    destination_stop = models.ForeignKey(BusStop, related_name='dest_passes', on_delete=models.PROTECT)
    issue_date = models.DateField()
    expiry_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    qr_identifier = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    qr_code_image = models.ImageField(upload_to='passes/qr_codes/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bus_passes'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.pass_number} - {self.application.applicant.name} ({self.status})"

    def save(self, *args, **kwargs):
        if not self.qr_code_image:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr_data = f"VERIFY-BUS-PASS:{self.pass_number}:{self.qr_identifier}"
            qr.add_data(qr_data)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")
            
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            file_name = f"qr_{self.pass_number}.png"
            self.qr_code_image.save(file_name, ContentFile(buffer.getvalue()), save=False)

        super().save(*args, **kwargs)
