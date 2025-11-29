<script setup lang="ts">
// core
import { defineAsyncComponent, computed } from 'vue'

interface Props {
  name: string  
  width?: number
  height?: number
  color?: string
  strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 20,
  height: 20,
  color: 'currentColor',
  strokeWidth: 2
})


const iconComponent = computed(() => 
  defineAsyncComponent(() => 
    import(`../Icons/${capitalize(props.name)}Icon.vue`)
      .catch(() => import('../Icons/SettingIcon.vue')) // fallback icons
  )
)

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

</script>

<template>
  <component 
    :is="iconComponent"
    :width="width"
    :height="height"
    :color="color"
    :stroke-width="strokeWidth"
  />
</template>