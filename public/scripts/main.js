// declare variables
const API_KEY = '268961715dd7614d39614d0b6c5ac5c6';     // the key to the weather API
const MAPBOX_KEY = 'pk.eyJ1IjoiZGFmbmF3ZWlzcyIsImEiOiJjamZ0b3hoZDIzZDNvMzNtc2gxdHJkcGM1In0.rG6B50pXcFYRNi6B9G-OKQ';

const tempUnits = 'metric';
const selectedElement = document.getElementById('cities');
let selectedCity;
let cityName;
let cityCoords = [40.7127753, -74.0059728]; // New York is the default city

// define the weather object
let weather = {
    temperature: 0,
    humidity: 0,
    cloudness: '',
    rain: '',
    description: '',
    icon: ''
};

// creating the map (with the coords of New York as a default)
let mymap = L.map('mapid').setView(cityCoords, 13);

// declare the circle Marker Object
let cityCircleMarker = {
    color: 'red',
    fillcolor: '#fo3',
    fillOpacity: 0.5,
    radius: 20
};

selectedElement.addEventListener('change',()=> {
    selectedCity = selectedElement.value;
    let citySplit = selectedCity.split(',');
    cityName = citySplit[0];
    getWeatherAPI();
    setMap();
});

// get the Weather API
function getWeatherAPI() {
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${tempUnits}&appid=${API_KEY}`,
        type: 'GET',
        dateType: 'json',

        success(response){
            console.log(response);
            setWeather(response, cityName);             // setting the weather object
            displayWeather(weather);                    // display the city weather data on the web page
        },
        error(jqXHR, status,errorThrown){
            console.log(jqXHR);
        }
    });
}

// set the weather object according to the API Weather response
function setWeather(response){
    weather.temperature = response.main.temp;
    weather.humidity = response.main.humidity;
    weather.cloudness = response.clouds.all;
    weather.rain = (response.weather && response.weather.length > 0) ? response.weather[0].main: '';
    weather.description = (response.weather && response.weather.length > 0) ? response.weather[0].description: '';
    weather.icon = (response.weather && response.weather.length > 0) ? response.weather[0].icon: '';
}

// display the Weather Data on the Web page
function displayWeather(weather){
    document.getElementById('cityName').innerHTML = cityName;
    document.getElementById('weatherIcon').innerHTML = `<img src="http://openweathermap.org/img/w/${weather.icon}.png"/>`;
    document.getElementById('temp').innerHTML = `${weather.temperature}&#xb0 C`;
    document.getElementById('rain').innerHTML = weather.rain;
    document.getElementById('humidity').innerHTML = `${weather.humidity}%`;
    document.getElementById('cloudness').innerHTML = `${weather.cloudness}%`;
    document.getElementById('description').innerHTML = weather.description;
}

// setting the map to the selected city coords
function setMap() {

    // get the selected city coords
    console.log("cityName = " + cityName);
    switch(cityName) {
        case 'prague':
            cityCoords = [50.0750689, 14.4350772];
            cityCircleMarker.color = 'blue';
            break;
        case 'paris':
            cityCoords = [48.856614, 2.3522219];
            cityCircleMarker.color = 'yellow';
            break;
        case 'london':
            cityCoords = [51.5073509, -0.1277583];
            cityCircleMarker.color = 'green';
            break;
        case 'rome':
            cityCoords = [41.9027835, 12.4963655];
            cityCircleMarker.color = 'magenta';
            break;
        case 'berlin':
            cityCoords = [52.5200066, 13.404954];
            cityCircleMarker.color = 'orange';
            break;
        case 'amsterdam':
            cityCoords = [52.3702157, 4.8951679];
            cityCircleMarker.color = 'cyan';
            break;
        case 'beijing':
            cityCoords = [39.9041999, 116.4073963];
            cityCircleMarker.color = 'brown';
            break;
        case 'tokyo':
            cityCoords = [35.7090259, 139.7319925];
            cityCircleMarker.color = 'lime';
            break;
        case 'cairo':
            cityCoords = [30.0138323, 31.209572];
            cityCircleMarker.color = 'crimson';
            break;
        default:
            cityCoords = [40.7127753, -74.0059728];         // New York is the default
            cityCircleMarker.color = 'red';
            break;
    };

    // updating the map View
    mymap.setView(cityCoords, 13);

    // getting the Mapbox Street tile layer
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: MAPBOX_KEY
    }).addTo(mymap);

    // adding a circleMarker element with different color to each city
    const circleMarker = L.circleMarker(cityCoords, cityCircleMarker).addTo(mymap);
}