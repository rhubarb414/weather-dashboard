var apiKey = "a9c922718c1bf79be61715d73fa7a803";
var lat;
var long;
var queryURL;
var city;
var stateFull;
// var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`; //forecast?

var searchInputVal = document.querySelector(".search-input").value;
var searchBtn = document.querySelector(".search-button");

searchBtn.addEventListener("click", function (event) {
  //city and state to be define by user input
  var cityStateArr = [];

  searchInputVal = document.querySelector(".search-input").value;
  cityStateArr = searchInputVal.split(",");
  city = cityStateArr[0];
  stateAbbr = cityStateArr[1].trim();

  convertToCoords(city, stateAbbr);
  //   getForecast();
});

// takes city, state input from user and converts to coordinates
function convertToCoords(city, stateAbbr) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city},${stateAbbr},US&limit=1&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lat = data[0]["lat"];
      long = data[0]["lon"];
      city = data[0]["name"]; //use API city name to account for user-input capitalization variance
      stateFull = data[0]["state"]; //store full state name to display on DOM, in case user confuses abbreviation
      //update queryURL
      queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`;

      //make api call to get forecast
      getForecast();
    });
}
// api call for weather forecast
function getForecast() {
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
