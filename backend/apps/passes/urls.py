from rest_framework.routers import DefaultRouter
from .views import BusPassViewSet

router = DefaultRouter()
router.register(r'', BusPassViewSet, basename='passes')

urlpatterns = router.urls
