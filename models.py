# coding=utf-8
import datetime
from peewee import *
from flask_peewee.auth import BaseUser
from app import db


class IntListField(TextField):
    sep = u','

    def db_value(self, value):
        return self.sep.join(map(self.coerce, value))

    def python_value(self, value):
        value = self.coerce(value).split(self.sep)
        return value and map(int, value) or None


class Base(db.Model):
    created = DateTimeField(default=datetime.datetime.now)
    modified = DateTimeField(default=datetime.datetime.now)

    def save(self, *args, **kwargs):
        self.modified = datetime.datetime.now()
        return super(Base, self).save(*args, **kwargs)

    class Meta:
        order_by = ('-created', '-modified')


class User(Base, BaseUser):
    username = CharField()
    password = CharField()
    active = BooleanField(default=True)
    admin = BooleanField(default=False)

    def __unicode__(self):
        return self.username


class QuizBook(Base):
    title = TextField()
    user = ForeignKeyField(User, 'books')


class Question(Base):
    SINGLE = 1
    MULTI = 2
    TYPE_CHOICE = (
        (SINGLE, u'单选'),
        (MULTI, u'多选'),
    )

    content = TextField()
    type = IntegerField(choices=TYPE_CHOICE)
    correct_option = IntListField()
    option_A = TextField(null=True)
    option_B = TextField(null=True)
    option_C = TextField(null=True)
    option_D = TextField(null=True)
    option_E = TextField(null=True)
    option_F = TextField(null=True)
    book = ForeignKeyField(QuizBook, on_delete='CASCADE')

