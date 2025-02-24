"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWeather } from "@/context/weather-context"

export function HourlyForecast() {
  const { weatherData, loading, error } = useWeather()

  if (loading) {
    return <div className="text-center text-white text-lg">Chargement...</div>
  }
  if (error || !weatherData || !weatherData.hourly) {
    return null
  }

  // Transformation simple du code météo en icône
  const getIcon = (code: string) => {
    const codeNum = Number(code)
    if (codeNum <= 3) return <span>☀️</span>
    if (codeNum <= 48) return <span>☁️</span>
    if (codeNum <= 67) return <span>🌧️</span>
    if (codeNum <= 77) return <span>❄️</span>
    if (codeNum >= 95) return <span>⛈️</span>
    return <span>🌦️</span>
  }

  return (
    <Card className="bg-white/10 border-none shadow-xl rounded-xl transition-transform duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Prévision Horaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 py-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {weatherData.hourly.map((hour, index) => (
            <div
              key={index}
              className="min-w-[5rem] bg-white/20 rounded-lg p-3 flex flex-col items-center transition-transform duration-200 hover:scale-105"
            >
              <p className="text-xs font-medium text-white">{new Date(hour.time).getHours()}h</p>
              <div className="mt-2 text-3xl">{getIcon(hour.icon)}</div>
              <p className="mt-2 text-lg font-bold text-white">{hour.temperature}°C</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
