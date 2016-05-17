# coding=utf-8
"""
定时任务
"""
import logging
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.executors.pool import ThreadPoolExecutor
from pytz import timezone
import redis
from app import app
from archive import ArchiveManager
from models import Activity

if 'REDIS' in app.config:
    redis_client = redis.StrictRedis.from_url(app.config['REDIS'], decode_responses=True)
else:
    redis_client = redis.StrictRedis(decode_responses=True)

manager = ArchiveManager(redis_client)


def archive():
    for activity in Activity.select().execute():
        manager.archive(activity)


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger('quiz_task')
    logger.addHandler(logging.StreamHandler())
    executors = {'default': ThreadPoolExecutor(20)}
    scheduler = BlockingScheduler(logger=logger, executors=executors, timezone=timezone('Asia/Shanghai'))
    scheduler.add_job(archive, trigger='cron', hour='1')
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass