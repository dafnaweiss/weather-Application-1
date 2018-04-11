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
    getWeatherAPI(city);
    setMap(city);
});

// get the Weather API
function getWeatherAPI(city) {
    // sending a request to the open weather map site to get the weather data
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${city.cityName}&units=${tempUnits}&appid=${API_KEY}`,
        type: 'GET',
        dateType: 'json',

        success(response){
            console.log(response)
            displayWeather(setWeather(response), city);       // set and display the city weather data on the web page
        },
        error(jqXHR, status,errorThrown){
            console.log(jqXHR);
        }
    });
}

// set the weather object according to the API Weather response
function setWeather(response){
    // set its fields
    let temperature = response.main.temp;
    let humidity = response.main.humidity;
    let cloudness = response.clouds.all;
    let rain = (response.weather && response.weather.length > 0) ? response.weather[0].main: '';
    let description = (response.weather && response.weather.length > 0) ? response.weather[0].description: '';
    let icon = (response.weather && response.weather.length > 0) ? response.weather[0].icon: '';

    // create a new weather instance
    return new Weather(temperature, humidity, cloudness, rain,description, icon);
}

// display the Weather Data on the Web page
function displayWeather(weather, city){
    document.getElementById('cityName').innerHTML = city.cityName;
    document.getElementById('weatherIcon').innerHTML = `<img src="http://openweathermap.org/img/w/${weather.icon}.png"/>`;
    document.getElementById('temp').innerHTML = `${weather.temperature}&#xb0 C`;
    document.getElementById('rain').innerHTML = weather.rain;
    document.getElementById('humidity').innerHTML = `${weather.humidity}%`;
    document.getElementById('cloudness').innerHTML = `${weather.cloudness}%`;
    document.getElementById('description').innerHTML = weather.description;
}

function setMap(city) {
    // updating the map View
    mymap.setView(city.mapData.coords, 13);

    // getting the Mapbox Street tile layer
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: MAPBOX_KEY
    }).addTo(mymap);

    // declare the circle Marker Object
    let cityCircleMarker = {
        color: city.mapData.circleMarkerColor,
        fillcolor: '#fo3',
        fillOpacity: 0.5,
        radius: 20
    };

    // adding a circleMarker element with different color according to the selected city
    const circleMarker = L.circleMarker(city.mapData.coords, cityCircleMarker).addTo(mymap);
}