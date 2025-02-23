import { Cloud, Sun, CloudRain, Snowflake, CloudLightning } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWeather } from "@/context/weather-context"

export function Forecast() {
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

  const getWeatherIcon = (code: string) => {
    const codeNum = Number.parseInt(code)
    if (codeNum <= 3) return <Sun className="h-10 w-10 text-yellow-300" />
    if (codeNum <= 48) return <Cloud className="h-10 w-10 text-gray-300" />
    if (codeNum <= 67) return <CloudRain className="h-10 w-10 text-blue-300" />
    if (codeNum <= 77) return <Snowflake className="h-10 w-10 text-blue-200" />
    if (codeNum >= 95) return <CloudLightning className="h-10 w-10 text-purple-300" />
    return <CloudRain className="h-10 w-10 text-blue-300" />
  }

  return (
    <Card className="bg-white/10 border-none shadow-xl rounded-xl transition-transform duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Prévisions sur 5 jours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weatherData.forecast.map((day, index) => (
            <div
              key={index}
              className="text-center bg-white/20 rounded-lg p-3 transition-transform hover:scale-105"
            >
              <p className="font-medium text-white">{day.day}</p>
              {getWeatherIcon(day.icon)}
              <p className="text-lg font-semibold text-white mt-2">{day.temp}°C</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

