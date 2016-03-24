# coding=utf-8
from flask import request
from flask_peewee.rest import RestAPI, RestrictOwnerResource, Authentication, RestResource

from app import app
from auth import auth
from models import User


class IntAuthentication(Authentication):
    def __init__(self, auth, protected_methods=None):
        super(IntAuthentication, self).__init__(protected_methods)
        self.auth = auth

    def authorize(self):
        if request.method in self.protected_methods:
            return False
        return self.auth.get_logged_in_user()


class IntOwnerResource(RestrictOwnerResource):
    owner_field = 'user'

    def validate_owner(self, user, obj):
        return user.admin or user == getattr(obj, self.owner_field)


class UserResource(RestResource):
    exclude = ('password',)


user_auth = IntAuthentication(auth)

api = RestAPI(app, prefix='/api', default_auth=user_auth)

api.register(User, UserResource)
