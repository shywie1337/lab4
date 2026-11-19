<script setup lang="ts">
import type { SavedSession } from '../types'

const props = defineProps<{
  sessions: SavedSession[]
  activeSessionId: string
  busy: boolean
}>()
const emit = defineEmits<{ (event: 'connect', id: string): void }>()

function choose(event: Event) {
  const select = event.target as HTMLSelectElement
  const id = select.value
  select.value = props.activeSessionId
  if (id) emit('connect', id)
}
</script>

<template>
  <section class="card rounded-sm border border-base-300 bg-base-100">
    <div class="card-body gap-4 p-4 sm:p-5">
      <h2 class="card-title text-lg">Збережені сесії</h2>
      <label class="grid gap-2 text-sm">Відновити забіг
        <select :value="activeSessionId" class="select w-full rounded-sm" :disabled="busy || !sessions.length" @change="choose">
          <option value="">Оберіть сесію</option>
          <option v-for="session in sessions" :key="session.id" :value="session.id">{{ session.name }} · {{ session.lastCharacter }}</option>
        </select>
      </label>
      <p v-if="!sessions.length" class="text-sm text-base-content/65">Після створення забігу він з’явиться у цьому списку.</p>
      <ul v-else class="space-y-2">
        <li v-for="session in sessions" :key="session.id">
          <button
            type="button"
            class="w-full rounded-sm border border-base-300 p-3 text-left text-sm hover:bg-base-200"
            :class="{ 'border-primary bg-base-200': session.id === activeSessionId }"
            :disabled="busy"
            :aria-current="session.id === activeSessionId ? 'true' : undefined"
            @click="emit('connect', session.id)"
          >
            <span class="block break-words font-medium">{{ session.name }}</span>
            <span class="mt-1 block text-xs text-base-content/65">{{ session.lastCharacter }}</span>
          </button>
        </li>
      </ul>
      <label v-if="activeSessionId" class="grid gap-2 border-t border-base-300 pt-4 text-sm">Активна сесія
        <input :value="activeSessionId" readonly class="input w-full rounded-sm font-mono text-xs" />
      </label>
    </div>
  </section>
</template>
