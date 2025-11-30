// types
import * as Types from '@/modules/WeatherWidget/types'
// constants
import { STORAGE_KEY } from '@/constants'

export function useStorage() {
  function saveConfig(cities: Types.IEntity.City[]): void {
    const data: Types.StorageType = {
      cities 
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

 function loadConfig(): Types.StorageType | null {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }

  function clearConfig(): void {
    localStorage.removeItem(STORAGE_KEY)
  }

    return { 
        saveConfig,
        loadConfig,
        clearConfig
    }
}