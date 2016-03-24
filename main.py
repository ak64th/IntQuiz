# coding=utf-8
import logging
import logging.handlers

from flask import flash, g, request, render_template, jsonify, make_response, url_for
from peewee import create_model_tables
from flask_peewee.utils import make_password

from app import app
from auth import auth
from api import api
from models import QuizBook, User

auth.setup()
api.setup()


@app.route('/')
@auth.login_required
def index():
    return render_template('home.html')


@app.route('/resetPwd', methods=['GET', 'POST'])
@auth.login_required
def reset_password():
    if request.method == 'POST':
        password = request.form.get('password')
        confirm = request.form.get('confirm')
        if password and len(password) < 6:
            flash(u'新密码不能少于六位', 'danger')
        if password and confirm and password == confirm:
            g.user.set_password(password)
            g.user.save()
            flash(u'修改成功', 'success')
        else:
            flash(u'新密码与确认密码不一致', 'danger')
    return render_template('reset.html')


@app.route('/accounts')
@auth.admin_required
def account_list():
    return render_template('accounts.html')


def init_db():
    to_create = User, QuizBook
    create_model_tables(models=to_create, fail_silently=True)
    # 创建测试用户
    defaults = dict(password=make_password('123456'), admin=True)
    User.get_or_create(username='admin', defaults=defaults)


if __name__ == '__main__':
    logger = logging.getLogger('peewee')
    logger.setLevel(logging.DEBUG)
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
    logger.addHandler(stream_handler)

    init_db()
    app.run(host='0.0.0.0', debug=True, threaded=True)