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

	console.log('sending request');


	getWeather(url);
	res.status(200).json('sent');

});






function getWeather(url) {
	request(url, function (err, response, body) {
		  if(err){
		    console.log('error:', error);
		  } else {
			console.log('===============================================');
		    console.log('weather info:', body);
		  }
		});
}





//set up server at this port
app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    console.log('server started at port: ' + port);
});