import os
import sys
settings_path = '/home/zixen15/sa4/config/settings.py'

with open(settings_path, 'r') as f:
    content = f.read()

# Add apps
apps_to_add = ["'rest_framework',", "'corsheaders',", "'tracker',"]
for app in apps_to_add:
    if app not in content:
        content = content.replace("'django.contrib.staticfiles',", f"'django.contrib.staticfiles',\n    {app}")

# Add corsheaders middleware
if "'corsheaders.middleware.CorsMiddleware'," not in content:
    content = content.replace("'django.middleware.security.SecurityMiddleware',", "'django.middleware.security.SecurityMiddleware',\n    'corsheaders.middleware.CorsMiddleware',")

# Allow all origins for phase 1
if "CORS_ALLOW_ALL_ORIGINS" not in content:
    content += "\nCORS_ALLOW_ALL_ORIGINS = True\n"

# Configure Database
db_config = """DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'tracker_db',
        'USER': 'tracker_user',
        'PASSWORD': 'tracker_password',
        'HOST': '127.0.0.1',
        'PORT': '5433',
    }
}
"""
import re
content = re.sub(r"DATABASES = {.*?}\n}", db_config, content, flags=re.DOTALL)

with open(settings_path, 'w') as f:
    f.write(content)
print("Settings updated.")
