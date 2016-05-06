# coding=utf-8
"""
### 把redis数据归档到sql数据库
"""

import argparse
import redis
import simplejson as json
from six import iteritems

r = redis.StrictRedis(decode_responses=True)

parser = argparse.ArgumentParser(description=u'把redis数据归档到sql数据库')
parser.add_argument('game_id', help=u'游戏id')
args = parser.parse_args()

game_id = args.game_id

userinfos = r.hgetall('game:{}:userinfo'.format(game_id))

for uid, userinfo in iteritems(userinfos):
    try:
        data = json.loads(userinfo)
    except Exception as e:
        print(u'json解码错误', userinfo, e)
        continue
    data.update('uid', uid)
    print(data)