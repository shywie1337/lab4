<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Character } from '../types'

const props = defineProps<{
  characters: Character[]
  currentCharacterId: string
  busy: boolean
  hasSession: boolean
  needsRefresh: boolean
}>()

const emit = defineEmits<{
  (event: 'create', characterId: string, name: string): void
  (event: 'select', characterId: string): void
  (event: 'connect', id: string): void
}>()

const selectedId = ref('')
const name = ref('')
const sessionInput = ref('')
const avatarFailed = ref(false)
const character = computed(() => props.characters.find((item) => item.id === selectedId.value))
const avatarUrl = computed(() => {
  return character.value ? new URL(character.value.avatar_url, import.meta.env.VITE_API_URL).href : ''
})

watch(() => [props.characters, props.currentCharacterId], () => {
  selectedId.value = props.currentCharacterId || props.characters[0]?.id || ''
}, { immediate: true })

watch(selectedId, () => { avatarFailed.value = false })
</script>

<template>
  <section class="card rounded-sm border border-base-300 bg-base-100">
    <div class="card-body gap-4 p-4 sm:p-5">
      <h2 class="card-title text-lg">Персонаж і забіг</h2>
      <label class="grid gap-2 text-sm">
        Персонаж
        <select v-model="selectedId" class="select w-full rounded-sm" :disabled="busy || !characters.length">
          <option value="" disabled>Оберіть персонажа</option>
          <option v-for="item in characters" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </label>
      <div v-if="character" class="space-y-3">
        <div class="flex items-center gap-4">
          <div class="flex size-16 shrink-0 items-center justify-center rounded-sm bg-base-200">
            <img v-if="!avatarFailed" :src="avatarUrl" :alt="character.name" class="size-14 object-contain [image-rendering:pixelated]" @error="avatarFailed = true" />
            <span v-else class="text-xl font-semibold">{{ character.name[0] }}</span>
          </div>
          <div>
            <h3 class="font-semibold">{{ character.name }}</h3>
            <p class="text-xs text-base-content/65">Удача: {{ character.luck }}</p>
          </div>
        </div>
        <p class="text-sm leading-relaxed">{{ character.description }}</p>
        <dl class="grid grid-cols-2 gap-2 text-sm">
          <dt class="text-base-content/65">Монети на старті</dt><dd class="text-right">{{ character.starting_coins }}</dd>
          <dt class="text-base-content/65">Бомби на старті</dt><dd class="text-right">{{ character.starting_bombs }}</dd>
          <dt class="text-base-content/65">Темп клину</dt><dd class="text-right">{{ character.jam_rate }}</dd>
          <dt class="text-base-content/65">Шанс події</dt><dd class="text-right">{{ (character.surprise_chance * 100).toFixed(0) }}%</dd>
        </dl>
        <button type="button" class="btn btn-outline btn-sm w-full rounded-sm" :disabled="busy || !hasSession || needsRefresh" @click="emit('select', selectedId)">Змінити персонажа</button>
      </div>

      <form class="grid gap-3 border-t border-base-300 pt-4" @submit.prevent="emit('create', selectedId, name)">
        <label class="grid gap-2 text-sm">Назва нового забігу
          <input v-model="name" maxlength="60" placeholder="Необов’язково" class="input w-full rounded-sm" :disabled="busy" />
        </label>
        <button type="submit" class="btn btn-neutral rounded-sm" :disabled="busy || !selectedId">Новий забіг</button>
      </form>

      <form class="grid gap-3 border-t border-base-300 pt-4" @submit.prevent="emit('connect', sessionInput)">
        <label class="grid gap-2 text-sm">ID сесії
          <input v-model="sessionInput" required maxlength="200" placeholder="greed_…" autocomplete="off" class="input w-full rounded-sm font-mono text-xs" :disabled="busy" />
        </label>
        <button type="submit" class="btn btn-outline rounded-sm" :disabled="busy || !sessionInput.trim()">Підключитися</button>
      </form>
    </div>
  </section>
</template>
