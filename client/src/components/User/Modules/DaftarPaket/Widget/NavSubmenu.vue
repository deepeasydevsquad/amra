<template>
  <nav class="flex divide-x border rounded-md overflow-hidden shadow-sm">
    <BackButton @click="$emit('close')" />
    <SubmenuItem label="Transaksi" icon="transaksi" :active="current === 'transaksi'" @click="current = 'transaksi'" />
    <SubmenuItem label="Jamaah" icon="jamaah" :active="current === 'jamaah'" @click="current = 'jamaah'" />
    <SubmenuItem label="Manifes" icon="manifes" :active="current === 'manifes'" @click="current = 'manifes'" />
    <SubmenuItem label="Syarat" icon="syarat" :active="current === 'syarat'" @click="current = 'syarat'" />
    <SubmenuItem label="Kamar" icon="kamar" :active="current === 'kamar'" @click="current = 'kamar'" />
    <SubmenuItem label="Bus" icon="bus" :active="current === 'bus'" @click="current = 'bus'" />
    <SubmenuItem label="Agen" icon="agen" :active="current === 'agen'" @click="current = 'agen'" />
    <SubmenuItem label="K&T" icon="k&t" :active="current === 'k&t'" @click="current = 'k&t'" />
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BackButton from '@/components/User/Modules/DaftarPaket/Particle/BackButton.vue'
import SubmenuItem from '@/components/User/Modules/DaftarPaket/Particle/SubmenuItem.vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  current: {
    type: String,
    default: 'transaksi',
  },
})

const current = ref(props.current)

// Define props untuk komponen ini
const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

