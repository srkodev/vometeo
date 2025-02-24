"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWeather } from "@/context/weather-context"

/**
 * Renvoie un emoji en fonction du code météo.
 */
function getIcon(code: string) {
  const codeNum = Number(code)
  if (codeNum <= 3) return <span>☀️</span>
  if (codeNum <= 48) return <span>☁️</span>
  if (codeNum <= 67) return <span>🌧️</span>
  if (codeNum <= 77) return <span>❄️</span>
  if (codeNum >= 95) return <span>⛈️</span>
  return <span>🌦️</span>
}

export function HourlyForecast() {
  const { weatherData, loading, error } = useWeather()
  const containerRef = useRef<HTMLDivElement>(null)

  // Utiliser des données par défaut pour éviter de conditionner l'appel des hooks.
  const hourly = weatherData && weatherData.hourly ? weatherData.hourly : []

  // Grouper les heures par jour
  const groupedHours = hourly.reduce((acc, hour) => {
    const dateLabel = new Date(hour.time).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    if (!acc[dateLabel]) {
      acc[dateLabel] = []
    }
    acc[dateLabel].push(hour)
    return acc
  }, {} as Record<string, typeof hourly>)

  const dayKeys = Object.keys(groupedHours)
  const todayLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })

  // Définir le jour sélectionné à l'initialisation.
  const initialDay = dayKeys.includes(todayLabel)
    ? todayLabel
    : dayKeys[0] || todayLabel
  const [selectedDay, setSelectedDay] = useState(initialDay)

  // Effet pour défiler automatiquement vers l'heure actuelle si le jour sélectionné est aujourd'hui.
  useEffect(() => {
    if (selectedDay === todayLabel && containerRef.current) {
      const currentHour = new Date().getHours()
      const targetEl = containerRef.current.querySelector<HTMLDivElement>(
        `[data-hour="${currentHour}"]`
      )
      if (targetEl) {
        const container = containerRef.current
        const targetOffset = targetEl.offsetLeft
        const targetWidth = targetEl.clientWidth
        const containerWidth = container.clientWidth
        container.scrollTo({
          left: targetOffset - containerWidth / 2 + targetWidth / 2,
          behavior: "smooth",
        })
      }
    }
  }, [selectedDay, todayLabel])

  if (loading) {
    return <div className="text-center text-white text-lg">Chargement...</div>
  }
  if (error) {
    return (
      <div className="text-center text-red-500 bg-white/50 rounded-lg p-4">
        {error}
      </div>
    )
  }
  if (hourly.length === 0) return null

  return (
    <Card className="w-full max-w-4xl bg-white/10 border-none shadow-xl rounded-xl transition-transform duration-300 hover:scale-105">
      <CardHeader className="flex flex-col">
        <CardTitle className="text-2xl text-white">Prévision Horaire</CardTitle>
        {/* Onglets pour sélectionner le jour */}
        <div className="mt-2 flex space-x-2 overflow-x-auto">
          {dayKeys.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`whitespace-nowrap rounded px-3 py-1 text-sm transition-colors ${
                selectedDay === day
                  ? "bg-teal-600 text-white"
                  : "bg-white/20 text-white hover:bg-teal-500"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {/* Conteneur horizontal pour les heures du jour sélectionné */}
        <div
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent py-4 snap-x"
        >
          {groupedHours[selectedDay].map((hour, index) => {
            const hourNumber = new Date(hour.time).getHours()
            const isCurrent =
              selectedDay === todayLabel &&
              hourNumber === new Date().getHours()

            return (
              <div
                key={index}
                data-hour={hourNumber}
                className={`snap-center min-w-[5rem] sm:min-w-[6rem] flex flex-col items-center rounded-lg p-3 transition-transform duration-200 hover:scale-105 ${
                  isCurrent ? "bg-teal-600 ring-2 ring-teal-300" : "bg-white/20"
                }`}
              >
                <p className="text-xs sm:text-sm font-medium text-white">
                  {hourNumber}h
                  {isCurrent && (
                    <span className="ml-1 text-[0.7rem]">(Maint.)</span>
                  )}
                </p>
                <div className="mt-2 text-3xl">{getIcon(hour.icon)}</div>
                <p className="mt-2 text-lg font-bold text-white">
                  {hour.temperature}°C
                </p>
                {typeof hour.precip === "number" && (
                  <p className="mt-1 text-xs text-blue-200">
                    Pluie: {hour.precip}%
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
