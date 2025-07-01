<!-- components/User/Modules/DaftarPaket/Widget/NavSubmenu.vue -->
<script lang="ts" setup>
import { defineEmits, ref, watch } from 'vue'
import BackButton from '@/components/User/Modules/TransPaket/Particle/BackButton.vue'
import SubmenuItem from '@/components/User/Modules/TransPaket/Particle/SubmenuItem.vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:current', value: string): void
}>()

const current = ref('daftar_paket')

const items = [
  { label: 'Daftar Paket', icon: 'box-open', value: 'daftar_paket' },
  { label: 'Daftar Jamaah', icon: 'users', value: 'daftar_jamaah' },
  { label: 'Pembayaran Paket', icon: 'money-bill', value: 'pembayaran_paket' },
  { label: 'Pembayaran Paket Agen', icon: 'user-check', value: 'pembayaran_paket_agen' },
]

watch(current, (val) => {
  console.log('Current value changed:', val)
  emit('update:current', val)
})
</script>

<template>
  <nav class="flex divide-x border-t border-b rounded-t-md overflow-hidden shadow-sm">
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
