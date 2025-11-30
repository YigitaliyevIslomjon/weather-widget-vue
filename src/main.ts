import { defineCustomElement } from 'vue'
// styles
import './style.scss'
// components
import { WeatherWidget } from '@/pages/WeatherWidget'

// Define custom element
const WeatherWidgetElement = defineCustomElement(WeatherWidget)

// Register custom element only once
if (!customElements.get('weather-widget')) {
    customElements.define('weather-widget', WeatherWidgetElement)
}
