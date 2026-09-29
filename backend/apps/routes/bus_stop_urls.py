from rest_framework.routers import DefaultRouter
from .views import BusStopViewSet

router = DefaultRouter()
router.register(r'', BusStopViewSet, basename='bus-stops')

urlpatterns = router.urls
