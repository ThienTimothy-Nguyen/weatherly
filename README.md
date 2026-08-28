# Weatherly

Weatherly is a responsive weather application that makes it easy to check current conditions and plan ahead with a five-day forecast. Search for a city to view live weather data, including temperature, conditions, humidity, wind speed, and daily highs and lows.

> Weatherly is currently under development. A live demo is not available yet.

## Features

- Search for current weather by city
- View temperature and weather conditions at a glance
- See additional details such as humidity and wind speed
- Browse a five-day forecast with daily high and low temperatures
- Display weather-specific icons and descriptions
- Handle loading, invalid searches, and API errors
- Responsive layout for desktop and mobile devices

## Built With

- HTML5
- CSS3
- JavaScript (ES modules)
- [OpenWeather API](https://openweathermap.org/api)

## Getting Started

Follow these steps to run Weatherly locally.

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- An [OpenWeather API key](https://home.openweathermap.org/api_keys)
- A local development server, such as the VS Code Live Server extension

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ThienTimothy-Nguyen/weatherly.git
   ```

2. Move into the project directory:

   ```bash
   cd weatherly
   ```

3. Add your OpenWeather API key to the API configuration used by the project.

   ```js
   const API_KEY = "your_openweather_api_key";
   ```

4. Start the project with a local development server, then open the provided local URL in your browser.

> Do not commit your API key to GitHub. For production deployment, store it in an environment variable or route API requests through a backend service.

## How It Works

Weatherly requests current conditions and forecast data from OpenWeather. Forecast entries are grouped by date, then transformed into daily summaries containing the minimum temperature, maximum temperature, representative weather description, and icon.

## Roadmap

- [ ] Publish a live demo
- [ ] Add geolocation-based weather
- [ ] Add Celsius and Fahrenheit controls
- [ ] Save recent or favorite cities
- [ ] Improve accessibility and keyboard navigation

## Contributing

Contributions are welcome. To propose a change:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Author

[Timothy Nguyen](https://github.com/ThienTimothy-Nguyen)

## Acknowledgments

- [OpenWeather](https://openweathermap.org/) for weather data and condition icons
