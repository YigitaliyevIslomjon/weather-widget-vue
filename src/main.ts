import { defineCustomElement } from 'vue'
// styles
import './style.scss'
import { WeatherWidget } from '@/pages/WeatherWidget'
// components

// Define custom element
const WeatherWidgetElement = defineCustomElement(WeatherWidget)

// Register custom element
customElements.define('weather-widget', WeatherWidgetElement)

