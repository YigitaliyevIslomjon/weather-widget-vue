<template>
  <svg 
    :width="width" 
    :height="height" 
    viewBox="0 0 24 24" 
    fill="none" 
    :stroke="color"
    :stroke-width="strokeWidth"
  >
    <polyline points="9 10 4 15 9 20"/>
    <path d="M20 4v7a4 4 0 01-4 4H4"/>
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

