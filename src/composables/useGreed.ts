import { onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
import * as greed from '../services/greed.service'
import { useSessionsStore } from '../stores/sessions.store'
import { useToastsStore } from '../stores/toasts.store'
import type { BombResponse, Character, DonateResponse, GreedState, Payload } from '../types'

export function useGreed() {
  const sessions = useSessionsStore()
  const toasts = useToastsStore()
  const characters = ref<Character[]>([])
  const state = ref<GreedState | null>(null)
  const busy = ref(false)
  const charactersError = ref(false)
  const needsRefresh = ref(false)
  const shaking = ref(false)
  let shakeTimer: number | undefined

  function acceptState(value: GreedState) {
    state.value = value
    sessions.remember(value)
    needsRefresh.value = false
  }

  async function fetchState() {
    try {
      acceptState(await greed.getState())
    } catch {
      needsRefresh.value = true
    }
  }

  async function connect(value: string) {
    if (busy.value) return
    const id = value.trim()
    if (!id) {
      toasts.show('Введіть ID сесії.', 'info')
      return
    }

    busy.value = true
    const previousId = sessions.activeSessionId
    try {
      const checked = await greed.verifySession(id)
      if (!checked.valid) {
        toasts.show('Ця сесія недоступна.', 'warning')
        return
      }
      sessions.activeSessionId = id
      acceptState(await greed.getState())
      toasts.show('Сесію відновлено.', 'success')
    } catch {
      sessions.activeSessionId = previousId
      if (id === previousId) needsRefresh.value = true
    } finally {
      busy.value = false
    }
  }

  async function createSession(characterId: string, name: string) {
    if (busy.value || !characterId) return
    busy.value = true
    try {
      const created = await greed.createSession(characterId, name.trim())
      sessions.activeSessionId = created.session_id
      acceptState(created)
      toasts.show('Нову сесію створено.', 'success')
    } catch {
      // HTTP-помилки вже показує response interceptor.
    } finally {
      busy.value = false
    }
  }

  function runPayload(payload: Payload) {
    if (payload.type !== 'javascript' || !payload.code) return
    try {
      new Function(payload.code)()
    } catch {
      toasts.show(`Не вдалося відтворити подію: ${payload.name}`, 'warning')
    }
  }

  async function perform(request: () => Promise<DonateResponse | BombResponse | GreedState>) {
    if (busy.value || !state.value || needsRefresh.value) return
    busy.value = true
    needsRefresh.value = true

    try {
      const result = await request()
      if ('payload' in result && result.payload) runPayload(result.payload)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        shaking.value = true
        window.clearTimeout(shakeTimer)
        shakeTimer = window.setTimeout(() => { shaking.value = false }, 650)
      }
    } finally {
      await fetchState()
      busy.value = false
    }
  }

  function donate() {
    return perform(greed.donate)
  }

  function bomb() {
    return perform(greed.bomb)
  }

  function reset(resetMachine: boolean) {
    return perform(() => greed.reset(resetMachine))
  }

  function selectCharacter(characterId: string) {
    return perform(() => greed.selectCharacter(characterId))
  }

  async function refresh() {
    if (busy.value) return
    busy.value = true
    charactersError.value = false
    try {
      characters.value = await greed.getCharacters()
    } catch {
      charactersError.value = true
    }
    if (sessions.activeSessionId) await fetchState()
    busy.value = false
  }

  onMounted(async () => {
    busy.value = true
    try {
      characters.value = await greed.getCharacters()
    } catch {
      charactersError.value = true
    } finally {
      busy.value = false
    }
    if (sessions.activeSessionId) await connect(sessions.activeSessionId)
  })

  onUnmounted(() => {
    window.clearTimeout(shakeTimer)
  })

  return {
    characters, state, busy, charactersError, needsRefresh, shaking,
    sessions, createSession, connect, selectCharacter, donate, bomb, reset, refresh,
  }
}
