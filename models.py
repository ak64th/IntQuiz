import datetime
from peewee import *
from flask_peewee.auth import BaseUser
from app import db


class Base(db.Model):
    created = DateTimeField(default=datetime.datetime.now)
    modified = DateTimeField(default=datetime.datetime.now)

    def save(self, *args, **kwargs):
        self.modified = datetime.datetime.now()
        return super(Base, self).save(*args, **kwargs)


class User(Base, BaseUser):
    username = CharField()
    password = CharField()
    active = BooleanField(default=True)
    admin = BooleanField(default=False)

    def __unicode__(self):
        return self.username


class QuizBook(Base):
    title = TextField()