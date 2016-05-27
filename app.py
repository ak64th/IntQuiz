from flask import Flask
from flask_peewee.db import Database
from flask_babel import Babel
from config import Configuration

app = Flask(__name__)
app.config.from_object(Configuration)

db = Database(app)
babel = Babel(app)
