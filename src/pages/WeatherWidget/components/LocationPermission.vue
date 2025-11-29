<script setup lang="ts">
// props
defineProps<{
  blocked?: boolean
}>()

// emits
const emit = defineEmits<{
  accept: []
  decline: []
  manual: []
  retry: []
}>()

</script>

<template>
  <div class="location-prompt">
    <div class="prompt-content">
      <!-- Normal state: Ask for permission -->
      <template v-if="!blocked">
        <div class="prompt-icon">📍</div>
        <h3>Enable Location?</h3>
        <p>Allow us to detect your location and show weather for your city automatically.</p>
        
        <div class="prompt-actions">
          <button class="btn-secondary" @click="emit('decline')">
            No, Thanks
          </button>
          <button class="btn-primary" @click="emit('accept')">
            Yes, Allow
          </button>
        </div>
        
        <button class="link-btn" @click="emit('manual')">
          Or add city manually
        </button>
      </template>

      <!-- Blocked state: Permission denied -->
      <template v-else>
        <div class="prompt-icon">🚫</div>
        <h3>Location Access Blocked</h3>
        <p>You've blocked location access. To use this feature, please enable location permission in your browser.</p>

        <div class="prompt-actions">
          <button class="btn-secondary" @click="emit('manual')">
            Add City Manually
          </button>
          <button class="btn-primary" @click="emit('retry')">
            Try Again
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.location-prompt {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 8px;
  z-index: 100;
}

.prompt-content {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.prompt-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.prompt-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.prompt-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.prompt-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #4a90e2;
  color: white;
  
  &:hover {
    background: #357abd;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  
  &:hover {
    background: #e9e9e9;
  }
}

.link-btn {
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #357abd;
  }
}
</style>

