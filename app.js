const express = require('express');
const request = require('request');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const opencage = require('opencage-api-client');

fs = require('fs');

require('dotenv').config();



const port = process.env.PORT || 5000;
let apiKey = process.env.OPENWEATHER_API_KEY;


app.get('/', (req, res)=>{
	res.setHeader('Content-Type', 'text/html');
    res.status(200).sendFile(__dirname + "/" + "index.html");
});



app.post('/request', (req, res)=>{
	const city = req.body.location_name;
	const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

	console.log('sending request...');
	getLocationWeather(url);
	fetchGeocode(city);

	res.status(200).json('Request sent');

});





//fetch weather info from an external api
function getLocationWeather(url) {
	request(url, function (err, response, body) {
		  if(err){
		    console.log('error:', error);
		  } else {
			console.log('===============================================');
		    console.log('weather info:', body);
		  }
		});
}

//convert the location to a Geocode Latitude and longitude(latLong)
function fetchGeocode(locationName){
	opencage.geocode({q: locationName}).then(data => {
	  console.log(JSON.stringify(data));
	  if (data.status.code == 200) {
	    if (data.results.length > 0) {
	      const place = data.results[0];
	      console.log(place.formatted);
	      console.log('Location Name:', place.formatted);
	      console.log('lat-long:', place.geometry);
	      console.log('Location Timezone:', place.annotations.timezone.name);
	      console.log('fetching the current time of this location...');
	      const latLng = place.geometry['lat']+", " + place.geometry['lng'];

	      //request the location time with the informationobtained
	      getLocationTime(latLng);
	    }
	  } else if (data.status.code == 402) {
	    console.log('free-trial daily limit reached');
	  } else {
	    // other possible response codes:
	    console.log('error', data.status.message);
	  }
	}).catch(error => {
	  console.log('error', error.message);
	});
}


//get the current time of the location
function getLocationTime(latLng){

const loc = latLng;
const targetDate = new Date(); // Current date/time of user computer
const timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60; // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
const apikey = process.env.GOOGLE_TIMEZONE_API_KEY;
const apiUrl = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + timestamp + '&key=' + apikey;
const daysofweek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
 
 

 fetch(apiUrl).then((resp) => resp.json()) // Transform the data into json
  .then(function(data) {
    console.log(data);
      const offsets = data.dstOffset * 1000 + data.rawOffset * 1000; // get DST and time zone offsets in milliseconds
                let localdate = new Date(timestamp * 1000 + offsets); // Date object containing current time of target location
                let refreshDate = new Date(); // get current date again to calculate time elapsed between targetDate and now
                let millisecondselapsed = refreshDate - targetDate; // get amount of time elapsed between targetDate and now
                localdate.setMilliseconds(localdate.getMilliseconds()+ millisecondselapsed); // update localdate to account for any time elapsed
                setInterval(function(){
                    localdate.setSeconds(localdate.getSeconds()+1);
                    console.log('+++++++++++++++++++++++++++++++++++++');
                    console.log('Time info');
                    console.log('Local time', localdate.toLocaleTimeString() + ' (' + daysofweek[ localdate.getDay() ] + ')');
                }, 10000)
    });
}






//set up server at this port
app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    console.log('server started at port: ' + port);
});