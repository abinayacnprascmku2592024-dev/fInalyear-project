from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin-django/', admin.site.urls),
    path('api/applications/', include('apps.applications.urls')),
    path('api/buses/', include('apps.buses.urls')),
    path('api/routes/', include('apps.routes.urls')),
    path('api/pass-types/', include('apps.pass_types.urls')),
    path('api/bus-stops/', include('apps.routes.bus_stop_urls')),
    path('api/passes/', include('apps.passes.urls')),
    path('api/renewals/', include('apps.renewals.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
