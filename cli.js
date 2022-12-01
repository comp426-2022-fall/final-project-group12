#!/usr/bin/env node

import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2))
let timezone = moment.tz.guess()

if (args.h) {
    console.log("Usage: whatToWear.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE")
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
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&timezone=' + timezone);
const data = await response.json()
const day = 0

console.log("For today's weather conditions you will need:")
if (data.daily.precipitation_hours[day] > 0) {
    console.log("Today will be raining, so a rain jacket or umbrella would be great!")
}
if(data.daily.apparent_temperature_min<8){
    console.log("Brrr, it is cold out, the lows are below 45 degrees Farenheit, so you should pack a jacket")
}

else if(data.daily.apparent_temperature_min<16){
    console.log("Today will be slightly chilly, the lows are around 60 degrees Farenheit, so you should pack a sweatshirt")
}

else if(data.daily.apparent_temperature_min<23){
    console.log("The weather looks nice today, you could wear a shirt and pants")
}

else if(data.daily.apparent_temperature_min>=23){
    console.log("WOW, it's so hot out today! A tank top and shorts may be ideal for this weather")
}
if(data.daily.windspeed_10m_max>10){
    console.log("Today is going to be windy, make sure to pack a windbreaker")
}

if(data.daily.shortwave_radiation_sum>4000000){
    console.log("The UV index is quite high today (>4) make sure to pack a hat, sunscreen, and sunfglasses!")
}

else if(data.daily.shortwave_radiation_sum>4000000){
    console.log("It's not too sunny today, but everyday is a great day to wear sunscreen--  better than sorry!")
}
