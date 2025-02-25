"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useWeather } from "@/context/weather-context"

const weatherCodes: { [key: number]: string } = {
  0: "Ciel dégagé",
  1: "Principalement dégagé",
  2: "Partiellement nuageux",
  3: "Couvert",
  45: "Brouillard",
  48: "Brouillard givrant",
  51: "Bruine légère",
  53: "Bruine modérée",
  55: "Bruine dense",
  56: "Bruine verglaçante légère",
  57: "Bruine verglaçante dense",
  61: "Pluie légère",
  63: "Pluie modérée",
  65: "Pluie forte",
  66: "Pluie verglaçante légère",
  67: "Pluie verglaçante forte",
  71: "Neige légère",
  73: "Neige modérée",
  75: "Neige forte",
  77: "Grains de neige",
  80: "Averses de pluie légères",
  81: "Averses de pluie modérées",
  82: "Averses de pluie violentes",
  85: "Averses de neige légères",
  86: "Averses de neige fortes",
  95: "Orage",
  96: "Orage avec grêle légère",
  99: "Orage avec grêle forte",
}

type City = {
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

export function CitySearch() {
  const [input, setInput] = useState("")
  const [cities, setCities] = useState<City[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [shouldFetchCities, setShouldFetchCities] = useState(true)
  const { setWeatherData, setLoading, setError } = useWeather()

  const abortControllerRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLUListElement>(null)

  const fetchCities = useCallback(async (search: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${search}&count=5&language=fr&format=json`,
        { signal: abortControllerRef.current.signal }
      )
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        setCities(data.results.slice(0, 5))
        setShowSuggestions(true)
      } else {
        setCities([])
        setShowSuggestions(false)
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Erreur lors de la recherche de villes:", error)
      }
      setCities([])
      setShowSuggestions(false)
    }
  }, [])

  useEffect(() => {
    if (!shouldFetchCities) return
    if (input.length > 1) {
      fetchCities(input)
    } else {
      setCities([])
      setShowSuggestions(false)
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [input, shouldFetchCities, fetchCities])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleCitySelect = async (city: City, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setInput(city.name)
    setShouldFetchCities(false)
    setShowSuggestions(false)
    setCities([])
    await fetchWeather(city)
  }

  // Nouvelle version : on récupère le lever/coucher du soleil et la
  // probabilité de précipitation (quotidienne et horaire)
  const fetchWeather = async (city: City) => {
    setLoading(true)
    setError(null)
    try {
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,sunrise,sunset,precipitation_probability_max&hourly=temperature_2m,weather_code,precipitation_probability&timezone=auto&forecast_days=6`
      )
      const weatherData = await weatherResponse.json()
      const currentWeather = weatherData.current
      const dailyForecast = weatherData.daily
      const hourlyData = weatherData.hourly

      const weatherInfo = {
        city: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        temperature: Math.round(currentWeather.temperature_2m),
        condition: weatherCodes[currentWeather.weather_code] || "Inconnu",
        humidity: Math.round(currentWeather.relative_humidity_2m),
        windSpeed: Math.round(currentWeather.wind_speed_10m), // La vitesse est déjà en km/h
        precipitation: currentWeather.precipitation_probability,
        forecast: dailyForecast.time.slice(1).map((time: string, index: number) => ({
          day: new Date(time).toLocaleDateString("fr-FR", { weekday: "short" }),
          temp: Math.round(dailyForecast.temperature_2m_max[index + 1]),
          icon: dailyForecast.weather_code[index + 1].toString(),
          precipProbability: dailyForecast.precipitation_probability_max
            ? dailyForecast.precipitation_probability_max[index + 1]
            : null,
          sunrise: dailyForecast.sunrise[index + 1],
          sunset: dailyForecast.sunset[index + 1],
        })),
        hourly: hourlyData
          ? hourlyData.time.map((time: string, index: number) => ({
              time,
              temperature: Math.round(hourlyData.temperature_2m[index]),
              icon: hourlyData.weather_code[index].toString(),
              precip: hourlyData.precipitation_probability
                ? hourlyData.precipitation_probability[index]
                : null,
            }))
          : [],
      }

      setWeatherData(weatherInfo)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Rechercher une ville..."
          value={input}
          onChange={(e) => {
            setShouldFetchCities(true)
            setInput(e.target.value)
          }}
          className="pr-10 bg-white/50 border-none text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-blue-300"
        />
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-600" />
      </div>
      {showSuggestions && cities.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/90 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          {cities.map((city) => (
            <li
              key={`${city.latitude}-${city.longitude}`}
              className="relative cursor-pointer select-none py-2 px-4 text-gray-800 hover:bg-blue-100 transition-colors duration-150 ease-in-out"
              onClick={(e) => handleCitySelect(city, e)}
            >
              <span className="font-medium">{city.name}</span>
              <span className="text-sm text-gray-500">
                {city.admin1 ? `, ${city.admin1}` : ""}, {city.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
