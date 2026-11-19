<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useToastsStore } from '../stores/toasts.store'

const toasts = useToastsStore()
onUnmounted(toasts.clear)
</script>

<template>
  <div class="toast toast-top toast-end z-50 max-h-[85vh] w-[min(92vw,26rem)] overflow-y-auto" aria-live="polite">
    <div
      v-for="message in toasts.messages"
      :key="message.id"
      role="status"
      class="alert flex items-start rounded-sm text-sm"
      :class="{
        'alert-success': message.kind === 'success',
        'alert-warning': message.kind === 'warning',
        'alert-error': message.kind === 'error',
        'alert-info': message.kind === 'info',
      }"
    >
      <span class="min-w-0 flex-1 break-words">{{ message.text }}</span>
      <button type="button" class="btn btn-ghost btn-xs" aria-label="Закрити повідомлення" @click="toasts.remove(message.id)">×</button>
    </div>
  </div>
</template>
