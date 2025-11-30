<script setup lang="ts">
// types
import * as Types from '@/modules/WeatherWidget/types'
// components
import { BaseIcon } from '@/components/UI'
// assets
import WeatherIcon from '@/assets/weatherIcon.webp'  

// props
defineProps<{
  weather: Types.IEntity.Weather
  showSettingsBtn?: boolean
}>()

// emits
defineEmits<{
  openSettings: []
}>()

// methods
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getWindDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(deg / 45) % 8
  return directions[index]
}

</script>

<template>
  <div class="weather-card">
    <!-- City Name -->
    <div class="city-header">
      <h2>{{ weather.cityName }}, {{ weather.country }}</h2>
      <button 
        v-if="showSettingsBtn"
        class="settings-btn"
        @click="$emit('openSettings')"
        aria-label="Settings"
      >
        <BaseIcon name="setting" />
      </button>
    </div>

    <!-- Temperature -->
    <div class="temp-section">
      <img 
        :src="WeatherIcon"
        :alt="weather.description"
        class="weather-icon"
      />
      <div class="temp">{{ weather.temp }}°C</div>
    </div>

    <!-- Description -->
    <div class="description">
      Feels like {{ weather.feelsLike }}°C. {{ capitalizeFirst(weather.description) }}
    </div>

    <!-- Weather Details -->
    <div class="details">
      <div class="detail-item">
        <BaseIcon name="wind"  />
        <span>{{ weather.windSpeed }}m/s {{ getWindDirection(weather.windDeg) }}</span>
      </div>
      
      <div class="detail-item">
        <BaseIcon name="pressure" />
        <span>{{ weather.pressure }}hPa</span>
      </div>
    </div>

    <div class="details">
      <div class="detail-item">
        <span>Humidity: {{ weather.humidity }}%</span>
      </div>
      <div class="detail-item">
        <span>Dew point: {{ weather.dewPoint }}°C</span>
      </div>
    </div>

    <div class="details">
      <div class="detail-item">
        <span>Visibility: {{ weather.visibility }}km</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-card {
  background: white;
  padding: 0;
  
  & + & {
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid #e0e0e0;
  }
}

.city-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  
  h2 {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin: 0;
  }
}

.settings-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
  
  &:hover {
    background: #f0f0f0;
    
    svg {
      transform: rotate(45deg);
    }
  }
  
  svg {
    stroke: #666;
    transition: transform 0.3s ease;
  }
}

.temp-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.weather-icon {
  width: 80px;
  height: 80px;
}

.temp {
  font-size: 48px;
  font-weight: 700;
  color: #333;
}

.description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.details {
  display: flex;
  gap: 24px;
  margin-bottom: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  
  svg {
    stroke: #999;
    stroke-width: 2;
  }
}
</style>

