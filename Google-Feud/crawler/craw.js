var log = require('color-logs')(true, true, __filename);
var Constants = require("./libs/Constants");

var request = require("request");
var iconv  = require("iconv-lite");
var xml2js = require("xml2js");
var parser = new xml2js.Parser();

function Crawler (){

	var suggest = function(query, callback){
		var url = Constants.SuggestUrl + query;
		log.Debug("calling " + url);
		request({ uri: url, method: "GET", encoding: null }, function(error, response, body){
			body = iconv.decode(new Buffer(body), "ISO-8859-1");
			log.Debug(body);
			if(error || response.statusCode != 200){
				log.Error("ERROR!", error);
				callback("error processing suggest");
			}
			parser.parseString(body, function(err, data){
				if(err){
					log.Error(err);
					callback("error processing xml");
				}
				var result = [];
				data.toplevel.CompleteSuggestion.forEach(function(i){
					var item = examine(query, i.suggestion[0].$.data);
					if(item)
						result.push(item);
				});
				callback(result.join("\n"));
			});
		});
	}

	var examine = function(query, item){
		if(item == query) return false;
		return item;
	}

	return {
		Suggest: suggest
	};

}

module.exports = new Crawler();
