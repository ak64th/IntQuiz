# coding=utf-8
import datetime
import redis
import simplejson as json
from peewee import JOIN
from six import iteritems
from models import UserInfo, Run, FinalScore


def archive_activity_rank(activity):
    archive_model = activity.archive_model
    archive_model.drop_table(fail_silently=True)
    archive_model.create_table()
    source = (Run
              .select(Run.run_id, UserInfo.uid, UserInfo.info_field_1, UserInfo.info_field_2,
                      UserInfo.info_field_3, FinalScore.score)
              .join(UserInfo, JOIN.LEFT_OUTER,
                    on=((Run.uid == UserInfo.uid) & (Run.game == UserInfo.game)))
              .join(FinalScore, JOIN.LEFT_OUTER,
                    on=((Run.run_id == FinalScore.run_id) & (Run.game == UserInfo.game)))
              .where((Run.game == activity) & (FinalScore.score > 0))
              .order_by(FinalScore.score.desc()))
    archive_model.insert_from([
        archive_model.run_id,
        archive_model.uid,
        archive_model.info_field_1,
        archive_model.info_field_2,
        archive_model.info_field_3,
        archive_model.score
    ], source)


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

        count = 0
        count += self.archive_user_info(activity, delete_after_saved)
        count += self.archive_run(activity, delete_after_saved)
        count += self.archive_final_score(activity, delete_after_saved)

        if count:
            archive_activity_rank(activity)

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
            data = json.loads(userinfo)
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
        count = 0
        for run_id, uid in iteritems(self.redis.hgetall(key)):
            Run.insert(run_id=run_id, uid=uid, game=activity.id).execute()
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
