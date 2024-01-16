import React from "react";
import WeatherIcon from "./WeatherIcon";

const ForecastDay = ({ date, weatherIcon, weatherDescription, temperatureRange }) => (
  <div className="bg-white/60 backdrop-blur rounded-xl p-4 space-y-2 text-center" style={{ padding: "20px 50px 50px" }}>
    <h2 className="text-lg font-bold">{date}</h2>
    <div style={{ margin: "10px 0 25px 0" }}>
      {weatherIcon && <WeatherIcon icon={weatherIcon} />}
    </div>
    <div>
      <p className="text-sm">{weatherDescription}</p>
      <p className="text-sm">{temperatureRange}</p>
    </div>
  </div>
);

export default ForecastDay;
