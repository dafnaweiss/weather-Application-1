// declare variables
const API_KEY = '268961715dd7614d39614d0b6c5ac5c6';     // the key to the weather API
const MAPBOX_KEY = 'pk.eyJ1IjoiZGFmbmF3ZWlzcyIsImEiOiJjamZ0b3hoZDIzZDNvMzNtc2gxdHJkcGM1In0.rG6B50pXcFYRNi6B9G-OKQ';

const tempUnits = 'metric';
const selectedElement = document.getElementById('cities');

// creating the map
let mymap = L.map('mapid');

// creating a listener for the changes in the drop-down list
selectedElement.addEventListener('change',()=> {
    const city = new City(selectedElement.value);             // create a new City instance
    console.log(`cityName: ${city.cityName} mapDate: ${city.mapData.coords[0]}, ${city.mapData.coords[1]}, ${city.mapData.circleMarkerColor}`);
    getWeatherAPI(city);
    setMap(city);
});

// get the Weather API
function getWeatherAPI(city) {
    console.log(`Weather API: cityName: ${city.cityName} mapDate: ${city.mapData.coords[0]}, ${city.mapData.coords[1]}, ${city.mapData.circleMarkerColor}`);
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${city.cityName}&units=${tempUnits}&appid=${API_KEY}`,
        type: 'GET',
        dateType: 'json',

        success(response){
            console.log(response);

            let weather = response => {
                temperature = response.main.temp;
                humidity = response.main.humidity;
                cloudness = response.clouds.all;
                rain = (response.weather && response.weather.length > 0) ? response.weather[0].main: '';
                description = (response.weather && response.weather.length > 0) ? response.weather[0].description: '';
                icon = (response.weather && response.weather.length > 0) ? response.weather[0].icon: '';
                // craete a new Weather instance
                const weather = new Weather(temperature, humidity, cloudness, rain, description, icon);
                return weather;
            };

            console.log(`Weather API: ${weather.temperature}, ${weather.humidity}, ${weather.cloudness}, ${weather.rain}, ${weather.description}, ${weather.icon}`);
            displayWeather(weather, city);       // set and display the city weather data on the web page
        },
        error(jqXHR, status,errorThrown){
            console.log(jqXHR);
        }
    });
}

/*
// set the weather object according to the API Weather response
function setWeather(response){
    temperature = response.main.temp;
    humidity = response.main.humidity;
    cloudness = response.clouds.all;
    rain = (response.weather && response.weather.length > 0) ? response.weather[0].main: '';
    description = (response.weather && response.weather.length > 0) ? response.weather[0].description: '';
    icon = (response.weather && response.weather.length > 0) ? response.weather[0].icon: '';
    // craete a new Weather instance
    const weather = new Weather(temperature, humidity, cloudness, rain, description, icon);
    console.log(`set Weather: ${weather.temperature}, ${weather.humidity}, ${weather.cloudness}, ${weather.rain}, ${weather.description}, ${weather.icon}`);
    return weather;
}*/

// display the Weather Data on the Web page
function displayWeather(weather, city){
    console.log(`display Weather: cityName: ${city.cityName} mapDate: ${city.mapData.coords[0]}, ${city.mapData.coords[1]}, ${city.mapData.circleMarkerColor}`);
    document.getElementById('cityName').innerHTML = city.cityName;
    document.getElementById('weatherIcon').innerHTML = `<img src="http://openweathermap.org/img/w/${weather.icon}.png"/>`;
    document.getElementById('temp').innerHTML = `${weather.temperature}&#xb0 C`;
    document.getElementById('rain').innerHTML = weather.rain;
    document.getElementById('humidity').innerHTML = `${weather.humidity}%`;
    document.getElementById('cloudness').innerHTML = `${weather.cloudness}%`;
    document.getElementById('description').innerHTML = weather.description;
}

function setMap(city) {
    console.log(`set Map: cityName: ${city.cityName} mapDate: ${city.mapData.coords[0]}, ${city.mapData.coords[1]}, ${city.mapData.circleMarkerColor}`);
    // updating the map View
    let cityCoords = [city.mapData.coords[0],city.mapData.coords[1]];
    //mymap.setView(cityCoords, 13);
    mymap.setView(city.mapData.coords, 13);

    // getting the Mapbox Street tile layer
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: MAPBOX_KEY
    }).addTo(mymap);

    // adding a circleMarker element with different color according to the selected city
    const cityCircleMarker = new MapCircleMarker(city.mapData.circleMarkerColor);
    console.log(`set Map: cityCircleMarker: ${cityCircleMarker.color}, ${cityCircleMarker.radius}`);
    console.log(`coords: ${cityCoords}, color: ${city.mapData.circleMarkerColor}`);
    console.log(`set Map: cityName: ${city.cityName} mapDate: ${city.mapData.coords[0]}, ${city.mapData.coords[1]}, ${city.mapData.circleMarkerColor}`);
    //const circleMarker = L.circleMarker(cityCoords, cityCircleMarker).addTo(mymap);
    const circleMarker = L.circleMarker(city.mapData.coords, new MapCircleMarker(city.mapData.circleMarkerColor)).addTo(mymap);
}