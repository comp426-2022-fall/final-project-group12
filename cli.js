#!/usr/bin/env node

import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";
import express from "express"
import Database from 'better-sqlite3';


const args = minimist(process.argv.slice(2))
let timezone = moment.tz.guess()
const app = express();
const db = new Database('logData.db');

// help description
const port= args.port||5000;
app.use(express.urlencoded({extended: true}));


if (args.h) {
    console.log("How does this work? Call node whatToWear.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE")
    console.log("    -h            Show this help message and exit.")
    console.log("    -n, -s        Latitude: N positive; S negative.")
    console.log("    -e, -w        Longitude: E positive; W negative.")
    console.log("    -z            Time zone: uses tz.guess() from moment-timezone by default.")
    process.exit(0);
}


// Determine timezone
if (args.z) {
    timezone = args.z
}

// Determine latitude and longitude postions
let latitude = 1
let longitude = 1

if (args.n) {
    latitude = args.n
} else if (args.s) {
    latitude = -args.s
} else {
    console.log("Latitude is out of range")
}

if (args.e) {
    longitude = args.e
} else if (args.w) {
    longitude = -args.w
} else {
    console.log("Longitude is out of range")
}
// Connect to Weather API
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m&daily=apparent_temperature_min&daily=apparent_temperature_max&daily=precipitation_hours&daily=windspeed_10m_max&daily=shortwave_radiation_sum&current_weather=true&timezone=' + timezone);
const data = await response.json()
const day = 1

// Print today's weather
function produceOutput() {
    console.log("\nThe weather today is...")
    var farHigh = data.daily.apparent_temperature_max[day] * (9 / 5) + 32;
    var farLow = data.daily.apparent_temperature_min[day] * (9 / 5) + 32;
    console.log("A high of " + farHigh + "°F and A low of " + farLow + "°F");
    console.log("It will rain for " + data.daily.precipitation_hours[day] + " hours today.");
    var windSpdmph = Math.round(data.daily.windspeed_10m_max[day] / 1.609);
    console.log("The windspeed will be aboout " + windSpdmph + " mph");
    var uvradiation = Math.round(data.daily.shortwave_radiation_sum[day] / 10);
    console.log("The UV index is " + uvradiation);

//What to wear suggestions

//rain conditions
    console.log("\nFor today's weather conditions you will need...")
    if (data.daily.precipitation_hours[day] > 0) {
        console.log("Today will be raining, so a rain jacket or umbrella would be great!")
    }
//temperature conditions
    if (farLow < 45) {
        console.log("Brrr, it is cold out, the lows are below 45 degrees Farenheit, so you should pack a jacket")
    } else if (farLow < 60) {
        console.log("Today will be slightly chilly, the lows are around 60 degrees Farenheit, so you should pack a sweatshirt")
    } else if (farLow < 73) {
        console.log("The weather looks nice today, you could wear a shirt and pants")
    } else if (farLow >= 73) {
        console.log("WOW, it's so hot out today! A tank top and shorts may be ideal for this weather")
    }

//windspeed conditions
    if (data.daily.windspeed_10m_max[day] > 10) {
        console.log("Today is going to be windy, make sure to pack a windbreaker")
    } else if (data.daily.windspeed_10m_max[day] <= 10) {
        console.log("At least the wind doesn't look too bad today")
    }

//radiation conditions
    if (uvradiation > 4) {
        console.log("The UV index is quite high today!! make sure to pack a hat, sunscreen, and sunglasses!")
    } else if (uvradiation < 4) {
        console.log("It's not too sunny today, but everyday is a great day to wear sunscreen- better safe than sorry!")
    }
}

app.get("/app", (req, res) => {
    res.status(200).send("Endpoint Reached");
})

app.get("*", (req, res) => {
    res.status(404).send("404 NOT FOUND");
    res.end();
})

app.listen(port);