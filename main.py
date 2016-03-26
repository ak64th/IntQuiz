# coding=utf-8
import logging
import logging.handlers
import openpyxl
import os

from flask import flash, g, request, render_template, jsonify, make_response, url_for
from peewee import create_model_tables
from flask_peewee.utils import make_password

from app import app, db
from auth import auth
from api import api
from models import User, QuizBook, Question
import excel_tools

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


@app.route('/quizbooks', methods=['GET', 'POST'])
@auth.login_required
def quiz_book_list():
    if request.method == 'POST':
        book_name = request.form.get('name')
        book_file = request.files['file']
        if not book_name:
            flash(u'未输入题库名字', 'warning')
        elif QuizBook.select().where(QuizBook.title == book_name).count():
            flash(u'题库名字重复', 'danger')
        elif book_file:
            handle_sheet_file(book_name, book_file)
        else:
            flash(u'未选择文件', 'warning')
    return render_template('books.html')


def handle_sheet_file(title, f):
    allowed_extensions = ('.xlsx', '.xlsm')
    ext = os.path.splitext(f.filename)[1]
    if ext not in allowed_extensions:
        flash(u'不支持的文件扩展名，只支持{}格式'
              .format(','.join(allowed_extensions)), 'danger')
        return
    wb = openpyxl.load_workbook(f, read_only=True)
    ws = wb.active
    if ws.max_row < 2:
        flash(u'文件不包含题目', 'danger')
        return
    rows = ws.iter_rows("A2:I%s" % ws.max_row)

    validated, error_info = excel_tools.validate_rows(rows)
    missing = error_info.get('missing')
    duplications = error_info.get('duplications')
    seen = error_info.get('seen')
    invalid_type = error_info['invalid_type']
    invalid_correct_option = error_info['invalid_correct_option']
    if missing:
        flash(u'''第{}行缺少字段，必须有题目内容，类型，正确答案和至少一个选项，'''
              .format(','.join(map(str, missing))), 'danger')
    if duplications:
        for k, v in duplications.items():
            flash(u'''第{}行与第{}行内容重复。'''
                  .format(','.join(map(str, v)), seen[k]), 'danger')
    if invalid_type:
        flash(u'''第{}行题目类型错误，必须是“单选”或“多选”，'''
              .format(','.join(map(str, invalid_type))), 'danger')
    if invalid_correct_option:
        flash(u'''
        第{}行正确答案长度和题目类型不符，或是对应答案单元格内容为空。
        注意是不是输入答案时填在下一个单元格了。
        '''.format(','.join(map(str, invalid_correct_option))), 'danger')
    if not any((missing, duplications, invalid_type, invalid_correct_option)):
        database = db.database
        with database.atomic():
            book = QuizBook.create(title=title, user=g.user)
            for row in validated:
                row['book'] = book.id
            Question.insert_many(validated).execute()
        count = Question.select().where(Question.book == book).count()
        flash(u"""保存成功，目前该题库共有{}题""".format(count), 'success')


def init_db():
    to_create = User, QuizBook, Question
    create_model_tables(models=to_create, fail_silently=True)
    # 创建测试用户
    defaults = dict(password=make_password('123456'))
    User.get_or_create(username='admin', admin=True, defaults=defaults)
    User.get_or_create(username=u'王禄', admin=False, defaults=defaults)


if __name__ == '__main__':
    logger = logging.getLogger('peewee')
    logger.setLevel(logging.DEBUG)
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
    logger.addHandler(stream_handler)

    init_db()
    app.run(host='0.0.0.0', debug=True, threaded=True)