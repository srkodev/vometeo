import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWeather } from "@/context/weather-context"

export function Forecast() {
  const { weatherData, loading, error } = useWeather()

  if (loading) {
    return <div className="text-center text-white text-lg">Chargement...</div>
  }
  if (error || !weatherData) {
    return null
  }

  return (
    <Card className="bg-white/10 border-none shadow-xl rounded-xl transition-transform duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Prévisions Journalières</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {weatherData.forecast.map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-lg bg-white/20 p-4 transition-transform duration-200 hover:scale-105"
            >
              <p className="text-sm font-medium text-white">{day.day}</p>
              <div className="mt-2 text-3xl">
                {/* Pour l'instant, on affiche simplement un emoji générique, vous pouvez personnaliser en fonction du code météo */}
                {day.icon === "0" ? "☀️" : day.icon === "1" ? "🌤️" : "☁️"}
              </div>
              <p className="mt-2 text-lg font-semibold text-white">{day.temp}°C</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
