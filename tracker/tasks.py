import logging
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from twilio.rest import Client
from django.conf import settings
from .models import License
from django.core.mail import send_mail

logger = logging.getLogger(__name__)

@shared_task
def check_expiring_licenses():
    today = timezone.now().date()
    target_days = [60, 30, 7]
    
    logger.info("Starting daily license expiration check...")
    
    # Initialize Twilio Client (Safe fallback for mock credentials)
    twilio_client = None
    if settings.TWILIO_ACCOUNT_SID != 'mock_sid':
        try:
            twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        except Exception as e:
            logger.error(f"Failed to initialize Twilio client: {e}")

    for days in target_days:
        target_date = today + timedelta(days=days)
        expiring_licenses = License.objects.filter(expiration_date=target_date)
        
        for license in expiring_licenses:
            employee = license.employee
            message = f"URGENT: {employee.name}, your {license.title} expires in {days} days on {license.expiration_date}. Please renew immediately."
            
            # Send SMS
            if employee.phone:
                if twilio_client:
                    try:
                        twilio_client.messages.create(
                            body=message,
                            from_=settings.TWILIO_FROM_NUMBER,
                            to=employee.phone
                        )
                        logger.info(f"Sent SMS to {employee.phone}")
                    except Exception as e:
                        logger.error(f"Failed to send SMS to {employee.phone}: {e}")
                else:
                    logger.info(f"[MOCK SMS] To {employee.phone}: {message}")
            
            # Send Email
            if employee.email:
                try:
                    send_mail(
                        subject=f"License Expiration Warning: {license.title}",
                        message=message,
                        from_email='compliance@tracker.com',
                        recipient_list=[employee.email],
                        fail_silently=True,
                    )
                    logger.info(f"Sent Email to {employee.email}")
                except Exception as e:
                    logger.error(f"Failed to send Email to {employee.email}: {e}")
                    
    logger.info("License expiration check completed.")
    return "Success"
