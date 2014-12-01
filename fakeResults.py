from __future__ import print_function

# Standard Modules
from datetime import datetime
import json
import time

# Third-Party Modules
import requests
from pprint import *


_ACCOUNT_ID = 1434120272
_API_HOST = "api.optimizely.com"
_EXPERIMENT_ID = 2008461708

# http://www.optimizely.test/admin/account_token?account_id=128
# The fields the above request returns that are interesting:
#   import_token: legacy, never expires
#   temporary_import_token: more secure, expires after 30 days
# (Below is import_token for account 128.)
_IMPORT_TOKEN = "7c3343b8c59cfad80a618c45a8456182"


def main():
  pprint("hello")
  body = json.dumps({
    'events': [
      {
        'buckets': {
          '2008461708': "2003911807"
        },
        'description': "engagement",
        'time': datetime(2014, 9, 27).isoformat(),
        'user_id': "oeu1412620890587r0.6371929526794702"
      },
      {
        'buckets': {
          '2008461708': "2003911808"
        },
        'description': "engagement",
        #'revenue': 1000,
        'time': datetime(2014, 9, 27).isoformat(),
        'user_id': "oeu1412620890587r0.6371929526794702"
      },
      {
        'buckets': {
          '2008461708': "2018780212"
        },
        'description': "engagement",
        #'revenue': 1000,
        'time': datetime(2014, 9, 27).isoformat(),
        'user_id': "oeu1412620890587r0.6371929526794702"
      }
    ]
  })

  url = "https://{}/v1/import/{}?pretty=true&token={}".format(_API_HOST, _ACCOUNT_ID, _IMPORT_TOKEN)

  # Doesn't do SSL verification because our certificate is self-signed and will fail.
  response = requests.post(url, body, verify=False)

  print("Code: {}".format(response.status_code))
  print(response.content)


if __name__ == "__main__":
  main()