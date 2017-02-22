var dataKeys = require("./keys.js"); //twitter keys from file
var fs = require("fs"); //file system use
var twitter = require("twitter"); //twitter use
var spotify = require("spotify"); //spotify use
var request = require("request"); //request use

// Writing to log.txt file
var writeToLog = function(data) {
	fs.appendFile("log.txt", '\r\n\r\n');
	fs.appendFile("log.txt", JSON.stringify(data), function(err) {
		if (err) {
			return console.log(err);
		}
		console.log("log.txt has been updated!");
	});
}

// This is the function for finding artist from spotify
var getArtist = function(artist) {
	return artist.name;
};

var getSpotify = function(songName) {
	if (songName == undefined) {
		songName = "Bad";
	};
	spotify.search({ type: "track", query: songName }, function(err, data) {
		if (err) {
			console.log("Error Occurred: " + err);
			return;
		}
		var songs = data.tracks.items;
		var data = [];

		for (var i = 0; i < songs.length; i++) {
			data.push({
				"artist(s)": songs[i].artists.map(getArtist),
				"song name: ": songs[i].name,
				"preview song: ": songs[i].preview_url,
				"album: ": songs[i].album.name,
			});
		}
		console.log(data);
		writeToLog(data);
	});
};

// This is the Twitter function
var getTweets = function() {
	var client = new twitter(dataKeys.twitterKeys);

	var params = { screen_name: "", count: 10 };

	client.get("statuses/user_timeline", params, function(error, tweets, response) {

		if (!error) {
			var data = [];
			for (var i = 0; i < tweets.length; i++) {
				data.push({
					"created at: " : tweets[i].created_at,
					"Tweets: " : tweets[i].text,
				});
			}
			console.log(data);
			writeToLog(data);
		}
	});
}; 

// This is the IMDB function
var getMovie = function(movieName) {
	if (movieName === undefined) {
		movieName = "Mr Nobody";
	}

	var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=plot=full&tomatoes=true&r=json";

	request(urlHit, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var data = [];
			var jsonData = JSON.parse(body);

			data.push({
				"Title: " : jsonData.Title,
				"Year: " : jsonData.Year,
				"Rated: " : jsonData.Rated,
				"IMDB Rating: " : jsonData.imdbRating,
				"Country: " : jsonData.Country,
				"Language: " : jsonData.Language,
				"Plot: " : jsonData.Plot,
				"Actors: " : jsonData.Actors,
				"Rotten Tomatoes Rating: " : jsonData.tomatoeRating,
				"Rotten Tomatoes URL: " : jsonData.tomatoesURL,
			});
			console.log(data);	
			writeToLog(data);
		}
	});
};

// This is the function
var doWhatItSays = function() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		console.log(data);
		writeToLog(data);

		var dataArr = data.split(",");

		if (dataArr.length == 2) {
			pick(dataArr[0], dataArr[1]);
		} else if (dataArr.length == 1) {
			pick(dataArr[0]);
		}
	});
};

var pick = function(caseData, functionData) {
	switch (caseData) {
		case "my-tweets":
			getTweets();
			break;
		case "spotify-this-song":
			getSpotify(functionData);
			break;
		case "movie-this":
			getMovie(functionData);
			break;
		case "do-what-it-says":
			doWhatItSays();
			break;
		default:
			console.log("LIRI does not know that");				
	}
};

var runThis = function(argOne, argTwo) {
	pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);