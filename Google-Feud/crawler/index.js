var log = require('color-logs')(true, true, __filename);
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

var fileLocation = "./data/queries.txt";

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
		var Craw = require("./craw");
		var query = req.body.query;
		Craw.Suggest(query, function(data){
			res.send(data);
		});
	});
	app.post("/add", function(req, res){
		var query = req.body.query;
		log.Debug("adding " + query);
		fs.open(fileLocation, "a+", function(e, file){
			fs.write(file, query+" \n", "utf-8", function(){
				fs.close(file);
			});
		});
	});

});