# Weather Forecast Application

A responsive web-based weather forecast application built with HTML, CSS, and JavaScript. The app lets users search for weather information by entering a city name or by using their current location. It fetches data from the [Open-Meteo API](https://open-meteo.com/) and leverages the [Open-Meteo Geocoding API](https://open-meteo.com/) for converting city names into geographic coordinates.

## Features

- **City Search:** Enter a city name to fetch current weather data.
- **Location-Based Forecast:** Use your current location (via browser geolocation) to get weather details.
- **Unit Toggle:** Switch between Celsius and Fahrenheit temperature units.
- **Weather Details:** Displays temperature, feels-like temperature, humidity, wind speed, and a weather description.
- **Dynamic Backgrounds:** The weather box background changes based on the current weather (clear-skies, clouds, rain, snow, or mist).
- **Error Handling & Loading States:** Displays loading animations when fetching data and error messages when something goes wrong.

## Technologies Used

- **HTML5:** For structuring the application.
- **CSS3:** For styling. Custom properties (CSS variables) are used for colors, shadows, and border radii.
- **JavaScript (ES6+):** For functionality including API calls, DOM manipulation, and event handling.
- **Open-Meteo API:** To fetch weather data based on geographic coordinates.
- **Open-Meteo Geocoding API:** To convert city names to coordinates.
- **Google Fonts:** Uses the "Poppins" font for a modern look.

## How It Works

1. **Search by City:**
   - The user types in a city name into the search input field.
   - Upon clicking the search button or pressing "Enter," an API call is made to the Open-Meteo Geocoding API to retrieve the latitude and longitude of the city.
   - The app then calls the weather forecast endpoint using the coordinates to fetch current weather data.
2. **Get Weather by Location:**
   - Clicking the location button triggers the browser's geolocation API.
   - The app passes the latitude and longitude to the weather forecast API.
   - If available, a reverse geocoding call fetches the associated location name.
3. **Temperature Unit Toggle:**
   - Two buttons allow switching between Celsius and Fahrenheit.
   - Temperature conversion is handled in JavaScript with a simple conversion formula.
4. **Display & Background Updates:**
   - Weather data (temperature, humidity, wind speed, and description) are updated in specific DOM elements.
   - Weather codes are mapped to custom icons and descriptions.
   - The background of the weather box updates dynamically based on the weather description.
5. **Error & Loading States:**
   - A loading spinner is shown when data is being fetched.
   - If an error occurs (e.g., a city not found or geolocation issues), a user-friendly error message is displayed.


## Acknowledgments

 - Special thanks to Open-Meteo for providing free and accessible weather APIs.
 - Google Fonts for providing customizable fonts like Poppins.
