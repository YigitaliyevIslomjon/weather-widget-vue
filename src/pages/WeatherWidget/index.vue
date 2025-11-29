<script setup lang="ts">
// core
import { ref, onMounted, watch } from 'vue'
// components
import { WeatherCard, SettingsModal, LocationPermission } from './components'
// services
import { getWeatherByCity, getWeatherByCoords, getCurrentLocation } from '@/modules/WeatherWidget/services'
import { saveConfig, loadConfig } from '@/services/storage.service'    
// types
import * as Types from '@/modules/WeatherWidget/types'

// reactives
const showSettings = ref(false)
const cities = ref<Types.IEntity.City[]>([])  
const weatherList = ref<Types.IEntity.Weather[]>([])
const loading = ref(false)
const error = ref('')
const showLocationPrompt = ref(false)
const locationBlocked = ref(false)

// Load config from localStorage
onMounted(async () => {
  const config = loadConfig()
  
  if (config) {
    cities.value = config.cities || []
  }
  
  // If no cities configured, ask user for location permission
  if (cities.value.length === 0) {
    showLocationPrompt.value = true
  } else {
    // Load weather for existing cities
    await loadWeather()
  }
})

// Request user location
async function requestLocation() {
  loading.value = true
  error.value = ''
  locationBlocked.value = false
  showLocationPrompt.value = false
  
  try {
    console.log('🌍 Requesting location...')
    const location = await getCurrentLocation()
    const weather = await getWeatherByCoords(location.lat, location.lon)
    
    const currentCity: Types.IEntity.City = {
      id: weather.cityId,
      name: weather.cityName,
      country: weather.country,
      lat: location.lat,
      lon: location.lon
    }

    cities.value = [currentCity]
    saveConfig(cities.value)
    await loadWeather()
    
    console.log('✅ Successfully set location:', currentCity.name)
  } catch (err) {
    console.error('❌ Location request failed:', err)
    
    const errorMessage = err instanceof Error ? err.message : String(err)
    
    if (errorMessage.includes('denied') || errorMessage.includes('Permission')) {
      // Show blocked state in LocationPermission
      locationBlocked.value = true
      showLocationPrompt.value = true
    } else if (errorMessage.includes('unavailable')) {
      error.value = 'Location unavailable. Please add cities manually.'
    } else if (errorMessage.includes('timeout')) {
      error.value = 'Location request timed out. Please try again.'
    } else {
      error.value = 'Failed to get your location. Please add cities manually.'
    }
  } finally {
    loading.value = false
  }
}

// Retry location request
function retryLocation() {
  locationBlocked.value = false
  requestLocation()
}

// Decline location request
function declineLocation() {
  showLocationPrompt.value = false
  console.log('🚫 User declined location request')
  // Just show empty state with "add city" button
}

// Watch cities and reload weather
watch(cities, async () => {
  await loadWeather()
}, { deep: true })

async function loadWeather() {
  if (cities.value.length === 0) {
    weatherList.value = []
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const promises = cities.value.map((city: Types.IEntity.City) => getWeatherByCity(city))
    weatherList.value = await Promise.all(promises)
  } catch (err) {
    error.value = 'Failed to load weather data. Check your API key.'
    weatherList.value = []
  } finally {
    loading.value = false
  }
}

function handleUpdateCities(newCities: Types.IEntity.City[]) {
  cities.value = newCities
  saveConfig(cities.value)
}

</script>

<template>
  <div class="weather-widget">
    <!-- Weather Cards -->
    <div v-if="!showSettings" class="weather-cards">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <span>Loading weather data...</span>
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button class="settings-link" @click="showSettings = true">Open Settings</button>
      </div>
      <div v-else-if="weatherList.length === 0" class="empty">
        <p>No cities added.</p>
        <button class="add-city-btn" @click="showSettings = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          Open Settings
        </button>
      </div>
      <WeatherCard 
        v-for="(weather, index) in weatherList"
        :key="weather.cityId"
        :weather="weather"
        :show-settings-btn="index === 0"
        @open-settings="showSettings = true"
      />
    </div>

    <!-- Location Permission Prompt -->
    <LocationPermission
      v-if="showLocationPrompt"
      :blocked="locationBlocked"
      @accept="requestLocation"
      @decline="declineLocation"
      @manual="showLocationPrompt = false; showSettings = true"
      @retry="retryLocation"
    />

    <!-- Settings Modal -->
    <SettingsModal
      v-if="showSettings"
      :cities="cities"
      @close="showSettings = false"
      @update:cities="handleUpdateCities"
    />
  </div>
</template>

<style scoped lang="scss">
.weather-widget {
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
  max-width: 500px;
}

.weather-cards {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e0e0e0;
  border-top-color: #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 40px 20px;
  color: #dc3545;
  font-size: 14px;
}

.empty {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
  
  p {
    margin-bottom: 16px;
  }
}

.add-city-btn,
.settings-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #4a90e2;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #357abd;
  }
  
  svg {
    stroke: #fff;
  }
}

.settings-link {
  margin-top: 8px;
}
</style>

