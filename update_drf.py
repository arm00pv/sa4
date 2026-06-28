import re
with open('/home/zixen15/sa4/config/settings.py', 'r') as f:
    content = f.read()

drf_config = """REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_THROTTLE_CLASSES': ["""
    
content = content.replace("REST_FRAMEWORK = {\n    'DEFAULT_THROTTLE_CLASSES': [", drf_config)

if 'storages' not in content:
    content = content.replace("'corsheaders',", "'corsheaders',\n    'storages',")

s3_config = """
# AWS S3 Settings (Mock or Real)
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID', 'mock_access_key')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', 'mock_secret_key')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME', 'mock-bucket')
AWS_S3_REGION_NAME = 'us-east-1'
AWS_S3_SIGNATURE_VERSION = 's3v4'
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = None

if AWS_ACCESS_KEY_ID != 'mock_access_key':
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
"""
content += s3_config

with open('/home/zixen15/sa4/config/settings.py', 'w') as f:
    f.write(content)
