// utils
import { get} from "radash"
// types
import { CityEntity, WeatherEntity } from "@/modules/WeatherWidget/types"

export const weatherMapper = (data: any): WeatherEntity => ({
  cityId: `${get(data, 'coord.lat', 0)}-${get(data, 'coord.lon', 0)}`,
  cityName: get(data, 'name', ''),
  country: get(data, 'sys.country', ''),
  temp: get(data, 'main.temp', 0),
  feelsLike: get(data, 'main.feels_like', 0),
  description: get(data, 'weather[0].description', ''),
  humidity: get(data, 'main.humidity', 0),
  pressure: get(data, 'main.pressure', 0),
  windSpeed: get(data, 'wind.speed', 0),
  windDeg: get(data, 'wind.deg', 0),
  dewPoint: get(data, 'main.temp', 0) - ((100 - get(data, 'main.humidity', 0)) / 5),
  visibility: get(data, 'visibility', 0) / 1000,
  icon: get(data, 'weather[0].icon', '')
})
    
  
export const cityMapper = (data: any): CityEntity => ({
  id: `${get(data, 'lat', 0)}-${get(data, 'lon', 0)}`,  
  name: get(data, 'name', ''),
  country: get(data, 'country', ''),
  lat: get(data, 'lat', 0),
  lon: get(data, 'lon', 0)
})