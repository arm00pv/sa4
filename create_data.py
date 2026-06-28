import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from tracker.models import Company, UserProfile

# Create Company
company, _ = Company.objects.get_or_create(name="OmniCorp", domain="omnicorp.com")

# Create User
user, created = User.objects.get_or_create(username="admin")
if created:
    user.set_password("password123")
    user.email = "admin@omnicorp.com"
    user.save()

# Link User Profile
UserProfile.objects.get_or_create(user=user, company=company)
print("Demo data created.")
