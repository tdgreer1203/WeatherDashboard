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
*/
//data.main.temp

$(document).ready(function(){
    var apiKey = "&appid=011fc9a6ee8731e0d02abfa9e7a65489"; 
    var inputEl = $('#city-input');
    var buttonEl = $('#search-button');  
    var modalMessage = $('#modal-message');
    
    $('.modal').modal();
    
    var generateUrl = function(city) {
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&exclude=minutely,hourly,daily,alerts" + apiKey;
        var response = fetch(apiUrl).then(function(response){
            response.json().then(function(data) {
                apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely,hourly,alerts&units=imperial" + apiKey;
            });
        });
        return apiUrl;
    }
    
    var showModal = function(message) {
            var myModal = M.Modal.getInstance($('.modal'));
            modalMessage.text(message);
            myModal.open();
    }

    buttonEl.click(function() {
        var city = inputEl.val();
        if(city) {
            generateUrl(city);
        } else {
            showModal("Oh no! It looks like you forgot to enter a city. Please enter a city.");
        }
    });


    console.log(generateUrl("Dallas"));
});

