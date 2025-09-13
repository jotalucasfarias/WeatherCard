/// <reference types="vite/types/importMeta.d.ts" />

import { useState } from 'react';
import { FiWind } from 'react-icons/fi';
import { IoSearchOutline } from 'react-icons/io5';
import { WiHumidity } from 'react-icons/wi';

const API_KEY = import.meta.env.VITE_API_KEY;

interface WeatherData {
  cityName: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherIcon: string;
}

export default function WeatherCard() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');

  async function buscarClima(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      setError('');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`,
      );
      const data = await response.json();
      if (data.cod !== 200) {
        setError(data.message);
        return;
      }

      const dados: WeatherData = {
        cityName: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        weatherIcon: data.weather[0].icon,
      };
      setWeatherData(dados);
      console.log(dados);
    } catch (err) {
      setError('Cidade Não Encontrada, Tente Novamente!');
      console.error(err);
      setWeatherData(null);
    }
  }

  function iconeClima(): string {
    if (!weatherData) return '';
    const isNight = weatherData.weatherIcon.endsWith('n');
    if (isNight) return '/lua.svg';
    if (weatherData.temperature >= 25) return '/sol.svg';
    return '/nuvem-sol.svg';
  }

  const iconeAtual = iconeClima();

  function degradeCard(): string {
    if (!weatherData) return 'from-gray-400 to-gray-600';
    const isNight = weatherData.weatherIcon.endsWith('n');
    if (isNight) return 'from-[#6CCDB0] to-[#3278B9]';
    if (weatherData.temperature >= 25) return 'from-[#C75A5A] to-[#BDAF5F]';
    return 'from-[#905AD4] to-[#3330A5]';
  }

  return (
    <div
      className={`w-full max-w-[95vw] sm:max-w-md md:max-w-2xl mx-4 sm:mx-0 inline-flex flex-col gap-6 bg-gradient-to-br px-5 py-6 sm:px-10 sm:py-8 rounded-3xl ${degradeCard()}`}
    >
      <div className="flex justify-center ">
        <form
          className="flex flex-row items-center justify-between w-full gap-3"
          onSubmit={buscarClima}
        >
          <input
            type="text"
            placeholder="Digite o nome da cidade"
            className="flex-1 min-w-0 px-4 py-3 rounded-3xl bg-white text-black hover:scale-105 active:scale-95 transition outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            type="submit"
            className="p-3 sm:p-4 cursor-pointer bg-white rounded-full hover:scale-105 active:scale-95 transition flex items-center justify-center"
            aria-label="Buscar"
          >
            <IoSearchOutline className="text-black text-lg sm:text-2xl" />
          </button>
        </form>
      </div>

      <div>
        <div className="flex justify-center items-center flex-col gap-3">
          <div className="h-12">
            {error && (
              <p className="text-red-500 font-inter bg-white px-4 py-2 rounded-full text-sm sm:text-base">
                Cidade não encontrada. Tente novamente!
              </p>
            )}

            {weatherData && !error && (
              <h1 className="text-lg sm:text-2xl md:text-3xl text-white font-bold font-poppins">
                {weatherData.cityName}
              </h1>
            )}
          </div>
          <div>
            {weatherData && (
              <img
                src={iconeAtual}
                alt="Ícone do clima"
                className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48"
              />
            )}
          </div>

          <h1 className="font-black text-3xl sm:text-5xl md:text-6xl text-white font-oswald ">
            {weatherData?.temperature !== undefined
              ? `${weatherData.temperature.toFixed(0)}°C`
              : '--'}
          </h1>
          <h2 className="text-sm sm:text-base text-white font-inter"></h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:justify-around gap-4 sm:gap-10">
        <div className="flex gap-3 items-center">
          <WiHumidity className="text-white text-2xl sm:text-3xl md:text-4xl" />
          <div>
            <p className="text-white font-bold font-poppins">
              {weatherData?.humidity !== undefined
                ? `${weatherData?.humidity.toFixed(0)} %`
                : '--'}
            </p>
            <p className="text-white text-xs sm:text-sm font-poppins">
              Humidity
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <FiWind className="text-white text-2xl sm:text-3xl md:text-4xl" />
          <div>
            <p className="text-white font-bold font-poppins">
              {weatherData?.windSpeed !== undefined
                ? `${weatherData?.windSpeed.toFixed(2)} m/s`
                : '--'}
            </p>
            <p className="text-white text-xs sm:text-sm font-poppins">
              Wind Speed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
