// All element refernces
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const weatherInfo = document.getElementById("weather-info");
const cityName = document.getElementById("city-name");
const dateTime = document.getElementById("date-time");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const weatherType = document.getElementById("weather-desc");
const errorMsg = document.getElementById("error-msg");
const loader = document.getElementById("loading");
const feelLike = document.getElementById("feel-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const celBtn = document.getElementById("celsius");
const farBtn = document.getElementById("fahrenheit");

// Weather icon mapping
const weatherIcons = {
  clear: "https://cdn-icons-png.flaticon.com/512/6974/6974833.png",
  "partly-cloudy": "https://cdn-icons-png.flaticon.com/512/1146/1146869.png",
  cloudy: "https://cdn-icons-png.flaticon.com/512/414/414927.png",
  overcast: "https://cdn-icons-png.flaticon.com/512/1779/1779940.png",
  fog: "https://cdn-icons-png.flaticon.com/512/1197/1197102.png",
  drizzle: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
  rain: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
  snow: "https://cdn-icons-png.flaticon.com/512/642/642102.png",
  thunderstorm: "https://cdn-icons-png.flaticon.com/512/1959/1959338.png",
  default: "https://cdn-icons-png.flaticon.com/512/1779/1779940.png",
};

// Weather code to description mapping
const weatherDescriptions = {
  0: { code: "clear", desc: "Clear sky" },
  1: { code: "partly-cloudy", desc: "Mainly clear" },
  2: { code: "partly-cloudy", desc: "Partly cloudy" },
  3: { code: "overcast", desc: "Overcast" },
  45: { code: "fog", desc: "Fog" },
  48: { code: "fog", desc: "Depositing rime fog" },
  51: { code: "drizzle", desc: "Light drizzle" },
  53: { code: "drizzle", desc: "Moderate drizzle" },
  55: { code: "drizzle", desc: "Dense drizzle" },
  56: { code: "drizzle", desc: "Light freezing drizzle" },
  57: { code: "drizzle", desc: "Dense freezing drizzle" },
  61: { code: "rain", desc: "Slight rain" },
  63: { code: "rain", desc: "Moderate rain" },
  65: { code: "rain", desc: "Heavy rain" },
  66: { code: "rain", desc: "Light freezing rain" },
  67: { code: "rain", desc: "Heavy freezing rain" },
  71: { code: "snow", desc: "Slight snow fall" },
  73: { code: "snow", desc: "Moderate snow fall" },
  75: { code: "snow", desc: "Heavy snow fall" },
  77: { code: "snow", desc: "Snow grains" },
  80: { code: "rain", desc: "Slight rain showers" },
  81: { code: "rain", desc: "Moderate rain showers" },
  82: { code: "rain", desc: "Violent rain showers" },
  85: { code: "snow", desc: "Slight snow showers" },
  86: { code: "snow", desc: "Heavy snow showers" },
  95: { code: "thunderstorm", desc: "Thunderstorm" },
  96: { code: "thunderstorm", desc: "Thunderstorm with slight hail" },
  99: { code: "thunderstorm", desc: "Thunderstorm with heavy hail" },
};

// Variables
let currentTempC = 0;
let currentFeelsLikeC = 0;
let isMetric = true;

// Event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherByCity(city);
    }
  }
});

celBtn.addEventListener("click", () => {
     if(!isMetric){//temprature in fernheit
          isMetric = true;//change to celcius
          celBtn.classList.add("active");
          farBtn.classList.remove("active");
          updateTemperatureDisplay();
     }
});

farBtn.addEventListener("click", () => {
     if(isMetric){
          isMetric = false;
          farBtn.classList.add("active");
          celBtn.classList.remove("active");
          updateTemperatureDisplay();
     }
});

locationBtn.addEventListener("click", () => {
     if (navigator.geolocation) {
       showLoading()
       navigator.geolocation.getCurrentPosition(
         (position) => {
           getWeatherByCoords(position.coords.latitude, position.coords.longitude)
         },
         (error) => {
           hideLoading()
           showError()
           console.error("Error getting location:", error)
         },
       )
     } else {
       showError("Geolocation is not supported by this browser.")
     }
   })

// Functions
async function getWeatherByCity(city) {
  showLoading();
  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`,
    );
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
     throw new Error("City not found")
   }

    const { latitude, longitude, name, country } = geoData.results[0];
    getWeatherByCoords(latitude, longitude, `${name}, ${country}`);
  } catch (error) {
    hideLoading();
    showError();
    console.error("Error fetching City coordinates : ", error);
  }
}

async function getWeatherByCoords(lat, lon, locationName = null) {
  try {
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
    );
    const weatherData = await weatherResponse.json();

    if (!locationName) {
      try {
        const reverseGeoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`,
        );
        const reverseGeoData = await reverseGeoResponse.json();

        if (reverseGeoData.results && reverseGeoData.results.length > 0) {
          const { name, country } = reverseGeoData.results[0];
          locationName = `${name}, ${country}`;
        } else {
          locationName = "Your Location";
        }
      } catch (error) {
        locationName = "Your Location";
        console.error("Error fetching Location Name : ", error);
      }
    }
    displayWeatherData(weatherData, locationName);
  } catch (error) {
    hideLoading();
    showError();
    console.error("Error fetching weather data : ", error);
  }
}

function displayWeatherData(data, location) {
  const curr = data.current;
  console.log(data);

  // Store temperature values for unit conversion
  currentTempC = curr.temperature_2m;
  currentFeelsLikeC = curr.apparent_temperature;

  cityName.textContent = location;
  dateTime.textContent = getCurrentDateTime(data.timezone);

  //   Set the weather icon and desc
  const weatherCode = curr.weather_code;
  const weatherDesc = weatherDescriptions[weatherCode] || {
    code: "default",
    desc: "Unknown",
  };
  weatherIcon.src = weatherIcons[weatherDesc.code];
  weatherType.textContent = weatherDesc.desc;

  //   Update temprature
  updateTemperatureDisplay();

  //   Set humidity and wind speed
  humidity.textContent = `${curr.relative_humidity_2m}%`;
  windSpeed.textContent = `${curr.wind_speed_10m} km/h`;
  hideLoading();
  hideError();
  showWeatherInfo();
  updateBackground(weatherDesc.code);
}

function updateTemperatureDisplay() {
  if (isMetric) {
    temperature.textContent = `${Math.round(currentTempC)}°C`;
    feelLike.textContent = `${Math.round(currentFeelsLikeC)}°C`;
  } else {
    const tempF = celsiusToFahrenheit(currentTempC);
    const feelsLikeF = celsiusToFahrenheit(currentFeelsLikeC);
    temperature.textContent = `${Math.round(tempF)}°F`;
    feelLike.textContent = `${Math.round(feelsLikeF)}°F`;
  }
}

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}
function getCurrentDateTime(timezone) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date().toLocaleString("en-US", { ...options, timeZone: timezone });
}

function updateBackground(weatherCode) {
  const weatherBox = document.querySelector(".weather-box");

  // Remove all previous weather classes
  weatherBox.classList.remove("clear-sky", "clouds", "rain", "snow", "mist");

  // Add appropriate class based on weather
  switch (weatherCode) {
    case "clear":
      weatherBox.classList.add("clear-sky");
      break;
    case "partly-cloudy":
    case "cloudy":
    case "overcast":
      weatherBox.classList.add("clouds");
      break;
    case "drizzle":
    case "rain":
    case "thunderstorm":
      weatherBox.classList.add("rain");
      break;
    case "snow":
      weatherBox.classList.add("snow");
      break;
    case "fog":
      weatherBox.classList.add("mist");
      break;
    default:
    // No specific background
  }
}

function showLoading() {
  loader.classList.remove("hidden");
  weatherInfo.classList.add("hidden");
  errorMsg.classList.add("hidden");
}
function hideLoading() {
  loader.classList.add("hidden");
}
function showError(msg = null) {
  errorMsg.classList.remove("hidden");
  if (msg) {
    errorMsg.querySelector("p").textContent = msg;
  }
}
function hideError() {
  errorMsg.classList.add("hidden");
}
function showWeatherInfo() {
  weatherInfo.classList.remove("hidden");
}
function hideWeatherInfo() {
  weatherInfo.classList.add("hidden");
}

// Initialize with a default city on page load
window.addEventListener("load", () => {
  getWeatherByCity("Ahmedabad");
});
