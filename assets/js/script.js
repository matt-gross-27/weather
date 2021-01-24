// Global variables
let apiKey = "bfa05a6206f62e06173b627eb3956550"
// dom references
let searchHistoryListEl = document.querySelector("#search-history");
let searchFormEl = document.querySelector("#search-form");
let todayContainerEl = document.querySelector("#today-container");

// get user searchTerm
var getSearchTerm = function(event) {
  event.preventDefault();
  var input = document.querySelector("#search-input")
  var searchTerm = input.value.toLowerCase().trim();
  fetchCurrentWeather(searchTerm);
  input.textContent = "";
}

// get city weather
let fetchCurrentWeather = function(city) {
  let apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  fetch(apiUrl).then(function(res) {
    res.json().then(function(currentWeather) {
      let cityName = currentWeather.name;
      // create java script date time object from weather api dt (10 dig num)
      var dateTime = currentWeather.dt*1000;
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
        })
      })
    })
  })
};

var displayCurrentWeather = function(cityName, iconCode, description, dateTime, tempF, humidity, windSpeedMph, uvIndex) {
  console.log(
    `
    cityName: ${cityName}
    dateTime: ${dateTime}
    tempF: ${tempF}
    humidity: ${humidity}
    windSpeedMph: ${windSpeedMph}
    iconCode: ${iconCode}
    description: ${description}
    uvIndex: ${uvIndex}`
  );
  // add city to search history
  let searchHistoryItemEl = document.createElement("li");
  searchHistoryItemEl.classList = "list-group-item";
  searchHistoryItemEl.textContent = cityName;
  searchHistoryListEl.appendChild(searchHistoryItemEl)

  // Populate #today-container index.html
  // - header
  let weatherTextEl = document.createElement("div");
  weatherTextEl.classList = "col-12 col-sm-6";

  let cityNameEl = document.createElement("h2");
  cityNameEl.textContent = cityName;
  cityNameEl.classList = "";
  
  let iconEl = document.createElement("img");
  iconEl.classList = "col-12 col-sm-6 d-none d-sm-block";
  iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`);
  iconEl.setAttribute("alt", description);
  
  let dateObj = new Date(dateTime);
  console.log(dateObj);

  // TO DO: format date text
  let dateTimeEl = document.createElement("p");
  dateTimeEl.textContent = dateObj;

  let tempFEl = document.createElement("p");
  tempFEl.textContent = `Temperature: ${tempF}°F`

  let humidityEl = document.createElement("p");
  humidityEl.textContent = `Humidity: ${humidity}%`

  let windSpeedMphEl = document.createElement("p");
  windSpeedMphEl.textContent = `Wind Speed: ${windSpeedMph}MPH`

  let uvIndexEl = document.createElement("p");
  uvIndexEl.textContent = `UV Index: ${uvIndex}`
  // TO DO: make pill-badge dynamic
  uvIndexEl.classList = "badge badge-pill badge-primary"

  
  
  todayContainerEl.appendChild(weatherTextEl);
  todayContainerEl.appendChild(iconEl);
  
  weatherTextEl.appendChild(cityNameEl);
  weatherTextEl.appendChild(dateTimeEl);
  weatherTextEl.appendChild(tempFEl);
  weatherTextEl.appendChild(humidityEl);
  weatherTextEl.appendChild(windSpeedMphEl);
  weatherTextEl.appendChild(uvIndexEl);
  // add today weather text






};

// Event Listeners
searchFormEl.addEventListener("submit", getSearchTerm);

