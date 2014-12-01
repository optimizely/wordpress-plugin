

from datetime import datetime
import time
import requests

for i in xrange(0, 100):
	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"http://localhost:8080/wordpress/2014/09/25/jim-gaffigan/", "x2015740096":"2026220524", "g":"1998950104"}
	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)

for i in xrange(0, 110):
	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"http://localhost:8080/wordpress/2014/09/25/jim-gaffigan/", "x2015740096":"2026220525", "g":"1998950104"}
	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)

for i in xrange(0, 120):
	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"http://localhost:8080/wordpress/2014/09/25/jim-gaffigan/", "x2015740096":"1999220140", "g":"1998950104"}
	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)


for i in xrange(0, 900):
	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"engagement", "x2015740096":"2026220524", "g": "1909620714"}
	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)

for i in xrange(0, 890):
	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"engagement", "x2015740096":"2026220525", "g": "1909620714"}
	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)

for i in xrange(0, 880):
	parameters = {"a":"1918280687","u":"oeu"+str(i + time.time()), "n":"engagement", "x2015740096":"1999220140", "g": "1909620714"}
	r = requests.get('https://1918280687.log.optimizely.com/event', params=parameters)

	