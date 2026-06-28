from rest_framework import viewsets, exceptions
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.http import HttpResponse
import csv
from .models import Company, Employee, License
from .serializers import CompanySerializer, EmployeeSerializer, LicenseSerializer

class TenantMixin:
    """
    Mixin to filter querysets and enforce isolation based on Authenticated User's Company.
    """
    permission_classes = [IsAuthenticated]

    def get_company_id(self):
        if not hasattr(self.request.user, 'profile'):
            raise exceptions.PermissionDenied("User is not associated with a company.")
        return self.request.user.profile.company_id

class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if not hasattr(self.request.user, 'profile'):
            return Company.objects.none()
        return Company.objects.filter(id=self.request.user.profile.company_id)

class EmployeeViewSet(TenantMixin, viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        company_id = self.get_company_id()
        return Employee.objects.filter(company_id=company_id)
        
    def perform_create(self, serializer):
        company_id = self.get_company_id()
        company = Company.objects.get(id=company_id)
        serializer.save(company=company)
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        company_id = self.get_company_id()
        employees = Employee.objects.filter(company_id=company_id).prefetch_related('licenses')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="compliance_report.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Employee Name', 'Email', 'Phone', 'Total Licenses'])
        
        for emp in employees:
            writer.writerow([emp.name, emp.email, emp.phone, emp.licenses.count()])
            
        return response


class LicenseViewSet(TenantMixin, viewsets.ModelViewSet):
    serializer_class = LicenseSerializer

    def get_queryset(self):
        company_id = self.get_company_id()
        return License.objects.filter(employee__company_id=company_id)
