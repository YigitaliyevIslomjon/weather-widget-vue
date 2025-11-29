import { getWeatherByCoords as getWeatherByCoordsAPI, getCityList } from './api'  
import { weatherMapper, cityMapper } from './mapper'
import * as Types from './types'

// Business logic with mapping
export async function getWeatherByCoords(
  lat: number, 
  lon: number
): Promise<Types.IEntity.Weather> {
  const response = await getWeatherByCoordsAPI(lat, lon)
  return weatherMapper(response.data)
}

export async function getWeatherByCity(
  city: Types.IEntity.City
): Promise<Types.IEntity.Weather> {
  return getWeatherByCoords(city.lat, city.lon)
}

export async function searchCity(
  query: string
): Promise<Types.IEntity.City[]> {
  const response = await getCityList(query)
  return response.data.map(cityMapper)
}

export async function getCurrentLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    // Browser support check
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }
    
    // With timeout getCurrentPosition
    const timeoutId = setTimeout(() => {
      reject(new Error('Location request timed out. Please try again or add city manually.'))
    }, 10000) // 10 sekund timeout
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId)
      
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      },
      (error) => {
        clearTimeout(timeoutId)
        // Error type by message
        let message = 'Failed to get location. '
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += 'Location permission denied. Please enable location access in your browser settings.'
            console.error('🚫 Permission denied')
            break
          case error.POSITION_UNAVAILABLE:
            message += 'Location information unavailable. Please check your device settings.'
            console.error('📍 Position unavailable')
            break
          case error.TIMEOUT:
            message += 'Location request timed out. Please try again.'
            console.error('⏱️ Timeout')
            break
          default:
            message += 'An unknown error occurred.'
            console.error('❓ Unknown error')
        }
        
        reject(new Error(message))
      },
      {
        enableHighAccuracy: false, // Faster result
        timeout: 8000,             // 8 seconds
        maximumAge: 300000         // 5 minutes cache
      } 
    )
  })
}


