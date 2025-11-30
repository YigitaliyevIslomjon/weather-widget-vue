import axiosConfig from "@/services/axios.config"
// types
import * as Types from "./types"

const URL = {
  weather: '/data/2.5/weather',
  cityList: '/geo/1.0/direct',
} as const


export const getWeatherByCoords = (lat: number, lon: number): Promise<Types.IApi.Weather.Response> => 
  axiosConfig.get(URL.weather, { lat, lon, units: 'metric' })

export const getCityList = (query: string): Promise<Types.IApi.CityList.Response> => axiosConfig.get(URL.cityList, { q: query, limit: 5 })