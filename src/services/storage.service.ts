// types
import type { StorageType } from '@/types'
import * as Types from '@/modules/WeatherWidget/types'
// constants
import { STORAGE_KEY } from '@/constants'

export function saveConfig(cities: Types.IEntity.City[]): void {
  const data: StorageType = {
    cities 
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function loadConfig(): StorageType | null {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return null
  
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function clearConfig(): void {
  localStorage.removeItem(STORAGE_KEY)
}

