

from datetime import datetime
import time
import requests

#for i in xrange(0, 3000):
#	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"http://localhost:8080/wordpress/2014/09/25/time-lapse-se", "x2010620328":"2010010298"}
#	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)

for i in xrange(0, 2000):
	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"http://localhost:8080/wordpress/2014/09/25/time-lapse-se", "x2010620328":"2010010299"}
	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)

#for i in xrange(0, 200):
#	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"http://localhost:8080/wordpress/2014/09/25/time-lapse-seams-hyperlapse/", "x2010620328":"2018780212"}
#	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)


for i in xrange(0, 9000):
	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"engagement", "x2010620328":"2010010298"}
	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)

for i in xrange(0, 2000):
	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"engagement", "x2010620328":"2010010299"}
	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)

#for i in xrange(0, 2000):
#	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"engagement", "x2010620328":"2018780212"}
#	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)