import {
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  CloudDrizzle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWeather } from "@/context/weather-context"
import React from "react"

export function CurrentWeather() {
  const { weatherData, loading, error } = useWeather()

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
  if (!weatherData) {
    return null
  }

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase()
    if (c.includes("dégagé")) return <Sun className="h-20 w-20 text-yellow-300" />
    if (c.includes("nuageux")) return <Cloud className="h-20 w-20 text-gray-300" />
    if (c.includes("pluie")) return <CloudRain className="h-20 w-20 text-blue-300" />
    if (c.includes("bruine")) return <CloudDrizzle className="h-20 w-20 text-blue-200" />
    if (c.includes("neige")) return <Snowflake className="h-20 w-20 text-blue-200" />
    if (c.includes("orage")) return <CloudLightning className="h-20 w-20 text-purple-300" />
    return <Cloud className="h-20 w-20 text-gray-400" />
  }

  const addFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
    const exists = favs.find(
      (f: any) =>
        f.latitude === weatherData.latitude && f.longitude === weatherData.longitude
    )
    if (!exists) {
      favs.push({
        name: weatherData.city,
        latitude: weatherData.latitude,
        longitude: weatherData.longitude,
      })
      localStorage.setItem("favorites", JSON.stringify(favs))
      alert(`${weatherData.city} ajouté aux favoris !`)
    } else {
      alert(`${weatherData.city} est déjà dans vos favoris`)
    }
  }

  return (
    <Card className="bg-white/10 border-none shadow-xl rounded-xl transition-transform duration-300 hover:scale-105 w-full max-w-2xl">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl text-white">
          Météo actuelle à {weatherData.city}
        </CardTitle>
        <Button onClick={addFavorite} variant="outline" size="sm">
          Ajouter aux favoris
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="text-6xl font-bold text-white">
              {weatherData.temperature}°C
            </div>
            <div className="text-xl text-white">{weatherData.condition}</div>
          </div>
          <div>{getWeatherIcon(weatherData.condition)}</div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-blue-300" />
            <div>
              <p className="text-sm font-medium text-white">Humidité</p>
              <p className="text-lg font-semibold text-white">
                {weatherData.humidity}%
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-6 w-6 text-blue-300" />
            <div>
              <p className="text-sm font-medium text-white">Vent</p>
              <p className="text-lg font-semibold text-white">
                {weatherData.windSpeed} km/h
              </p>
            </div>
          </div>
          {/* Nouveau bloc : probabilité de pluie si dispo */}
          {weatherData.precipitation !== null && (
            <div className="flex items-center space-x-2">
              <CloudRain className="h-6 w-6 text-blue-300" />
              <div>
                <p className="text-sm font-medium text-white">
                  Précipitations
                </p>
                <p className="text-lg font-semibold text-white">
                  {weatherData.precipitation}%
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
