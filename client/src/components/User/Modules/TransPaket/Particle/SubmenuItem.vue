<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  label: string
  icon: string
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    @click="emit('click')"
    class="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium max-w-[240px] text-center transition"
    :class="active ? 'bg-gray-200 text-black font-semibold' : 'text-gray-700 hover:bg-gray-100'"
  >
    <font-awesome-icon :icon="['fas', props.icon]" class="w-4 h-4 text-gray-600" />
    <span>{{ label }}</span>
  </button>
</template>

