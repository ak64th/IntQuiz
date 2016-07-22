# coding=utf-8
import datetime
import redis
import simplejson as json
from peewee import JOIN
from six import iteritems
from app import db
from models import UserInfo, Run, FinalScore, Archive


class ArchiveManager(object):
    """
    管理成绩存档
    """

    def __init__(self, redis_client=None):
        self.redis = redis_client or redis.StrictRedis(decode_responses=True)

    def archive(self, activity):
        """保存某次活动的成绩记录

        redis内对于每次活动存储了5个hash字典，分别是
        userinfo - key: uid, value: 用户信息json字符串
        run - key: run_id, value: uid
        record:scores - key: uid, value: 最好分数
        record:ranks - key: uid, value: 最好名次
        final - key: run_id, value: 分数
        其中如果活动没有设置用户信息字段，则不会分配uid，只会存在final集合
        为每个活动创建一张成绩排名表，按成绩高低存放记录。

        另外还有一个key和score都是得分的sorted set
        scores - key: 分数, score: 分数

        1. 检查活动是否已经结束，如果活动已经结束，设定flag delete_after_saved为True
        2. 为该活动的成绩单独归档
        3. 对于活动的userinfo, run, final集合:
          1) 检查redis存储中是否有本次活动的记录，如果没有，返回。
          2) 读取redis数据转换到sql数据库
          3) 若数据转换成功，并且delete_after_saved为True，删除该集合
        4. 如果delete_after_saved为True，删除活动对应的scores, record:scores和record:ranks集合

        :param activity: 代表活动的models#Activity实例
        :return: None
        """
        delete_after_saved = datetime.datetime.now() > activity.end_at
        self.full_archive(activity, delete_after_saved)
        if delete_after_saved:
            self.redis.delete('game:{}:scores'.format(activity.id))
            self.redis.delete('game:{}:record:ranks'.format(activity.id))
            self.redis.delete('game:{}:record:scores'.format(activity.id))

    def full_archive(self, activity, delete_after_saved=False):
        pk = activity.id
        REDIS_KEY_RUN = 'game:{}:run'.format(pk)
        REDIS_KEY_START = 'game:{}:start'.format(pk)
        REDIS_KEY_END = 'game:{}:end'.format(pk)
        REDIS_KEY_USER = 'game:{}:userinfo'.format(pk)
        REDIS_KEY_FINAL = 'game:{}:final'.format(pk)

        records = []
        runs = self.redis.hgetall(REDIS_KEY_RUN)
        starts = self.redis.hgetall(REDIS_KEY_START)
        ends = self.redis.hgetall(REDIS_KEY_END)
        users = self.redis.hgetall(REDIS_KEY_USER)
        scores = self.redis.hgetall(REDIS_KEY_FINAL)
        for run_id, uid in iteritems(runs):
            record = {
                'run_id': run_id,
                'uid': uid,
                'start': starts.get(run_id),
                'end': ends.get(run_id),
                'game': pk
            }
            user = users.get(uid)
            if user:
                userinfo = json.loads(user)
            else:
                userinfo = {}
            record.update({
                'info_field_1': userinfo.get('info_field_1'),
                'info_field_2': userinfo.get('info_field_2'),
                'info_field_3': userinfo.get('info_field_3')
            })
            score = scores.get(run_id, 0)
            record.update({'score': int(score)})
            records.append(record)

        if records:
            records = sorted(records, key=lambda r: r.get('score'), reverse=True)
            Archive.delete().where(Archive.game == activity).execute()
            with db.database.atomic():
                for idx in range(0, len(records), 100):
                    Archive.insert_many(records[idx:idx + 100]).execute()

        if delete_after_saved:
            self.redis.delete(REDIS_KEY_RUN)
            self.redis.delete(REDIS_KEY_START)
            self.redis.delete(REDIS_KEY_END)
            self.redis.delete(REDIS_KEY_USER)
            self.redis.delete(REDIS_KEY_FINAL)
