<!-- components/User/Modules/DaftarPaket/Widget/NavSubmenu.vue -->
<script lang="ts" setup>
import { defineEmits, ref, watch } from 'vue'
import BackButton from '@/components/User/Modules/DetailPaket/Particle/BackButton.vue'
import SubmenuItem from '@/components/User/Modules/DetailPaket/Particle/SubmenuItem.vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:current', value: string): void
}>()

const current = ref('transaksi')

const items = [
  { label: 'Transaksi', icon: 'transaksi', value: 'transaksi' },
  { label: 'Jamaah', icon: 'jamaah', value: 'jamaah' },
  { label: 'Manifes', icon: 'manifes', value: 'manifes' },
  { label: 'Syarat', icon: 'syarat', value: 'syarat' },
  { label: 'Kamar', icon: 'kamar', value: 'kamar' },
  { label: 'Bus', icon: 'bus', value: 'bus' },
  { label: 'Agen', icon: 'agen', value: 'agen' },
  { label: 'K&T', icon: 'k&t', value: 'k&t' },
]

watch(current, (val) => {
  emit('update:current', val)
})
</script>

<template>
  <nav class="ml-4 mr-4 flex divide-x border rounded-md overflow-hidden shadow-sm">
    <BackButton @click="emit('close')" />
    <SubmenuItem
      v-for="item in items"
      :key="item.value"
      :label="item.label"
      :icon="item.icon"
      :active="current === item.value"
      @click="current = item.value"
    />
  </nav>
</template>
