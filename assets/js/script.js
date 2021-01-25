// Global variables
let apiKey = "bfa05a6206f62e06173b627eb3956550"
// dom references
let searchHistoryListEl = document.querySelector("#search-history");
let searchFormEl = document.querySelector("#search-form");
let todayContainerEl = document.querySelector("#today-container");
let searchArr = []

// get user searchTerm
var getSearchTerm = function(event) {
  event.preventDefault();
  var input = document.querySelector("#search-input")
  var searchTerm = input.value.toLowerCase().trim();
  fetchCurrentWeather(searchTerm);
  input.value = "";
}

// click li in search history to fetch weather
var searchHistoryHandler = function(event) {
  recentCity = event.target.textContent
  fetchCurrentWeather(recentCity);
}

// get city weather
let fetchCurrentWeather = function(city) {
  let apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  fetch(apiUrl).then(function(res) {
    res.json().then(function(currentWeather) {
      let cityName = currentWeather.name;
      // create java script date time object from weather api dt (10 dig num)
      var dateTime = moment.utc(currentWeather.dt*1000 + currentWeather.timezone*1000);
      // get temperature kelvin => Fahrenheit
      let tempF = Math.round((currentWeather.main.temp - 273.15)* 9/5 + 32);
      let humidity = currentWeather.main.humidity;
      // get wind speed => MPH
      let windSpeedMph = Math.round(currentWeather.wind.speed * 2.237);
      // get lon and lat
      let lon = currentWeather.coord.lon;
      let lat = currentWeather.coord.lat;
      var iconCode = currentWeather.weather[0].icon;
      var description = currentWeather.weather[0].description;
      fetch(`http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`).then(function(res) {
        res.json().then(function(uvData) {
          let uvIndex = uvData.value;
          displayCurrentWeather(cityName, iconCode, description, dateTime, tempF, humidity, windSpeedMph, uvIndex)
          displaySearchHistory(cityName);
        })
      })
    })
  })
};

var displaySearchHistory = function(cityName) {
    // add city to search history
    searchArr.push(cityName);
    let uniqueArr = []
    // solve unique search history
    for (let i = 0; i < searchArr.length; i++) {
      if(!uniqueArr.includes(searchArr[i])) {
        uniqueArr.unshift(searchArr[i]);
      }
    }
  
    // clear search history list
    searchHistoryListEl.textContent= ""
    // append each unique search history li
    for (let i = 0; i < uniqueArr.length; i++) {
      let searchHistoryItemEl = document.createElement("li");
      searchHistoryItemEl.classList = "list-group-item";
      searchHistoryItemEl.textContent = uniqueArr[i];
      searchHistoryListEl.appendChild(searchHistoryItemEl)
    }
  
    // make searchHistory sortable
  $( "#search-history" ).sortable({
    placeholder: "ui-state-highlight",
    tolerance: "pointer",
    helper: "clone"
  });
  
  
}

var displayCurrentWeather = function(cityName, iconCode, description, dateTime, tempF, humidity, windSpeedMph, uvIndex) {  
  // clear today container El
  todayContainerEl.textContent=""

  // Populate #today-container index.html
  // - header
  let weatherTextEl = document.createElement("div");
  weatherTextEl.classList = "col-12 col-sm-6";

  let cityNameEl = document.createElement("h2");
  cityNameEl.textContent = cityName;
  cityNameEl.classList = "";
  
  let iconSmEl = document.createElement("img");
  iconSmEl.classList = "col-12 col-sm-6 d-none d-sm-block weather-icon";
  iconSmEl.setAttribute("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`);
  iconSmEl.setAttribute("alt", description);

  let iconXsEl = document.createElement("img");
  iconXsEl.classList = "d-sm-none weather-icon-xs";
  iconXsEl.setAttribute("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`);
  iconXsEl.setAttribute("alt", description);
  
  let dateTimeEl = document.createElement("p");
  dateTimeEl.textContent = dateTime.format("MMM DD YYYY hh:mm a");

  let tempFEl = document.createElement("p");
  tempFEl.textContent = `Temperature: ${tempF}°F`

  let humidityEl = document.createElement("p");
  humidityEl.textContent = `Humidity: ${humidity}%`

  let windSpeedMphEl = document.createElement("p");
  windSpeedMphEl.textContent = `Wind Speed: ${windSpeedMph}MPH`

  let uvIndexEl = document.createElement("p");
  uvIndexEl.textContent = `UV Index: ${uvIndex}`
  // dynamic pill badge
  if(uvIndex >= 8) {
    uvIndexEl.classList = "badge badge-danger"
  } else if (uvIndex >= 6) {
    uvIndexEl.classList = "badge badge-orange"
  } else if (uvIndex >= 3) {
    uvIndexEl.classList = "badge badge-warning"
  } else {
    uvIndexEl.classList = "badge badge-success"
  }

  todayContainerEl.appendChild(weatherTextEl);
  todayContainerEl.appendChild(iconSmEl);
  weatherTextEl.appendChild(cityNameEl);
  weatherTextEl.appendChild(iconXsEl);
  weatherTextEl.appendChild(dateTimeEl);
  weatherTextEl.appendChild(tempFEl);
  weatherTextEl.appendChild(humidityEl);
  weatherTextEl.appendChild(windSpeedMphEl);
  weatherTextEl.appendChild(uvIndexEl);
  // add today weather text
};

// Event Listeners
searchFormEl.addEventListener("submit", getSearchTerm);
searchHistoryListEl.addEventListener("click", searchHistoryHandler);