

from datetime import datetime
import requests

for i in xrange(0, 300):
	parameters = {"a":"1918280687","n":"views_to_page", "x1939520037":"1928461056"}
	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)
