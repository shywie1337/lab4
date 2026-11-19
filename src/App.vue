<script setup lang="ts">
import CharacterPanel from './components/CharacterPanel.vue'
import MachinePanel from './components/MachinePanel.vue'
import SessionsPanel from './components/SessionsPanel.vue'
import ToastMessages from './components/ToastMessages.vue'
import { useGreed } from './composables/useGreed'

const {
  characters, state, busy, charactersError, needsRefresh, shaking,
  sessions, createSession, connect, selectCharacter, donate, bomb, reset, refresh,
} = useGreed()
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content">
    <ToastMessages />
    <header class="border-b border-base-300 bg-base-100">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5">
        <h1 class="text-2xl font-semibold">Greed Machine</h1>
        <button type="button" class="btn btn-ghost btn-sm rounded-sm" :disabled="busy" @click="refresh">Оновити дані</button>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-3 py-6 sm:px-4">
      <p v-if="charactersError" role="alert" class="alert alert-error mb-5 rounded-sm">Не вдалося завантажити персонажів. Натисніть «Оновити дані».</p>
      <p v-if="needsRefresh && !busy" role="alert" class="alert alert-warning mb-5 rounded-sm">Стан не підтверджено сервером. Оновіть дані перед наступною дією.</p>
      <div class="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,1.3fr)_minmax(0,1fr)]">
        <CharacterPanel
          :characters="characters"
          :current-character-id="state?.character.id ?? ''"
          :busy="busy"
          :has-session="!!state"
          :needs-refresh="needsRefresh"
          @create="createSession"
          @select="selectCharacter"
          @connect="connect"
        />
        <MachinePanel :state="state" :busy="busy" :needs-refresh="needsRefresh" :shaking="shaking" @donate="donate" @bomb="bomb" @reset="reset" />
        <SessionsPanel :sessions="sessions.sessions" :active-session-id="sessions.activeSessionId" :busy="busy" @connect="connect" />
      </div>
    </main>
  </div>
</template>
