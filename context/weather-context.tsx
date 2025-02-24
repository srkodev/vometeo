"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export type HourlyData = {
  time: string
  temperature: number
  icon: string
  precip?: number | null  // probabilité de précipitation par heure
}

export type DailyForecast = {
  day: string
  temp: number
  icon: string
  precipProbability?: number | null // probabilité de pluie journalière
  sunrise?: string
  sunset?: string
}

export type WeatherData = {
  city: string
  latitude: number
  longitude: number
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  forecast: DailyForecast[]
  hourly?: HourlyData[]
  precipitation?: number | null // <-- Propriété qui manquait pour la météo actuelle
}

type WeatherContextType = {
  weatherData: WeatherData | null
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData | null>>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  error: string | null
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        setWeatherData,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider")
  }
  return context
}
