import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Toast, ToastKind } from '../types'

export const useToastsStore = defineStore('toasts', () => {
  const messages = ref<Toast[]>([])
  const timers: Record<number, number> = {}
  let nextId = 1

  function remove(id: number) {
    window.clearTimeout(timers[id])
    delete timers[id]
    messages.value = messages.value.filter((message) => message.id !== id)
  }

  function show(text: string, kind: ToastKind = 'info') {
    if (messages.value.length >= 3) remove(messages.value[0].id)

    const id = nextId++
    messages.value.push({ id, text, kind })
    const duration = kind === 'success' ? 2500 : kind === 'info' ? 4000 : 7000
    timers[id] = window.setTimeout(() => remove(id), duration)
  }

  function clear() {
    for (const message of messages.value) {
      window.clearTimeout(timers[message.id])
      delete timers[message.id]
    }
    messages.value = []
  }

  return { messages, show, remove, clear }
})
