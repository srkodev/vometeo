"use client"

import React, { useEffect, useState } from "react"
import { useWeather } from "@/context/weather-context"

type Favorite = {
  name: string
  latitude: number
  longitude: number
}

export function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const { setWeatherData, setLoading, setError } = useWeather()

  useEffect(() => {
    const favs = localStorage.getItem("favorites")
    if (favs) {
      setFavorites(JSON.parse(favs))
    }
  }, [])

  const handleFavoriteClick = async (fav: Favorite) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${fav.latitude}&longitude=${fav.longitude}&current_weather=true&daily=weather_code,temperature_2m_max&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=6`
      )
      const data = await response.json()
      const currentWeather = data.current_weather
      const dailyForecast = data.daily
      const hourlyData = data.hourly

      const weatherInfo = {
        city: fav.name,
        latitude: fav.latitude,
        longitude: fav.longitude,
        temperature: Math.round(currentWeather.temperature),
        condition: "À vérifier", // Vous pouvez adapter selon vos besoins
        humidity: hourlyData.relativehumidity_2m ? hourlyData.relativehumidity_2m[0] : 0,
        windSpeed: Math.round(currentWeather.windspeed * 3.6),
        forecast: dailyForecast.time.slice(1).map((time: string, index: number) => ({
          day: new Date(time).toLocaleDateString("fr-FR", { weekday: "short" }),
          temp: Math.round(dailyForecast.temperature_2m_max[index + 1]),
          icon: dailyForecast.weather_code[index + 1].toString(),
        })),
        hourly: hourlyData
          ? hourlyData.time.map((time: string, index: number) => ({
              time,
              temperature: Math.round(hourlyData.temperature_2m[index]),
              icon: hourlyData.weather_code[index].toString(),
            }))
          : [],
      }
      setWeatherData(weatherInfo)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur lors de la récupération")
    } finally {
      setLoading(false)
    }
  }

  if (favorites.length === 0) return null

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white/10 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold text-white mb-2">Favoris</h2>
      <ul className="flex space-x-4 overflow-x-auto">
        {favorites.map((fav, index) => (
          <li
            key={index}
            className="cursor-pointer text-white hover:underline whitespace-nowrap"
            onClick={() => handleFavoriteClick(fav)}
          >
            {fav.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
