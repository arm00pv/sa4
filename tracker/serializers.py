from rest_framework import serializers
from .models import Company, Employee, License

class LicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = License
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    licenses = LicenseSerializer(many=True, read_only=True)
    class Meta:
        model = Employee
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    employees = EmployeeSerializer(many=True, read_only=True)
    class Meta:
        model = Company
        fields = '__all__'
