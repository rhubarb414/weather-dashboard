var APIKey = "a9c922718c1bf79be61715d73fa7a803";
var lat;
var long;
var queryURL;
var city;
var stateFull;

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
    `https://api.openweathermap.org/geo/1.0/direct?q=${city},${stateAbbr},US&limit=1&appid=${APIKey}`
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
      queryURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=imperial&exclude=minutely,hourly,alerts&appid=${APIKey}`;

      //make api call to get forecast
      getForecast();
    });
}
// api call for weather forecast
function getForecast() {
  let currentDate = "";

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data); // delete
      //multiply current dt by 1000 as dayjs uses unix timestamp in milliseconds as standard
      currentDate = dayjs(data.current.dt * 1000).format("dddd MMM DD");
      console.log("currentDate is " + currentDate); //delete
    });
}
