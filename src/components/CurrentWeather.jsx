import React from "react";
import WeatherIcon from "./WeatherIcon";

const CurrentWeather = ({ icon, temperature, description }) => (
  <div className="flex items-center justify-center space-x-2">
    <div>
      <h2 className="text-6xl font-bold mt-8">
        <span>{icon && <WeatherIcon icon={icon} />}</span>
        {temperature}°C
      </h2>
      <p className="text-xl ml-8">{description}</p>
    </div>
  </div>
);

export default CurrentWeather;
