//Previous searches button classes: btn waves-effect waves-light blue
//https://api.openweathermap.org/data/2.5/weather?q=Dallas&appid=011fc9a6ee8731e0d02abfa9e7a65489
/*
temp = data.main.temp;
            wind = data.wind.speed;
            humidity = data.main.humidity;
            var iconUrl = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";

            var humidity = "";
var temp = "";
var wind = "";
var unIndex = "";
var iconUrl = "";
var lon = "";
var lat = "";
var apiUrl = "";

iconUrl = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";
                    tempEl.val(data.current.temp);
                    console.log(data.current.temp);
                    windEl.val(data.current.wind_speed);
                    humidityEl.val(data.current.humidity);
                    uvindexEl.val(data.current.uvi);
*/
//data.main.temp

$(document).ready(function(){
    var apiKey = "&appid=011fc9a6ee8731e0d02abfa9e7a65489"; 
    var apiUrl = "";
    var inputEl = $('#city-input');
    var buttonEl = $('#search-button');  
    var modalMessage = $('#modal-message');
    var cityTitleEl = $('#city-title');
    var tempEl = $('#current-temp');
    var windEl = $('#current-wind');
    var humidityEl = $('#current-humidity');
    var uvindexEl = $('#current-uvindex');
    var iconEl = $('#city-title-icon');
    var iconUrl = "";
    var temp;
    var humidity;
    var wind;
    var uvi;
    var city;
    var date = new Date().toLocaleDateString('en-US');

    $('.modal').modal();
    
    function generateUrl(city) {
        apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&exclude=minutely,hourly,daily,alerts" + apiKey;
        let response = fetch(apiUrl).then(function(response){
            if(response.ok) {
                response.json().then(function(data) {
                    apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely,hourly,alerts&units=imperial" + apiKey;
                }).then(function() {
                    setValues(apiUrl);
                });
            } else {
                showModal("There was a problem with the request. Please try again. Error Code: " + response.status);
            }
        });
        inputEl.val("");
    }

    function setValues(apiUrl) {
        let response = fetch(apiUrl).then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    //Start populating data fields
                    temp = data.current.temp;
                    humidity = data.current.humidity;
                    wind = data.current.wind_speed;
                    uvi = data.current.uvi;
                    iconUrl = data.current.weather[0].icon;
                }).then(function() {
                    populateCurrentScreen();
                });
            } else {
                showModal("There was a problem with the request. Please try again. Error Code: " + response.status);
            }
        });
        inputEl.val("");
    }

    function populateCurrentScreen() {
        var img = $('<img>');
        img.attr('src', "http://openweathermap.org/img/wn/" + iconUrl + ".png");
        img.append(iconEl);
        cityTitleEl.text(city + " " + date);
        tempEl.text(temp + "\u00B0F");
        windEl.text(wind + " MPH");
        humidityEl.text(humidity + "%");
        uvindexEl.text(uvi);
    }
    
    function showModal(message) {
            var myModal = M.Modal.getInstance($('.modal'));
            inputEl.val("");
            modalMessage.text(message);
            myModal.open();
    }

    buttonEl.click(function() {
        city = inputEl.val().trim();
        if(city) {
            generateUrl(city);
        } else {
            showModal("Oh no! It looks like you forgot to enter a city. Please enter a city.");
        }
    });    
});

