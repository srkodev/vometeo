import {
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  CloudDrizzle,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWeather } from "@/context/weather-context"
import React from "react"
import { cn } from "@/lib/utils"

export function CurrentWeather() {
  const { weatherData, loading, error } = useWeather()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-center text-white text-lg">
          Chargement des données météo...
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="text-center text-red-500 bg-white/10 rounded-lg p-6 shadow-lg backdrop-blur-sm">
        {error}
      </div>
    )
  }
  if (!weatherData) {
    return null
  }

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase()
    const baseClasses = "h-24 w-24 transition-all duration-300 ease-in-out"
    if (c.includes("dégagé")) return <Sun className={cn(baseClasses, "text-yellow-300 animate-pulse")} />
    if (c.includes("nuageux")) return <Cloud className={cn(baseClasses, "text-gray-300")} />
    if (c.includes("pluie")) return <CloudRain className={cn(baseClasses, "text-blue-300")} />
    if (c.includes("bruine")) return <CloudDrizzle className={cn(baseClasses, "text-blue-200")} />
    if (c.includes("neige")) return <Snowflake className={cn(baseClasses, "text-blue-200 animate-bounce")} />
    if (c.includes("orage")) return <CloudLightning className={cn(baseClasses, "text-purple-300")} />
    return <Cloud className={cn(baseClasses, "text-gray-400")} />
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
    <Card className="bg-white/10 border-none shadow-xl rounded-xl w-full max-w-4xl transition-transform duration-300 hover:scale-105">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-white text-center sm:text-left">
          <MapPin className="h-6 w-6 text-blue-300" />
          <span className="font-light">Météo à</span> {weatherData.city}
        </CardTitle>
        <Button 
          onClick={addFavorite} 
          variant="outline" 
          size="sm"
          className="w-full sm:w-auto bg-white/5 hover:bg-white/20 transition-colors duration-200 text-white border-white/20"
        >
          Ajouter aux favoris
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
            <div className="text-5xl sm:text-7xl font-light text-white tracking-tighter">
              {weatherData.temperature}°C
            </div>
            <div className="text-lg sm:text-xl text-white/90 font-medium">{weatherData.condition}</div>
          </div>
          <div>{getWeatherIcon(weatherData.condition)}</div>
        </div>
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-4 transition-all duration-200 hover:bg-white/10 hover:transform hover:scale-[1.02]">
            <Droplets className="h-8 w-8 text-blue-300" />
            <div>
              <p className="text-sm font-medium text-white">Humidité</p>
              <p className="text-base sm:text-lg font-semibold text-white opacity-90">
                {weatherData.humidity || "N/A"}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-4 transition-all duration-200 hover:bg-white/10 hover:transform hover:scale-[1.02]">
            <Wind className="h-8 w-8 text-blue-300" />
            <div>
              <p className="text-sm font-medium text-white">Vent</p>
              <p className="text-base sm:text-lg font-semibold text-white">
                {weatherData.windSpeed} km/h
              </p>
            </div>
          </div>
          {/* Nouveau bloc : probabilité de pluie si dispo */}
          {typeof weatherData.precipitation === 'number' && (
            <div className="flex items-center gap-3 bg-white/5 rounded-lg p-4 transition-all duration-200 hover:bg-white/10 hover:transform hover:scale-[1.02]">
              <CloudRain className="h-8 w-8 text-blue-300" />
              <div>
                <p className="text-sm font-medium text-white">
                  Précipitations
                </p>
                <p className="text-base sm:text-lg font-semibold text-white opacity-90">
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
