from rest_framework.routers import DefaultRouter
from .views import BusViewSet

router = DefaultRouter()
router.register(r'', BusViewSet, basename='buses')

urlpatterns = router.urls
