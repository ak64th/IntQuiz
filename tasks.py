# coding: utf-8
from PIL import Image
import os
import simplejson
from app import app
from models import *
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

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


class UploadNotAllowed(Exception):
    pass


def chunks(l, n):
    for i in range(0, len(l), n):
        yield l[i:i + n]


def generate_json_files_for_activity(activity, welcome_img=None):
    config = {}
    dist_path = os.path.join(DIST_ROOT, activity.code)

    if not os.path.exists(dist_path):
        os.makedirs(dist_path)

    def save_image(storage):
        if not isinstance(storage, FileStorage):
            raise TypeError("storage must be a werkzeug.FileStorage")
        image_file = secure_filename(storage.filename)
        target = os.path.join(dist_path, image_file)
        image = Image.open(storage)
        image.thumbnail((1024, 1024), Image.ANTIALIAS)
        image.save(target, image.format)
        return image_file

    if welcome_img:
        config['welcome_img'] = save_image(welcome_img)

    file_counter = 1
    singles = []
    multiples = []

    for chunk in chunks(activity.book.questions.where(Question.type == Question.SINGLE), 20):
        filename = '%d.json' % file_counter
        full_path = os.path.join(dist_path, filename)
        file_counter += 1
        generate_json_for_questions(chunk, full_path)
        singles.append(filename)

    for chunk in chunks(activity.book.questions.where(Question.type == Question.MULTI), 20):
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

    config_filename = os.path.join(dist_path, 'config.json')
    with open(config_filename, 'w') as f:
        simplejson.dump(config, f)


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
