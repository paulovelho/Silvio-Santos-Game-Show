var log = require('color-logs')(true, true, __filename);
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var Constants = require("./libs/Constants");
log.Debug(Constants);

app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(8007, function(){

	var template_options = {
		root: __dirname + '/templates/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
	var host = server.address().address;
	var port = server.address().port;

	log.Debug("app listening at  http://%s:%s", host, port);
	
	app.use("/javascript", express.static("javascript"));
	app.get("/", function(req, res){
		res.sendFile("index.html", template_options, function(err){
			if(err) log.Error(err);
		});
	});

	app.post("/feud", function(req, res){
		var query = req.body.query;
		var url = Constants.SuggestUrl + query;
		res.send("looking for " + url);
	});

});