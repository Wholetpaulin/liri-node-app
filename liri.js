var Twitter = require('twitter');
var keys = require("./keys.js");	//code for taking keys from keys.js
var Spotify = require('node-spotify-api');
var request = require("request");
// fs is a core Node package for reading and writing files
var fs = require("fs");

var input = "";


//TODO eventually change this to a for loopo to take multiple arguements
var argument = process.argv[2];
for(var i = 3; i < process.argv.length; i++){
    input = input + process.argv[i] + " ";
}
function pick(){
    switch(argument) {
        case "my-tweets":
        	twitterLog();
            break;

        case "spotify-this-song":
            spotifyLog(input);
            break;

        case "movie-this":
            ombdLog();
            break;  

        case "do-what-it-says":
            logWhatItSays();
            break;  

        default:
            console.log("Format to run commands is node liri.js command.");
    }
}   //end of switch

pick();

function twitterLog(){
    var client = new Twitter(keys.twitterKeys);
    //console.log(client);
    var params = {screen_name: "LiriRobot",
                  count: 20};               //Took out here'nodejs'
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
            for(var i = 0; i < tweets.length; i++){             //
                console.log("-------------TWEET #" + (tweets.length - i) + "--------------");   //built this way so liri will provide more tweets
                console.log("Timestamp: " + tweets[i].created_at);
                console.log("Message: " + tweets[i].text);
                console.log("----------------------------------");
            }//close of for loop

        }
    }); //end of client.get

}//end of twitterLog

//---------------------------------------------------------------

function spotifyLog(input){
 
var spotify = new Spotify(keys.spotifyKeys);
 
spotify.search({ type: 'track', query: input }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
    //console.log(JSON.stringify(data.tracks.items[0], null ,2));
    console.log("Song Name: " + JSON.stringify(data.tracks.items[0].name, null ,2));
    console.log("Artist Name: " + JSON.stringify(data.tracks.items[0].album.artists[0].name, null ,2));
    console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name, null ,2));
    console.log("Link to preview: " + JSON.stringify(data.tracks.items[0].external_urls.spotify, null ,2));

    });//end of spotifySearch
}//end of spotifyLog

//---------------------------------------------------------------


function ombdLog(){
var movieName = "";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 3; i < process.argv.length; i++) {

  if (i > 3 && i < process.argv.length) {

    movieName = movieName + "+" + process.argv[i];

  }

  else {

    movieName += process.argv[i];

  }
}

// Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

// This line is just to help us debug against the actual URL.
//console.log(queryUrl);

request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log("Movie Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    if(JSON.parse(body).Ratings[1]){
    console.log("Rotten Tomatoe Ranking " + JSON.parse(body).Ratings[1].Value);
    }
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
  }
});
}//end of ombdrLog

function logWhatItSays(){

    // This block of code will read from the "movies.txt" file.
    // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
    // The code will store the contents of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
        return console.log(error);
    }

    // We will then print the contents of data
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    console.log(dataArr);
    argument = dataArr[0];
    input = "";
    for(var i = 1; i < dataArr[1].length - 1; i++){ //This handles the pesky quotes around the second parameter
        input = input + dataArr[1][i];              //Not sure why this works...
    }
    //console.log(argument);
    //console.log(input);
    pick();


});

}//end of logWhatItSays