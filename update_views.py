import re

with open('/home/zixen15/sa4/tracker/views.py', 'r') as f:
    content = f.read()

imports = """from rest_framework import viewsets, exceptions
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.http import HttpResponse
import csv
from .models import Company, Employee, License
from .serializers import CompanySerializer, EmployeeSerializer, LicenseSerializer"""

content = content.replace("from rest_framework import viewsets, exceptions\nfrom rest_framework.permissions import IsAuthenticated\nfrom .models import Company, Employee, License\nfrom .serializers import CompanySerializer, EmployeeSerializer, LicenseSerializer", imports)

csv_action = """
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
"""

content = content.replace("serializer.save(company=company)", "serializer.save(company=company)" + csv_action)

with open('/home/zixen15/sa4/tracker/views.py', 'w') as f:
    f.write(content)
