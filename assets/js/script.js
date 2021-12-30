var searchEl = document.getElementById("search-form");
var citieslist = document.getElementById("cities");
var fiveDayForecastContainer = document.querySelector(".bottom-part");
var appId = "cfe843ae5ce6237b488a2af5487d8106";
var searchResults = [];
var previousResult = [];

var getUvIndex = function (lat , lon, city){

    var uvapiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=" + appId;
    fetch(uvapiUrl)
        .then(function(response){
            if(response.ok){
                response.json()
                .then(function(data) {
                    //UV Index
                    $(".uvindex").text("UV Index: " + data.current.uvi);
                    getFiveDayForecast(data);
                });
                console.log("Connection successful!");
            }
            else{
                console.log("conneciton unsuccessful");
            }
        })
        .catch(function(error){
            console.log("could not connect");
        })
};

var getFiveDayForecast = function(data){

    var fiveDayForecastEl = document.createElement("div");
    $(fiveDayForecastEl).addClass("row fivedayforecast");


    for (var i = 0; i < 5; i++) {

        var fiveDayForecastInnerEl = document.createElement("div");
        $(fiveDayForecastInnerEl).addClass("col-2 text-white eachDay");
        //console.log(fiveDayForecastEl);
        fiveDayForecastEl.append(fiveDayForecastInnerEl);

        //adding date 
        var dateEl = document.createElement("h4");
        dateEl.textContent = moment().add(i + 1, 'days').format("MM/DD/YYYY");
        fiveDayForecastInnerEl.appendChild(dateEl);

        //adding weather icon
        var iconEl = document.createElement("img");
        var iconURL = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png";
        iconEl.src = iconURL;
        fiveDayForecastInnerEl.appendChild(iconEl);

        //adding temp
        var daysTemp = document.createElement("p");
        daysTemp.textContent = "Temp: " + data.daily[i].temp.max + "°F";
        fiveDayForecastInnerEl.appendChild(daysTemp);

        //adding wind
        var daysWind = document.createElement("p");
        daysWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        fiveDayForecastInnerEl.appendChild(daysWind);

        //adding humidity
        var daysHumidity = document.createElement("p");
        daysHumidity.textContent = "Humidity: " + data.daily[i].humidity + " %";
        fiveDayForecastInnerEl.appendChild(daysHumidity);

        fiveDayForecastContainer.appendChild(fiveDayForecastEl);
    }

};


var getCityLocation = function (city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city +  "&appid=" + appId;
    //console.log(apiUrl);
    fetch(apiUrl)
        .then(function(response){
            if(response.ok){
                response.json()
                .then(function(data) {
                    if (city !== ""){
                        //console.log(data);
                        //city and date
                        var todaysDate = moment().format("MM/DD/YYYY");
                        $(".cityTitle").text(city + "(" + todaysDate + ")");
                        var weatherImgEl = $(".weather-img");
                        weatherImgEl.attr("src","https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png");
                        weatherImgEl.attr("alt", data.weather[0].description);
                        //Temparature
                        var valNum = parseFloat(data.main.temp);
                        $(".temparature").text("Temp: " + (((valNum-273.15)*1.8)+32) + " F");
                        //Wind
                        $(".wind").text("Wind: " + data.wind.speed + " MPH");
                        //Humidity
                        $(".humidity").text("Humidity: " + data.main.humidity + " %");
                        let lat = data.coord.lat;
                        let lon = data.coord.lon;
                        getUvIndex (lat, lon, city);
                        
                    }
                });
                console.log("Connection successful!");
            }
            else{
                console.log("conneciton unsuccessful");
            }
        })
        .catch(function(error){
            console.log("could not connect");
        })
};

var addCityToStorage = function (searchInputValue){
    document.querySelector("input[name='cityname']").value= "";
    $(".fivedayforecast").remove();
    $(".citylist").remove();

    if (localStorage.getItem('previousResults') == null) {
        localStorage.setItem('previousResults', '[]');
    }
    searchResults = JSON.parse(localStorage.getItem('previousResults'));
    searchResults.push(searchInputValue);
    console.log(searchResults);
    localStorage.setItem('previousResults', JSON.stringify(searchResults));
    
    for ( i = 0 ; i < searchResults.length ; i++){

        var cityBtn = document.createElement("button");
        cityBtn.textContent = searchResults[i];
        $(cityBtn).addClass("btn citylist ");
        citieslist.appendChild(cityBtn);
    };

};

var searchSubmitHandler = function(event){
    event.preventDefault();

    var searchInputValue = document.querySelector("input[name='cityname']").value.trim();
    //console.log(searchInputValue);
    getCityLocation(searchInputValue);
    
    addCityToStorage(searchInputValue);
    
    
};
var previousSearchedCities = function (event){
    event.preventDefault();
    var cityVal = event.target.innerText;
    console.log(cityVal);
    getCityLocation(cityVal);
    addCityToStorage(cityVal);
    
};

//Events
searchEl.addEventListener("submit", searchSubmitHandler);
citieslist.addEventListener("click", previousSearchedCities);