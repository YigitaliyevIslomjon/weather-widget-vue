<script setup lang="ts">
// core
import { ref, watch } from 'vue'
import { useDebounceFn }  from '@vueuse/core'
// components
import { BaseIcon } from '@/components/UI'
// services
import { searchCity } from '@/modules/WeatherWidget/services'
// types
import * as Types from '@/modules/WeatherWidget/types'
// props
const props = defineProps<{
  cities: Types.IEntity.City[]
}>()

// emits
const emit = defineEmits<{
  close: []
  'update:cities': [cities: Types.IEntity.City[]]
}>()

// reacives
const localCities = ref<Types.IEntity.City[]>([...props.cities])
const searchQuery = ref('')
const searchResults = ref<Types.IEntity.City[]>([])
const searching = ref(false)
const dragIndex = ref<number | null>(null)

// Watch props
watch(() => props.cities, (newCities) => {
  localCities.value = [...newCities]
}, { deep: true })


// methods
const handleSearch = useDebounceFn(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  searching.value = true
  try {
    searchResults.value = await searchCity(searchQuery.value)
  } catch (err) {
    searchResults.value = []
  } finally {
    searching.value = false
  }
}, 500)


function addCity(city: Types.IEntity.City) {
  // Check if already exists
  if (localCities.value.some(c => c.id === city.id)) {
    return
  }
  
  localCities.value.push(city)
  emit('update:cities', localCities.value)
  
  // Clear search
  searchQuery.value = ''
  searchResults.value = []
}

function handleAddFirst() {
  if (searchResults.value.length > 0) {
    addCity(searchResults.value[0])
  }
}

function removeCity(index: number) {
  localCities.value.splice(index, 1)
  emit('update:cities', localCities.value)
}

// Drag & Drop
function handleDragStart(index: number, event: DragEvent) {
  dragIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

function handleDragOver(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) return
  
  const items = [...localCities.value]
  const draggedItem = items[dragIndex.value]
  
  // Remove from old position
  items.splice(dragIndex.value, 1)
  
  // Insert at new position
  items.splice(index, 0, draggedItem)
  
  localCities.value = items
  dragIndex.value = index
}

function handleDrop(_index: number) {
  emit('update:cities', localCities.value)
}

function handleDragEnd() {
  dragIndex.value = null
}
</script>

<template>
  <div class="settings-modal">
    <div class="modal-header">
      <h2>Settings</h2>
      <button class="close-btn" @click="emit('close')" aria-label="Close">
        <BaseIcon name="close" />
      </button>
    </div>
    <!-- Cities List -->
    <div class="cities-list">
      <div
        v-for="(city, index) in localCities"
        :key="city.id"
        class="city-item"
        :class="{ dragging: dragIndex === index }"
        draggable="true"
        @dragstart="handleDragStart(index, $event)"
        @dragover.prevent="handleDragOver(index)"
        @drop="handleDrop(index)"
        @dragend="handleDragEnd"
      >
        <div class="drag-handle">
          <BaseIcon name="drag" />
        </div>
        <span class="city-name">{{ city.name }}, {{ city.country }}</span>
        <button class="delete-btn" @click="removeCity(index)" aria-label="Delete">
          <BaseIcon name="trash" />
        </button>
      </div>
    </div>

    <!-- Add Location -->
    <div class="add-location">
      <h3>Add Location</h3>
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Enter city name..."
          @input="handleSearch"
          @keyup.enter="handleAddFirst"
        />
        <div v-if="searching" class="search-results loading">Searching...</div>
        <div v-else-if="searchResults.length > 0" class="search-results">
          <div
            v-for="result in searchResults"
            :key="result.id"
            class="search-result-item"
            @click="addCity(result)"
          >
            {{ result.name }}, {{ result.country }}
          </div>
        </div>
        <div v-else-if="searchQuery && !searching" class="search-results empty">
          No results found
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.settings-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-height: 600px;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
  
  svg {
    stroke: #666;
    stroke-width: 2;
  }
}

.cities-list {
  margin-bottom: 24px;
}

.city-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: move;
  transition: all 0.2s;
  
  &:hover {
    background: #e9e9e9;
  }
  
  &.dragging {
    opacity: 0.5;
  }
}

.drag-handle {
  display: flex;
  align-items: center;
  cursor: grab;
  
  svg {
    stroke: #999;
    stroke-width: 2;
  }
  
  &:active {
    cursor: grabbing;
  }
}

.city-name {
  flex: 1;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: #fee;
    
    svg {
      stroke: #dc3545;
    }
  }
  
  svg {
    stroke: #999;
    stroke-width: 2;
  }
}

.add-location {
  margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }
}

.search-box {
  position: relative;
  
  input {
    box-sizing: border-box;
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    
    &:focus {
      border-color: #4a90e2;
    }
  }
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  
  &.loading,
  &.empty {
    padding: 12px;
    text-align: center;
    color: #999;
    font-size: 13px;
  }
}

.search-result-item {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
}

.api-key-section {
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }
  
  input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    margin-bottom: 8px;
    transition: border-color 0.2s;
    
    &:focus {
      border-color: #4a90e2;
    }
  }
}

.help-text {
  font-size: 12px;
  color: #999;
  
  a {
    color: #4a90e2;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

