import re
with open('/home/zixen15/sa4/config/urls.py', 'r') as f:
    content = f.read()

imports = """from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
"""
content = content.replace("from django.urls import path, include", imports)

urls = """urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
"""
content = content.replace("urlpatterns = [", urls)

with open('/home/zixen15/sa4/config/urls.py', 'w') as f:
    f.write(content)
