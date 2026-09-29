from rest_framework.routers import DefaultRouter
from .views import PassTypeViewSet

router = DefaultRouter()
router.register(r'', PassTypeViewSet, basename='pass-types')

urlpatterns = router.urls
