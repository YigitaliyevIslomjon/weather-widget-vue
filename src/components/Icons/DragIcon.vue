<template>
  <svg 
    :width="width" 
    :height="height" 
    viewBox="0 0 24 24" 
    fill="none" 
    :stroke="color"
    :stroke-width="strokeWidth"
  >
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
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

