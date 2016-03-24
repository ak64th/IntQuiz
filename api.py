# coding=utf-8
from flask import request, url_for
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


class IntRestResource(RestResource):
    def get_request_metadata(self, paginated_query):
        var = paginated_query.page_var
        request_arguments = request.args.copy()

        current_page = paginated_query.get_page()
        next = previous = ''

        if current_page > 1:
            request_arguments[var] = current_page - 1
            previous = url_for(self.get_url_name('api_list'), **request_arguments)
        if current_page < paginated_query.get_pages():
            request_arguments[var] = current_page + 1
            next = url_for(self.get_url_name('api_list'), **request_arguments)

        return {
            'model': self.get_api_name(),
            'page': current_page,
            'pages': paginated_query.get_pages(),
            'total': paginated_query.query.count(),
            'previous': previous,
            'next': next,
        }


class IntOwnerResource(IntRestResource, RestrictOwnerResource):
    owner_field = 'user'

    def validate_owner(self, user, obj):
        return user.admin or user == getattr(obj, self.owner_field)


class UserResource(IntRestResource):
    exclude = ('password',)


user_auth = IntAuthentication(auth)

api = RestAPI(app, prefix='/api/v1', default_auth=user_auth, name='simple_api')

api.register(User, UserResource)
