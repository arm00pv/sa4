import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

from celery.schedules import crontab

app.conf.beat_schedule = {
    'check-expiring-licenses-daily': {
        'task': 'tracker.tasks.check_expiring_licenses',
        'schedule': crontab(hour=8, minute=0), # Run daily at 8 AM
    },
}
