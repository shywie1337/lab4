import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { GreedState, SavedSession } from '../types'
import { useToastsStore } from './toasts.store'

const STORAGE_KEY = 'greed-sessions'

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref<SavedSession[]>([])
  const activeSessionId = ref('')
  const toasts = useToastsStore()

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as { sessions: SavedSession[]; activeSessionId: string }
      if (Array.isArray(saved.sessions) && saved.sessions.every((session) => {
        return session && typeof session.id === 'string' && typeof session.name === 'string'
          && typeof session.lastCharacter === 'string'
      })) {
        sessions.value = saved.sessions
        if (typeof saved.activeSessionId === 'string') activeSessionId.value = saved.activeSessionId
      }
    }
  } catch {
    toasts.show('Не вдалося прочитати збережені сесії.', 'warning')
  }

  watch([sessions, activeSessionId], () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        sessions: sessions.value,
        activeSessionId: activeSessionId.value,
      }))
    } catch {
      toasts.show('Браузер не дозволив зберегти список сесій.', 'warning')
    }
  }, { deep: true })

  function remember(state: GreedState) {
    const session = sessions.value.find((item) => item.id === state.session_id)
    if (session) {
      session.name = state.name
      session.lastCharacter = state.character.name
    } else {
      sessions.value.push({ id: state.session_id, name: state.name, lastCharacter: state.character.name })
    }
  }

  return { sessions, activeSessionId, remember }
})
