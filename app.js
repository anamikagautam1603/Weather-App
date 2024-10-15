const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    console.log("The request is received");

    // Get the city name from the request body
    const query = req.body.cityName;
    const apiKey = '848c4561e37f983f4b93ffb44d37787a';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

    https.get(url, (response) => {
        if (response.statusCode === 200) {
            response.on('data', (data) => {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;

                // Send a formatted response
                res.write(`The temperature in ${query} is ${temp} degrees Celsius and the weather description is ${weatherDescription}.`);
                res.send(); // Send the response after writing
            });
        } else {
            // Handle errors from the API
            res.status(response.statusCode).send('City not found or other error occurred.');
        }
    }).on('error', (err) => {
        console.error(err);
        res.status(500).send('An error occurred while fetching weather data.');
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});