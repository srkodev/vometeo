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
    <Card className="bg-white/10 border-none shadow-xl rounded-xl transition-transform duration-300 hover:scale-105 w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          Prévisions Journalières
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Grille responsive : 2 colonnes en mobile, 5 en desktop */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {weatherData.forecast.map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-lg bg-white/20 p-3 text-white transition-transform duration-200 hover:scale-105"
            >
              <p className="text-sm font-medium">{day.day}</p>
              <div className="mt-2 text-2xl">
                {/* Pour l'instant, on affiche des emojis simples */}
                {day.icon === "0" ? "☀️" : day.icon === "1" ? "🌤️" : "☁️"}
              </div>
              <p className="mt-2 text-lg font-semibold">{day.temp}°C</p>

              {/* Affichage de la probabilité de précipitation s'il y en a */}
              {day.precipProbability !== null && (
                <p className="mt-1 text-sm">
                  Pluie : {day.precipProbability}%
                </p>
              )}

              {/* Lever/Coucher du soleil */}
              {day.sunrise && day.sunset && (
                <div className="mt-2 text-xs space-y-1 text-center">
                  <p>Lever : {new Date(day.sunrise).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
                  <p>Coucher : {new Date(day.sunset).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
