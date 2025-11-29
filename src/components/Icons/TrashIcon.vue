<template>
  <svg 
    :width="width" 
    :height="height" 
    viewBox="0 0 24 24" 
    fill="none" 
    :stroke="color"
    :stroke-width="strokeWidth"
  >
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: number
    height?: number
    color?: string
    strokeWidth?: number
  }>(),
  {
    width: 20,
    height: 20,
    color: 'currentColor',
    strokeWidth: 2
  }
)
</script>

