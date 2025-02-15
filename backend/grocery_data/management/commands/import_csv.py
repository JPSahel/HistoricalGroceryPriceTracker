import csv
from datetime import datetime
from django.core.management.base import BaseCommand
from grocery_data.models import Grocery, GroceryPrice


class Command(BaseCommand):
    help = "Import grocery prices from a long-format CSV file."

    def add_arguments(self, parser):
        parser.add_argument(
            'csv_file',
            type=str,
            help="Path to the long-format CSV file."
        )

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        self.stdout.write(f"Importing grocery prices from {csv_file}...")

        with open(csv_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Expecting CSV columns: "Item", "Price", "Date"
                item_name = row.get("Item", "").strip()
                if not item_name:
                    self.stdout.write(self.style.WARNING(f"Skipping row due to missing 'Item' name: {row}"))
                    continue  # Skip rows with null or empty name

                # Parse the date (assuming format YYYY-MM-DD)
                date_str = row.get("Date", "").strip()
                try:
                    date_value = datetime.strptime(date_str, '%Y-%m-%d').date()
                except ValueError as e:
                    self.stdout.write(self.style.WARNING(f"Skipping row due to invalid date '{date_str}': {e}"))
                    continue

                # Convert price to float or None if missing/invalid
                price_str = row.get("Price", "").strip()
                if price_str == "":
                    price_value = None
                else:
                    try:
                        price_value = float(price_str)
                    except ValueError:
                        self.stdout.write(self.style.WARNING(f"Invalid price value '{price_str}' for item {item_name}. Setting price to None."))
                        price_value = None

                # Create or retrieve the Grocery instance
                grocery_obj, created = Grocery.objects.get_or_create(name=item_name)
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created Grocery: {item_name}"))

                # Create or update the GroceryPrice record for this date
                GroceryPrice.objects.update_or_create(
                    grocery=grocery_obj,
                    date=date_value,
                    defaults={'price': price_value}
                )
                self.stdout.write(self.style.NOTICE(f"Processed {item_name} on {date_value}"))

        self.stdout.write(self.style.SUCCESS("CSV import complete!"))
