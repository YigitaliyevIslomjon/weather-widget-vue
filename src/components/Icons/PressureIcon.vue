<template>
    <svg 
    :width="width" 
    :height="height" 
    viewBox="0 0 24 24" 
    fill="none" 
    :stroke="color"
    :stroke-width="strokeWidth"
  >
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
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
  
  