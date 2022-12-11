const Chance = require('chance');
const chance = new Chance();

const express = require('express');
const app = express();
const port = 3000;

app.get('/api', (req, res) => {
  console.log(`Got a request`);
  res.send(getWeather());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


function getWeather(){
    var numberOfCities = chance.integer({
        min: 1,
        max: 20
    });
    var day = chance.weekday();

    var cities = [];
    for(var i = 0; i < numberOfCities; i++){
        cities.push({
            city: chance.city(),
            country: chance.country({full: true}),
            altitude: chance.altitude({fixed: 2, max: 3000}),
            weekday: day,
            degree: chance.floating({fixed: 2, min:-30, max:50})
        });
    };
    return cities;
}