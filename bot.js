var Twit = require('twit');
var T = new Twit(require('./config.js'));
var T = new Twit(require('./config.js'));
var Canvas = require('canvas');
var Image = Canvas.Image;

var canvas = Canvas.createCanvas(400, 400);
var context = canvas.getContext('2d');

var planetName; 
var planetLocation;
var planetDescription;
var spaceSearch; 


var url = 'http://www.scifiideas.com/planet-generator/';
const request = require('request');
const cheerio = require('cheerio');

function tweet(){
	var params;
	var mediaIdStr;
	spaceSearch = {q: "#nasa", count: 10, result_type: "recent"};

	request(url, (error, response, html) => {
		//getting the text
		if (!error && response.statusCode == 200){
		    const $ = cheerio.load(html);
	        const name = $('.single_page');
	        const output = (name.find('p')[2]);

	        planetName = output.children[1].data.toString();
	        planetName = planetName.substring(1, planetName.length - 1);
	        planetLocation = output.children[5].data.toString();
	        planetLocation = planetLocation.substring(1, planetLocation.length - 1);
	        planetDescription = output.children[9].data.toString();
	        planetDescription = planetDescription.substring(1, planetDescription.length - 1);

	        //this cuts the description to make it fit within 280 chars.
	       	if (planetDescription.length >= 280 - (planetLocation.length + planetName.length + 15)){
	       		planetDescription = planetDescription.substring(0, 280 - (planetLocation.length + planetName.length + 15));
	       		for (var i = planetDescription.length; i > 0; i--){
	       			if (planetDescription.charAt(i) == ('.')){
	       				planetDescription = planetDescription.substring(0, i + 1);
	       				break;
	       			}
	       		}
	       	}
	       	// //background
		context.fillStyle = "#282828";
		context.fillRect(0, 0, canvas.width, canvas.height);
		var r = Math.floor((Math.random() * 256));
		var g = Math.floor((Math.random() * 256)) + r;
		var b = Math.floor((Math.random() * 256));
		var color = "rgb("+r+","+g+","+b+")";

		if (planetDescription.includes('blue')){
			color = '#6C76CE';
			console.log("blue planet");
		}
		


		//making stars in backrground
		for(var i=0;i<500;i++){
			if (i&1){
  	 			context.fillStyle ="#FDF8F8";
  	 		} else {
  	 			context.fillStyle ="#BEC1AF";
  	 		}
   			context.beginPath();
  			context.arc(Math.floor(Math.random()*(400)+1) , Math.floor(Math.random()*(400)+1), Math.floor(Math.random()*(1)+1), 0 ,2*Math.PI);
   			context.fill();
		}


		//making planet

		var radius = Math.floor((Math.random() * (100 - 10) + 10));
		
		if (planetDescription.includes('large') | planetDescription.includes('giant')){
			radius = Math.floor((Math.random() * (100 - 20) + 20));
		}
		if (planetDescription.includes('small') | planetDescription.includes('tiny')){
			radius = Math.floor((Math.random() * (80 - 10) + 20));
		}

   		var x = 200,
		    y = 200,
		    // Radii of the white glow.
		   	innerRadius = radius/15,
		    outerRadius = radius;

		var gradient = context.createRadialGradient(x - (Math.random() * 60), y, innerRadius, x, y, outerRadius);
		gradient.addColorStop(0,"#E6E5E5");
		gradient.addColorStop(1, color);

		context.arc(x, y, radius, 0, 2 * Math.PI);

		context.fillStyle = gradient;
		context.fill();

		//making moons
		var numMoons = Math.random() * 4;
		for(var i=0;i<numMoons;i++){
			if (i&1){
  	 			context.fillStyle ="#" +  Math.floor(Math.random()*0xFFFFFF).toString(16);
  	 		} else {
  	 			context.fillStyle ="#" +  Math.floor(Math.random()*0xFFFFFF).toString(16);
  	 		}
  	
   			context.beginPath();
  			context.arc(Math.floor(Math.random()*(300 - 100) + 100) , Math.floor(Math.random()*(300 - 100) + 100), Math.floor(Math.random()*(radius/2)+1), 0 ,2*Math.PI);
   			context.fill();
		}


		//uploading & posting
		var fs = require('fs')
		    ,  out = fs.createWriteStream(__dirname + '/text.png')   
		    , stream = canvas.pngStream();

		var dataUrl = canvas.pngStream().pipe(out);
		T.post('media/upload', { media_data: canvas.toBuffer().toString('base64') }, function (err, data, response) {

		//reference the media and post a tweet (media will attach to the tweet)
		mediaIdStr = data.media_id_string;
		})

        params = { status: "Name: " + planetName + "\nLocation: " + planetLocation + "\n" + planetDescription, media_ids: [mediaIdStr] }
      
      T.get('search/tweets', spaceSearch, function (error, data) {
	  // log out any errors and responses
	  //console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
	}


	T.post('media/upload', { media_data: canvas.toBuffer().toString('base64') }, function (err, data, response) {
		console.log("media upload: success")
		//reference the media and post a tweet (media will attach to the tweet)
		mediaIdStr = data.media_id_string;
		params = { status: "Name: " + planetName + "\nLocation: " + planetLocation + "\n" + planetDescription, media_ids: [mediaIdStr] }
		T.post('statuses/update', params, function (err, tweet, response) {
			 console.log(tweet.text)
	    	 })
		})


    });
}
	tweet();
	setInterval(tweet, 1000*  60 * 60);

