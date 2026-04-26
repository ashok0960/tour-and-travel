from django.db import migrations, models
import bookings.models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0002_remove_booking_vendor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='travel_date',
            field=models.DateField(validators=[bookings.models.validate_not_past]),
        ),
    ]
