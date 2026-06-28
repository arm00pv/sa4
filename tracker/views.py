from rest_framework import viewsets, exceptions
from .models import Company, Employee, License
from .serializers import CompanySerializer, EmployeeSerializer, LicenseSerializer

class TenantMixin:
    """
    Mixin to filter querysets and enforce isolation based on X-Company-ID header.
    In production, this would use request.user.company.
    """
    def get_company_id(self):
        company_id = self.request.headers.get('X-Company-ID')
        if not company_id:
            raise exceptions.PermissionDenied("X-Company-ID header is required for access.")
        return company_id

class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    
    def get_queryset(self):
        # Users can only see their own company
        company_id = self.request.headers.get('X-Company-ID')
        if company_id:
            return Company.objects.filter(id=company_id)
        return Company.objects.none()

class EmployeeViewSet(TenantMixin, viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        company_id = self.get_company_id()
        return Employee.objects.filter(company_id=company_id)
        
    def perform_create(self, serializer):
        company_id = self.get_company_id()
        company = Company.objects.get(id=company_id)
        serializer.save(company=company)

class LicenseViewSet(TenantMixin, viewsets.ModelViewSet):
    serializer_class = LicenseSerializer

    def get_queryset(self):
        company_id = self.get_company_id()
        return License.objects.filter(employee__company_id=company_id)
