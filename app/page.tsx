"use client"

import { CitySearch } from "@/components/city-search"
import { CurrentWeather } from "@/components/current-weather"
import { Forecast } from "@/components/forecast"
import { WeatherProvider } from "@/context/weather-context"

export default function Home() {
  return (
    <WeatherProvider>
      {/* Contexte météo englobant toute l'application */}
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 flex items-center justify-center">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Titre principal */}
          <h1
            className="text-center text-5xl font-bold drop-shadow-lg transition-transform duration-300 hover:scale-105"
            style={{ color: "#2089da" }}
          >
            VoMeteo
          </h1>

          {/* Bloc de recherche de ville */}
          <div className="rounded-xl bg-white/10 p-6 shadow-xl transition-transform duration-300 hover:scale-105">
            <CitySearch />
          </div>

          {/* Météo actuelle */}
          <CurrentWeather />

          {/* Prévisions */}
          <Forecast />
        </div>
      </main>
    </WeatherProvider>
  )
}

