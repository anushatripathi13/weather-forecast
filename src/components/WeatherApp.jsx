import React, { useState, useEffect } from "react";
import axios from "axios";
import CurrentWeather from "./CurrentWeather";
import ForecastDay from "./ForecastDay";

const WeatherApp = () => {
  const [location, setLocation] = useState("New York");
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [locationError, setLocationError] = useState(null);

  const weatherIcons = {
    1: "☀️",
    2: "⛅",
    3: "☁️",
  };

  const ApiHandler = async (latitude, longitude) => {
    const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=3`;

    try {
      const response = await axios.get(weatherApi);
      const data = response?.data;

      const currentTemperature = data?.current?.temperature_2m;
      const weatherCode = data?.current?.weather_code;

      const weatherDescriptions = {
        1: "Clear sky",
        2: "Partly cloudy",
        3: "Cloudy",
      };
      const weatherDescription = weatherDescriptions[weatherCode] || "Unknown";
      const weatherIcon = weatherIcons[weatherCode] || "🤔";

      const forecastData = data?.daily || [];
      const formattedForecast = forecastData.time.map((date, index) => ({
        date,
        temperatureRange: `${forecastData.temperature_2m_min[index]}°C - ${forecastData.temperature_2m_max[index]}°C`,
        weatherCode: forecastData.weathercode[index],
      }));

      formattedForecast.forEach(day => {
        day.weatherDescription = weatherDescriptions[day.weatherCode] || "Unknown";
        day.weatherIcon = weatherIcons[day.weatherCode] || "🤔";
      });

      setCurrentWeather({ temperature: currentTemperature, description: weatherDescription, icon: weatherIcon });
      setForecast(formattedForecast);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }

    function success(position) {
      const latitude = position.coords.latitude.toFixed(4);
      const longitude = position.coords.longitude.toFixed(4);

      const apiKey = "2cc16e35c8cc4dd28d9bdbe9e85931c6";
      const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${apiKey}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const cityName = data.results[0]?.components?.city;
          const townName = data.results[0]?.components?.town;

          setLocation(townName || cityName || "Unknown Location");

          ApiHandler(latitude, longitude);
        })
        .catch(error => {
          console.error("Error fetching location information:", error);
        });
    }

    function error(error) {
      console.log("Unable to retrieve your location");
      setLocationError( "Error retrieving location");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-300 to-blue-500">
      <div className="text-center text-white">
        {locationError ? (
          <p className="text-2xl text-white-500">{locationError}</p>
        ) : (
          <>
            <h1 className="text-4xl font-bold">{location}</h1>
            <CurrentWeather icon={currentWeather.icon} temperature={currentWeather.temperature} description={currentWeather.description} />
          </>
        )}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {forecast.map((day, index) => (
          <ForecastDay key={index} date={day.date} weatherIcon={day.weatherIcon} weatherDescription={day.weatherDescription} temperatureRange={day.temperatureRange} />
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;
