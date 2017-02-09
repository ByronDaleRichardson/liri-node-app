var dataKeys = require("keys.js"); //twitter keys from file
var fs = require("fs"); //file system use
var twitter = require("twitter"); //twitter use
var spotify = require("spotify"); //spotify use
var request = require("request"); //request use

// This is the function for finding artist from spotify
var getArtist = function(artist) {
	return artist.name;
};

var getSpotify = function(songName) {
	if (songname == undefined) {
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
	});
};

// This is the IMDB fucntion
