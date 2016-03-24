# coding=utf-8
import logging
import logging.handlers

from flask import request, render_template, jsonify, make_response, url_for
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


@app.route('/resetPwd')
@auth.login_required
def reset_password():
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