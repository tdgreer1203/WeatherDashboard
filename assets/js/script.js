$(document).ready(function(){
    const apiKey = "&appid=011fc9a6ee8731e0d02abfa9e7a65489"; 

    var inputEl = $('#city-input');
    var buttonEl = $('#search-button');  
    var modalMessage = $('#modal-message');
    var cityTitleEl = $('#city-title');
    var tempEl = $('#current-temp');
    var windEl = $('#current-wind');
    var humidityEl = $('#current-humidity');
    var uvindexEl = $('#current-uvindex');
    var fiveDayForecastEl = $('#five-day-forecast');
    var previousSearchesEl = $('#previous-searches');

    var apiUrl = "";
    var iconUrl = "";
    var icon;
    var temp;
    var humidity;
    var wind;
    var uvi;
    var city;
    var date = new Date().toLocaleDateString('en-US');
    var fiveDayForecast = [];
    var searchHistory = [];

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
        cityTitleEl.text(city + "  (" + date + ")  ");
        cityTitleEl.append(img);
        tempEl.text(temp + "\u00B0F");
        windEl.text(wind + " MPH");
        humidityEl.text(humidity + "%");
        uvindexEl.text(uvi);

        addToHistory();
    }
    
    function populateFiveDayScreen() {
        date = new Date();
        for(var i = 0; i < fiveDayForecast.length; i++) {
            icon = fiveDayForecast[i].weather[0].icon;
            temp = fiveDayForecast[i].temp.day;
            wind = fiveDayForecast[i].wind_speed;
            humidity = fiveDayForecast[i].humidity
            iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png";
            date.setDate(date.getDate() + 1);

            var divColumn = $('<div>').addClass("col s6 m4 l2 single-day-forecast white black-text center forecast");
            var title = $('<h5>').addClass("flow-text").text(date.toLocaleDateString('en-US'));
            var image = $('<img>').attr('src', iconUrl);
            var pTemp = $('<p>').text("Temp: " + temp + "\u00B0F");
            var pWind = $('<p>').text("Wind: " + wind + " MPH");
            var pHumidity = $('<p>').text("Humidity: " + humidity + "%");

            divColumn.append(title);
            divColumn.append(image);
            divColumn.append(pTemp);
            divColumn.append(pWind);
            divColumn.append(pHumidity);

            fiveDayForecastEl.append(divColumn);
        }

        saveSearch();
    }

    function addToHistory() {
        var prevBtn = $('<a>').addClass("waves-effect waves-light btn white black-text hoverable").text(city);
        previousSearchesEl.append(prevBtn);
    }

    function saveSearch() {
        searchHistory.push(city);
        localStorage.setItem("searches", JSON.stringify(searchHistory));
    }

    function populateSearches() {
        for(var i = 0; i < searchHistory.length; i++) {
            var prevBtn = $('<a>').addClass("waves-effect waves-light btn white black-text hoverable").text(searchHistory[i]);
            previousSearchesEl.append(prevBtn);
        }
    }

    function loadSearches() {
        var savedSearches = localStorage.getItem("searches");
        if(!savedSearches) {
            searchHistory = [];
        } else {
            searchHistory = JSON.parse(savedSearches);
        }
        populateSearches();
    }

    function showModal(message) {
            var myModal = M.Modal.getInstance($('.modal'));
            inputEl.val("");
            modalMessage.text(message);
            myModal.open();
    }

    function clearForecast() {
        fiveDayForecastEl.empty();
    }

    buttonEl.click(function() {
        city = inputEl.val().trim();
        if(city) {
            clearForecast();
            generateUrl(city);
        } else {
            showModal("Oh no! It looks like you forgot to enter a city. Please enter a city.");
        }
    });   

    loadSearches();
});