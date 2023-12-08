# database will be here
from os import getenv
import datetime

from peewee import PostgresqlDatabase, Model, TextField, DateTimeField, FloatField, IntegerField
from playhouse.postgres_ext import JSONField

class BaseModel(Model):
    class Meta:
        database = PostgresqlDatabase(
            getenv("DB_NAME"),
            user=getenv("DB_USER"),
            password=getenv("DB_PASSWORD"),
            host=getenv("DB_HOST"),
            port=getenv("DB_PORT"),
        )


class SpiderOutput(BaseModel):
    external_source = TextField(index=True)
    external_link = TextField(index=True, primary_key=True)
    external_id = TextField(null=True)

    country = TextField()
    city = TextField(null=True)
    zipcode = TextField(null=True)
    address = TextField(null=True)
    latitude = TextField(null=True)
    longitude = TextField(null=True)

    title = TextField(null=True)
    description = TextField(null=True)

    property_type = TextField(null=True)
    room_count = FloatField(null=True)
    bathroom_count = FloatField(null=True)
    floor = FloatField(null=True)
    square_meters = FloatField(null=True)

    available_date = DateTimeField(
        null=True, formats=["%d/%m/%Y", "%d/%m/%y", "%Y-%m-%d", "%Y-%m-%d %H:%M:%S"])
    rent = FloatField(null=True)
    prepaid_rent = FloatField(null=True)
    agency_fee = FloatField(null=True)
    deposit = FloatField(null=True)
    utilities = FloatField(null=True)

    images = JSONField(null=True)
    features = JSONField(null=True)

    landlord_name = TextField(null=True)
    landlord_email = TextField(null=True)
    landlord_phone = TextField(null=True)

    created_at = DateTimeField(default=datetime.datetime.now)


class SpiderOutputHistory(SpiderOutput):
    external_link = TextField(index=True)

    class Meta:
        db_table = "spideroutputhistory"
