# coding=utf-8
from flask import Blueprint, flash, redirect, render_template, request, session, url_for, g
from flask_peewee.auth import Auth
from app import app, db
from models import User


class IntAuth(Auth):
    def get_blueprint(self, blueprint_name):
        return Blueprint(blueprint_name, __name__)

    def get_urls(self):
        return (
            ('/logout/', self.logout),
            ('/login/', self.login),
        )

    def logout_user(self):
        if self.clear_session:
            session.clear()
        else:
            session.pop('logged_in', None)
        g.user = None
        flash(u'已经登出', 'success')

    def logout(self):
        self.logout_user()
        return redirect(request.args.get('next') or self.default_next_url)

    def login_user(self, user):
        session['logged_in'] = True
        session['user_pk'] = user.get_id()
        session.permanent = True
        g.user = user
        flash(u'已经以帐号：%s 登陆' % user.username, 'success')

    def login(self):
        if request.method == 'POST':
            next_url = request.form.get('next') or self.default_next_url
            authenticated_user = self.authenticate(
                request.form.get('username'),
                request.form.get('password'),
            )
            if authenticated_user:
                self.login_user(authenticated_user)
                return redirect(next_url)
            else:
                flash(u'用户名或密码错误', 'warning')
        else:
            next_url = request.args.get('next')
        return render_template(
            'login.html',
            login_url=url_for('%s.login' % self.blueprint.name),
            next=next_url)


auth = IntAuth(app, db, user_model=User, prefix='/auth', name='auth')
