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
        2. 对于活动的userinfo, run, final集合:
          1) 检查redis存储中是否有本次活动的记录，如果没有，返回。
          2) 读取redis数据转换到sql数据库
          3) 若数据转换成功，并且delete_after_saved为True，删除该集合
        3. 如果在2中对数据库添加了数据，为该活动的成绩单独归档
        4. 如果delete_after_saved为True，删除活动对应的scores, record:scores和record:ranks集合

        :param activity: 代表活动的models#Activity实例
        :return: None
        """
        delete_after_saved = datetime.datetime.now() > activity.end_at

        self.full_archive(activity)
        self.archive_user_info(activity, delete_after_saved)
        self.archive_run(activity, delete_after_saved)
        self.archive_final_score(activity, delete_after_saved)

        if delete_after_saved:
            self.redis.delete('game:{}:scores'.format(activity.id))
            self.redis.delete('game:{}:record:ranks'.format(activity.id))
            self.redis.delete('game:{}:record:scores'.format(activity.id))

    def archive_user_info(self, activity, delete_after_saved=False):
        """保存某次游戏的用户信息

        :param activity: 代表活动的models#Activity实例
        :param delete_after_saved: 是否要在归档完数据后删除redis内数据
        :return: (int)插入记录条数
        """
        key = 'game:{}:userinfo'.format(activity.id)
        if not self.redis.exists(key):
            return 0
        UserInfo.delete().where(UserInfo.game == activity.id).execute()
        count = 0
        for uid, userinfo in iteritems(self.redis.hgetall(key)):
            _data = json.loads(userinfo)
            data = {
                'info_field_1': _data.get('info_field_1'),
                'info_field_2': _data.get('info_field_2'),
                'info_field_3': _data.get('info_field_3')
            }
            data.update({'uid': uid, 'game': activity.id})
            if UserInfo.insert(**data).execute():
                count += 1
        else:
            if delete_after_saved:
                self.redis.delete(key)
        return count

    def archive_run(self, activity, delete_after_saved=False):
        """保存某次游戏运行信息

        :param activity: 代表活动的models#Activity实例
        :param delete_after_saved: 是否要在归档完数据后删除redis内数据
        :return: (int)插入记录条数
        """
        key = 'game:{}:run'.format(activity.id)
        if not self.redis.exists(key):
            return 0
        Run.delete().where(Run.game == activity.id).execute()
        start_time = self.redis.hgetall('game:{}:start'.format(activity.id))
        end_time = self.redis.hgetall('game:{}:end'.format(activity.id))
        count = 0
        for run_id, uid in iteritems(self.redis.hgetall(key)):
            Run.insert(run_id=run_id,
                       uid=uid,
                       start=start_time.get(run_id),
                       end=end_time.get(run_id),
                       game=activity.id).execute()
            count += 1
        else:
            if delete_after_saved:
                self.redis.delete(key)
        return count

    def archive_final_score(self, activity, delete_after_saved=False):
        """保存某次游戏最终分数

        :param activity: 代表活动的models#Activity实例
        :param delete_after_saved: 是否要在归档完数据后删除redis内数据
        :return: (int)插入记录条数
        """
        key = 'game:{}:final'.format(activity.id)
        if not self.redis.exists(key):
            return 0
        FinalScore.delete().where(FinalScore.game == activity.id).execute()
        count = 0
        for run_id, score in iteritems(self.redis.hgetall(key)):
            FinalScore.insert(run_id=run_id, score=score, game=activity.id).execute()
            count += 1
        else:
            if delete_after_saved:
                self.redis.delete(key)
        return count

    def full_archive(self, activity):
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
            record.update({'score': score})
            records.append(record)

        if records:
            records = sorted(records, key=lambda r: r.get('score'), reverse=True)
            Archive.delete().where(Archive.game == activity).execute()
            with db.database.atomic():
                Archive.insert_many(records).execute()
