from rest_framework.routers import DefaultRouter
from .views import RenewalViewSet

router = DefaultRouter()
router.register(r'', RenewalViewSet, basename='renewals')

urlpatterns = router.urls
