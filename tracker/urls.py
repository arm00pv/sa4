from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, EmployeeViewSet, LicenseViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'licenses', LicenseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
