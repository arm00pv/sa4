from rest_framework import viewsets
from .models import Company, Employee, License
from .serializers import CompanySerializer, EmployeeSerializer, LicenseSerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class LicenseViewSet(viewsets.ModelViewSet):
    queryset = License.objects.all()
    serializer_class = LicenseSerializer
