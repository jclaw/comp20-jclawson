// Initialization
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization and connect to database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nodemongoexample';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post('/sendLocation', function(request, response) {
	var login = request.body.login;
	var lat = parseFloat(request.body.lat);
	var lng = parseFloat(request.body.lng);
	var date = new Date();
	db.collection('locations', function(error1, coll) {
		
		var id = coll.update({login: login}, {$set: {lat: lat, lng: lng, created_at: date}}, {upsert: true}, function(error2, saved) {
			if (!login || !lat || !lng || error2 || error1) {
				response.send('{"error":"Whoops, something is wrong with your data!"}');
			}
			else {
				coll.find({}).toArray(function(err, results) {
					response.send(results);
				});
			}
	    });

	});
});

app.get('/location.json', function(request, response) {
	var login = request.query.login;
	db.collection('locations').find({login: login}).toArray(function(err, results) {
		response.send(results);
	});
});

app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	var options = {
		"sort": "created_at"
	};
	db.collection('locations', function(er, collection) {
		collection.find({}, options).toArray(function(err, cursor) {
			if (!err) {
				indexPage += "<!DOCTYPE HTML><html><head><title>Location Server</title></head><body><h1>Location Server</h1>";
				for (var count = cursor.length - 1; count >= 0; count--) {
					indexPage += "<p>" + cursor[count].login + " checked in at " + cursor[count].lat + ", " + cursor[count].lng + " on " + cursor[count].created_at + "</p>";
				}
				indexPage += "</body></html>"
				response.send(indexPage);
			} else {
				response.send('<!DOCTYPE HTML><html><head><title>What Did You Feed Me?</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}
		});
	});
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);
