# coding=utf-8
import random
import string
import datetime
from peewee import *
from flask_peewee.auth import BaseUser
from app import db

__all__ = ['User', 'QuizBook', 'Question', 'Activity', 'UserInfo', 'Run', 'FinalScore', 'Archive']


class Base(db.Model):
    created = DateTimeField(default=datetime.datetime.now)
    modified = DateTimeField(default=datetime.datetime.now)

    def save(self, *args, **kwargs):
        self.modified = datetime.datetime.now()
        return super(Base, self).save(*args, **kwargs)

    class Meta:
        order_by = ('-id',)


class User(Base, BaseUser):
    username = CharField()
    password = CharField(null=True)
    active = BooleanField(default=True)
    admin = BooleanField(default=False)

    def __unicode__(self):
        return self.username

    def check_password(self, password):
        if not self.password:
            return False
        return super(User, self).check_password(password)

    class Meta:
        order_by = None


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
    correct_option = TextField()
    option_A = TextField(null=True)
    option_B = TextField(null=True)
    option_C = TextField(null=True)
    option_D = TextField(null=True)
    option_E = TextField(null=True)
    option_F = TextField(null=True)
    book = ForeignKeyField(QuizBook, related_name='questions', on_delete='CASCADE')


ACTIVITY_CODE_LENGTH = 8


def _generate_activity_code():
    chars = string.ascii_lowercase + string.digits
    return u''.join([random.choice(chars) for _ in range(ACTIVITY_CODE_LENGTH)])


class Activity(Base):
    ORDINARY = 0
    TIME_LIMIT = 1
    CHALLENGE = 2
    TYPE_CHOICE = (
        (ORDINARY, u'普通模式'),
        (TIME_LIMIT, u'限时模式'),
        (CHALLENGE, u'挑战模式')
    )

    name = TextField()
    welcome = TextField(null=True)
    type = IntegerField(choices=TYPE_CHOICE, default=ORDINARY)
    book = ForeignKeyField(QuizBook)
    chances = IntegerField(default=1000)
    time_limit = IntegerField(default=0)
    single = IntegerField(null=True, verbose_name=u'单选题数量')
    multi = IntegerField(null=True, verbose_name=u'多选题数量')
    single_points = IntegerField(default=10, verbose_name=u'单选题分值')
    multi_points = IntegerField(default=10, verbose_name=u'多选题分值')
    show_answer = BooleanField(default=False, verbose_name=u'是否显示正确答案')
    start_at = DateTimeField()
    end_at = DateTimeField()
    info_field_1 = TextField(null=True)
    info_field_2 = TextField(null=True)
    info_field_3 = TextField(null=True)
    code = TextField(default=_generate_activity_code)
    user = ForeignKeyField(User, verbose_name=u'创建者')

    @property
    def active(self):
        return self.start_at < datetime.datetime.now() < self.end_at


class UserInfo(db.Model):
    uid = IntegerField()
    info_field_1 = TextField(null=True)
    info_field_2 = TextField(null=True)
    info_field_3 = TextField(null=True)
    game = ForeignKeyField(Activity, related_name=u'participants')


class Run(db.Model):
    run_id = CharField()
    uid = IntegerField(null=True)
    start = DateTimeField(null=True)
    end = DateTimeField(null=True)
    game = ForeignKeyField(Activity, related_name=u'runs')


class FinalScore(db.Model):
    run_id = CharField()
    score = IntegerField()
    game = ForeignKeyField(Activity, related_name=u'final_scores')


class Archive(db.Model):
    run_id = CharField()
    uid = IntegerField(null=True)
    info_field_1 = TextField(null=True)
    info_field_2 = TextField(null=True)
    info_field_3 = TextField(null=True)
    score = IntegerField(index=True)
    start = DateTimeField(null=True)
    end = DateTimeField(null=True)
    game = ForeignKeyField(Activity, related_name=u'archives')

    class Meta:
        indexes = (
            (('game', 'score'), False),
        )