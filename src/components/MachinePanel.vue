<script setup lang="ts">
import { computed, ref } from 'vue'
import GreedMachine from './GreedMachine.vue'
import type { GreedState } from '../types'

const props = defineProps<{
  state: GreedState | null
  busy: boolean
  needsRefresh: boolean
  shaking: boolean
}>()
const emit = defineEmits<{
  (event: 'donate'): void
  (event: 'bomb'): void
  (event: 'reset', resetMachine: boolean): void
}>()

const resetMachine = ref(false)
const digits = computed(() => String(props.state?.coins_in_machine ?? 0).padStart(3, '0').split('').map(Number))
const unavailable = computed(() => props.busy || props.needsRefresh || !props.state)

function confirmReset() {
  const message = resetMachine.value
    ? 'Скинути спробу та обнулити лічильник автомата?'
    : 'Скинути спробу? Лічильник автомата буде збережено.'

  if (window.confirm(message)) emit('reset', resetMachine.value)
}
</script>

<template>
  <section class="card rounded-sm border border-base-300 bg-base-100">
    <div class="card-body items-center gap-5 p-3 py-6 sm:p-5">
      <h2 class="card-title text-lg">Автомат</h2>
      <div role="status" aria-live="polite" :aria-label="`Монет в автоматі: ${state?.coins_in_machine ?? 0}`">
        <GreedMachine :class="{ 'machine-shake': shaking }">
          <span class="countdown" aria-hidden="true"><span :style="{ '--value': digits[0], '--digits': 1 }">{{ digits[0] }}</span></span>
          <span class="countdown" aria-hidden="true"><span :style="{ '--value': digits[1], '--digits': 1 }">{{ digits[1] }}</span></span>
          <span class="countdown" aria-hidden="true"><span :style="{ '--value': digits[2], '--digits': 1 }">{{ digits[2] }}</span></span>
        </GreedMachine>
      </div>

      <div v-if="state" class="w-full space-y-4">
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="rounded-sm bg-base-200 p-3"><span class="block text-xs text-base-content/65">Монети</span><strong class="text-2xl" data-testid="wallet">{{ state.wallet }}</strong></div>
          <div class="rounded-sm bg-base-200 p-3"><span class="block text-xs text-base-content/65">Бомби</span><strong class="text-2xl" data-testid="bombs">{{ state.bombs }}</strong></div>
        </div>
        <div class="space-y-2 text-sm">
          <p class="flex justify-between gap-2"><span>Персонаж</span><b>{{ state.character.name }}</b></p>
          <p class="flex justify-between gap-2"><span>Шанс клину</span><b data-testid="jam-chance">{{ state.jam_chance.toFixed(2) }}%</b></p>
          <p class="flex justify-between gap-2"><span>Успішні донати</span><b>{{ state.total_donations }}</b></p>
          <p v-if="state.is_jammed" role="alert" class="alert alert-warning rounded-sm text-sm">Автомат заклинило.</p>
          <p v-if="state.is_exploded" class="text-base-content/65">Автомат підривали бомбою.</p>
        </div>
        <button type="button" class="btn btn-neutral w-full rounded-sm" :disabled="unavailable || state.is_jammed || state.wallet === 0 || state.coins_in_machine >= 999" @click="emit('donate')">Кинути монету</button>
        <div class="grid grid-cols-2 gap-2">
          <button type="button" class="btn btn-outline rounded-sm" :disabled="unavailable || state.bombs === 0" @click="emit('bomb')">Підірвати</button>
          <button type="button" class="btn btn-outline rounded-sm" :disabled="unavailable" @click="confirmReset">Скинути спробу</button>
        </div>
        <label class="flex items-center gap-2 text-xs">
          <input v-model="resetMachine" type="checkbox" class="checkbox checkbox-sm rounded-sm" :disabled="unavailable" />
          При скиданні обнулити й лічильник
        </label>
      </div>
      <p v-else class="max-w-xs text-center text-sm text-base-content/65">Створіть новий забіг або підключіть збережену сесію.</p>
      <p v-if="busy" role="status" class="flex items-center gap-2 text-sm"><span class="loading loading-spinner loading-xs" />Очікуємо відповідь сервера…</p>
    </div>
  </section>
</template>
