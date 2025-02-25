"use client"

import { CitySearch } from "@/components/city-search"
import { CurrentWeather } from "@/components/current-weather"
import { Forecast } from "@/components/forecast"
import { HourlyForecast } from "@/components/hourly-forecast"
import { Favorites } from "@/components/favorites"
import { WeatherProvider } from "@/context/weather-context"

export default function Home() {
  return (
    <WeatherProvider>
      {/* 
        Ajout d'un conteneur responsive pour un meilleur rendu sur mobile/desktop 
        et ajout d'un léger padding en mobile-first
      */}
      <main className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-4 sm:px-6 sm:py-8 md:px-8 md:py-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-8">
          <h1
            className="text-center text-4xl font-extrabold tracking-tight text-sky-400 drop-shadow-md transition-transform duration-300 hover:scale-105 sm:text-5xl"
          >
            VoMeteo
          </h1>

          {/* Liste des villes favorites */}
          <Favorites />

          {/* Bloc de recherche de ville */}
          <div className="w-full rounded-xl bg-white/10 p-4 shadow-xl transition-transform duration-300 hover:scale-105 sm:p-6">
            <CitySearch />
          </div>

          {/* Météo actuelle avec bouton pour ajouter aux favoris */}
          <CurrentWeather />

          {/* Prévisions journalières */}
          <Forecast />

          {/* Prévision horaire */}
          <HourlyForecast />
        </div>
      </main>
    </WeatherProvider>
  )
}
