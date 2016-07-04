# coding: utf-8

import os
import errno
import shutil
import simplejson
from app import app
from models import *
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from PIL import Image
import pysftp

DIST_ROOT = app.config['DATA_DIST']

ACTIVITY_TYPES = {
    Activity.ORDINARY: 'ordinary',
    Activity.TIME_LIMIT: 'time_limit',
    Activity.CHALLENGE: 'challenge'
}

QUESTION_TYPES = {
    Question.SINGLE: 'single',
    Question.MULTI: 'multi'
}

QUESTION_CHUNK_LENGTH = 20


class UploadNotAllowed(Exception):
    pass


def save_welcome_img(storage, activity):
    if not isinstance(storage, FileStorage):
        raise TypeError("storage must be a werkzeug.FileStorage")

    allowed_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.svg', '.bmp', '.webp')
    ext = os.path.splitext(storage.filename)[1]
    if not (ext.lower() in allowed_extensions):
        raise UploadNotAllowed(u'不支持的文件扩展名，只支持{}格式'
                               .format(','.join(allowed_extensions)))

    dist_path = os.path.join(app.config['MEDIA_PATH'], 'welcome_image')
    try:
        os.makedirs(dist_path, mode=0o775)
    except OSError as e:
        if e.errno != errno.EEXIST:
            raise

    image_file = secure_filename(activity.code + ext)
    target = os.path.join(dist_path, image_file)

    image = Image.open(storage)
    image.thumbnail((1024, 1024), Image.ANTIALIAS)
    image.save(target, image.format)
    return image_file


def chunks(l, n):
    for i in range(0, len(l), n):
        yield l[i:i + n]


def generate_json_files_for_activity(activity):
    config = {}
    dist_path = os.path.join(DIST_ROOT, activity.code)
    try:
        shutil.rmtree(dist_path)
    except OSError as e:
        if e.errno != errno.ENOENT:
            raise
    os.makedirs(dist_path, mode=0o775)

    file_counter = 1
    singles = []
    multiples = []

    questions = activity.book.questions

    for chunk in chunks(questions.where(Question.type == Question.SINGLE),
                        QUESTION_CHUNK_LENGTH):
        filename = '%d.json' % file_counter
        full_path = os.path.join(dist_path, filename)
        file_counter += 1
        generate_json_for_questions(chunk, full_path)
        singles.append(filename)

    for chunk in chunks(questions.where(Question.type == Question.MULTI),
                        QUESTION_CHUNK_LENGTH):
        filename = '%d.json' % file_counter
        full_path = os.path.join(dist_path, filename)
        file_counter += 1
        generate_json_for_questions(chunk, full_path)
        multiples.append(filename)

    config.update({
        "id": activity.id,
        "name": activity.name,
        "welcome": activity.welcome,
        "type": ACTIVITY_TYPES[activity.type],
        "max_chances": activity.chances,
        "count": {
            "single": activity.single,
            "multi": activity.multi
        },
        "question_files": {
            "single": singles,
            "multi": multiples
        },
        "question_points": {
            "single": activity.single_points,
            "multi": activity.multi_points
        },
        "info_fields": [],
        "start_at": activity.start_at.isoformat() + '+08:00',
        "end_at": activity.end_at.isoformat() + '+08:00',
        "show_answer": activity.show_answer
    })

    if activity.type in (Activity.ORDINARY, Activity.CHALLENGE):
        config['time_per_question'] = activity.time_limit
    if activity.type == Activity.TIME_LIMIT:
        config['time_per_quiz'] = activity.time_limit
        config['time_per_question'] = 0

    for i, field in enumerate(filter(None, [activity.info_field_1, activity.info_field_2, activity.info_field_3]),
                              start=1):
        config['info_fields'].append(['info_field_' + str(i), field])

    if activity.welcome_img:
        config['welcome_img'] = activity.welcome_img
        img_path = os.path.join(app.config['MEDIA_PATH'], 'welcome_image')
        img_file = os.path.join(img_path, activity.welcome_img)
        dist_img_file = os.path.join(dist_path, activity.welcome_img)
        try:
            shutil.copyfile(img_file, dist_img_file)
        except OSError as e:
            app.logger.debug(e.message)

    config_filename = os.path.join(dist_path, 'config.json')
    with open(config_filename, 'w') as f:
        simplejson.dump(config, f)

    upload_files_for_activity(activity)


def generate_json_for_questions(questions, filename):
    objects = []
    for question in questions:
        question_options = filter(None, [question.option_A, question.option_B, question.option_C,
                                         question.option_D, question.option_E, question.option_F])
        options = [{'id': i, 'content': o} for i, o in enumerate(question_options, start=1)]
        objects.append({
            'id': question.id,
            'content': question.content,
            'options': options,
            'answer': map(int, question.correct_option.split(',')),
            'type': QUESTION_TYPES[question.type]
        })
    with open(filename, 'w') as f:
        simplejson.dump({'objects': objects}, f, indent=2, separators=(',', ': '))


def upload_files_for_activity(activity):
    dist_path = os.path.join(DIST_ROOT, activity.code)
    for node_config in app.config['QUIZ_NODES']:
        upload_data(node_config,
                    local=os.path.abspath(dist_path),
                    remote=activity.code)


def upload_data(sftp_config, local, remote):
    with pysftp.Connection(**sftp_config) as sftp:
        sftp.makedirs(remote, mode=755)
        sftp.put_d(local, remote)