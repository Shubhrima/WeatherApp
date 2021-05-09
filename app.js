const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const ejs = require('ejs');
const {getSunrise, getSunset} = require('sunrise-sunset-js');
const dotenv = require("dotenv")

dotenv.config();

const port = 3000

app.use( bodyParser.json());
app.use( bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + "/" + "style.css");
});
app.get('/app.js', function(req, res) {
  res.sendFile(__dirname + "/" + "app.js");
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/' + 'index.html');
});

app.post('/', function (req, res) {
	var city = req.body.city_name;

	const url ='https://api.openweathermap.org/data/2.5/weather?q='+ city +'&units=metric&appid='+process.env.APPID;


	https.get(url,(response) => 
	{ 	
		console.log(response.statusCode)
		response.on("data", function(data){
			const weatherData = JSON.parse(data);
			const temp = weatherData.main.temp;
			const min = weatherData.main.temp_min;
			const max = weatherData.main.temp_max;
			const name = weatherData.name;
			const humidity = weatherData.main.humidity;
			const today = new Date();
			const weatherDescription = weatherData.weather[0].description;
			const icon = weatherData.weather[0].icon;
			const latitude = weatherData.coord.lat;
			const longitude = weatherData.coord.lon;
			const sunset = getSunset(latitude, longitude);
			const sunrise = getSunrise(latitude, longitude);


			//res.write("<h1>The temperature is " + temp +"</h1>");
			//res.write("<p>Min Temperature: "+ min+"</p>");
			//res.write("<p>Max Temperature: "+ max+"</p>");
			const imgurl = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
			//res.write("<img src=" +imgurl+ ">");
			//res.write(weatherDescription);
			//res.send()
			res.render('weather', {temperature: temp, icon: imgurl, weatherDescription: weatherDescription, 
									name: name, humidity:humidity, min:min, max:max, 
									sunrise:sunrise, sunset:sunset
								});
			})
		
	})


}) // POST /login gets urlencoded bodies


app.listen(port, () => {
  console.log('Server running at http://localhost:3000')
})