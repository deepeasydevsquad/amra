<template>

    <nav class="flex divide-x border rounded-md overflow-hidden shadow-sm">
      <!-- --- PERUBAHAN --- -->
      <!-- BackButton dihapus dari sini karena sudah dipindah ke layout DetailPaket.vue -->

      <!-- @click sekarang mengirimkan event 'update:current' ke parent component -->
      <SubmenuItem label="Transaksi" icon="transaksi" :active="current === 'transaksi'" @click="$emit('update:current', 'transaksi')" />
      <SubmenuItem label="Jamaah" icon="jamaah" :active="current === 'jamaah'" @click="$emit('update:current', 'jamaah')" />
      <SubmenuItem label="Manifes" icon="manifes" :active="current === 'manifes'" @click="$emit('update:current', 'manifes')" />
      <SubmenuItem label="Syarat" icon="syarat" :active="current === 'syarat'" @click="$emit('update:current', 'syarat')" />
      <SubmenuItem label="Kamar" icon="kamar" :active="current === 'kamar'" @click="$emit('update:current', 'kamar')" />
      <SubmenuItem label="Bus" icon="bus" :active="current === 'bus'" @click="$emit('update:current', 'bus')" />
      <SubmenuItem label="Agen" icon="agen" :active="current === 'agen'" @click="$emit('update:current', 'agen')" />
      <SubmenuItem label="K&T" icon="k&t" :active="current === 'k&t'" @click="$emit('update:current', 'k&t')" />
    </nav>


</template>

<script lang="ts" setup>
import SubmenuItem from '@/components/User/Modules/DaftarPaket/Particle/SubmenuItem.vue'
import { defineProps, defineEmits } from 'vue'

// Props 'current' akan diterima dari parent (DetailPaket.vue)
defineProps({
  current: {
    type: String,
    required: true,
  },
})

// --- PERUBAHAN ---
// Hapus local state 'current' karena sekarang dikontrol oleh parent.
// const current = ref(props.current) -> HAPUS

// Definisikan emit agar Vue dan TypeScript tahu event apa yang bisa dikirimkan
defineEmits<{
  (e: 'update:current', value: string): void
}>()
</script>
