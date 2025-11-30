import { getWeatherByCoords as getWeatherByCoordsAPI, getCityList } from './api'  
import { weatherMapper, cityMapper } from './mapper'
import * as Types from './types'

// Business logic with mapping
export async function getWeatherByCoords(
  lat: number, 
  lon: number
): Promise<Types.IEntity.Weather> {
  const response = await getWeatherByCoordsAPI(lat, lon)
  return weatherMapper(response?.data)
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
  return response?.data?.map((item: any) => cityMapper(item))
}

export async function getCurrentLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Browser does not support geolocation'))
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        })
      },
      () => {
        reject(new Error('Failed to get location. User denied or unavailable.'))
      },
      {
        timeout: 8000
      }
    )
  })
}



