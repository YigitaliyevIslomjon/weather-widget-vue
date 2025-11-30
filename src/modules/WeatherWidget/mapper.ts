// utils
import { get} from "radash"
// types
import * as Types from "./types"

export const weatherMapper = (item?: any): Types.IEntity.Weather => ({
  cityId: `${get(item, 'coord.lat', 0)}-${get(item, 'coord.lon', 0)}`,
  cityName: get(item, 'name', ''),
  country: get(item, 'sys.country', ''),
  temp: get(item, 'main.temp', 0),
  feelsLike: get(item, 'main.feels_like', 0),
  description: get(item, 'weather[0].description', ''),
  humidity: get(item, 'main.humidity', 0),
  pressure: get(item, 'main.pressure', 0),
  windSpeed: get(item, 'wind.speed', 0),
  windDeg: get(item, 'wind.deg', 0),
  dewPoint: get(item, 'main.temp', 0) - ((100 - get(item, 'main.humidity', 0)) / 5),
  visibility: get(item, 'visibility', 0) / 1000,
  icon: get(item, 'weather[0].icon', '')
})
    
  
export const cityMapper = (item: Types.IEntity.City): Types.IEntity.City => ({
  id: `${get(item, 'lat', 0)}-${get(item, 'lon', 0)}`,  
  name: get(item, 'name', ''),
  country: get(item, 'country', ''),
  lat: get(item, 'lat', 0),
  lon: get(item, 'lon', 0)
})