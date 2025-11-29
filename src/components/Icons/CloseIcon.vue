<template>
  <svg 
    :width="width" 
    :height="height" 
    viewBox="0 0 24 24" 
    fill="none" 
    :stroke="color"
    :stroke-width="strokeWidth"
  >
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
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

