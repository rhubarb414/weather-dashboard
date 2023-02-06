const APIKey = "a9c922718c1bf79be61715d73fa7a803";
let lat;
let long;
let queryURL;
let city;
let stateFull;
const currentHeaderEl = document.querySelector(".current-header");
const currentIconEl = document.querySelector(".current-icon"); //rename if using for all current conditions data
const searchBtn = document.querySelector(".search-button");

searchBtn.addEventListener("click", function (event) {
  //city and state to be define by user input
  let cityStateArr = [];

  const searchInputVal = document.querySelector(".search-input").value;
  cityStateArr = searchInputVal.split(",");
  city = cityStateArr[0];
  stateAbbr = cityStateArr[1].trim();

  convertToCoords(city, stateAbbr);
});

// takes city, state input from user and converts to coordinates
const convertToCoords = (city, stateAbbr) => {
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
      callAPI();
    });
};
// api call for weather forecast
const callAPI = () => {
  let currentDate = "";
  let currentTime = "";
  let localTimezone = "";

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data); // delete
      currentConditions(data);
      getForecast(data);
    });
};

const currentConditions = (data) => {
  //multiply current dt by 1000 as dayjs uses unix timestamp in milliseconds as standard
  localTimezone = data.timezone_offset;

  currentDate = dayjs
    .utc((data.current.dt + localTimezone) * 1000) //use utc plugin so dayjs doesn't display local machine time
    .format("dddd MMM DD");
  currentTime = dayjs
    .utc((data.current.dt + localTimezone) * 1000)
    .format("h:mm A");

  currentHeaderEl.textContent = `Conditions in ${city}, ${stateFull} at ${currentTime}, ${currentDate}.`;
  //rename iconURL since it's housing all the current conditions data
  const iconURL = `<img src=http://openweathermap.org/img/wn/${
    data.current.weather[0].icon
  }@2x.png></img>
   <p>${data.current.weather[0].description}</p> 
  <p>${Math.floor(data.current.temp)}\u{00B0}F</p>
  <p>${data.current.humidity}% humidity</p>
  <p>${Math.floor(data.current.wind_speed)} mph wind`;
  currentIconEl.innerHTML = iconURL;
};

const getForecast = (data) => {
  const dayOneEl = document.querySelector(".day-1");
  const dayTwoEl = document.querySelector(".day-2");
  const dayThreeEl = document.querySelector(".day-3");
  const dayFourEl = document.querySelector(".day-4");
  const dayFiveEl = document.querySelector(".day-5");

  const daysElArray = [dayOneEl, dayTwoEl, dayThreeEl, dayFourEl, dayFiveEl];

  for (let index = 1; index < 6; index++) {
    daysElArray[index - 1].innerHTML = `<p>${dayjs
      .utc((data.daily[index].dt + data.timezone_offset) * 1000)
      .format("dddd MMM DD")}</p>
    <img src=http://openweathermap.org/img/wn/${
      data.daily[index].weather[0].icon
    }@2x.png></img>
     <p>${data.daily[index].weather[0].description}</p>
    <p>${Math.floor(data.daily[index].temp.day)}\u{00B0}F</p>
    <p>${data.daily[index].humidity}% humidity</p>
    <p>${Math.floor(data.daily[index].wind_speed)} mph wind`;
  }
};
