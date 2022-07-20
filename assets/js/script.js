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
    var icon;
    var temp;
    var humidity;
    var wind;
    var uvi;
    var city;
    var date = new Date().toLocaleDateString('en-US');
    var fiveDayForecast = [];

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
                    icon = data.current.weather[0].icon;
                    for(var i = 0; i < 5; i++) {
                        fiveDayForecast.push(data.daily[i]);
                    }
                }).then(function() {
                    populateCurrentScreen();
                    populateFiveDayScreen();
                });
            } else {
                showModal("There was a problem with the request. Please try again. Error Code: " + response.status);
            }
        });
        inputEl.val("");
    }

    function populateCurrentScreen() {
        iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png";
        var img = $('<img>');
        img.attr('src', iconUrl);
        cityTitleEl.text(city + " " + date);
        cityTitleEl.append(img);
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

