<script setup lang="ts">
import { ref, computed } from 'vue'
import NavSubmenu from '@/components/User/Modules/DetailPaket/Widget/NavSubmenu.vue'

// Import komponen tab
import PageTransaksi from '@/components/User/Modules/DaftarTransaksiPaket/DaftarTransaksiPaket.vue'
import PageKamar from '@/components/User/Modules/KamarPaket/KamarPaket.vue'
import PaketAgen from '@/components/User/Modules/PaketAgen/PaketAgen.vue'

const props = defineProps<{
  isPageDetailPaketOpen: boolean
  paketId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const current = ref('transaksi')

const componentMap: Record<string, any> = {
  transaksi: PageTransaksi,
  agen: PaketAgen,
  kamar: PageKamar
}

const currentComponent = computed(() => componentMap[current.value])
</script>

<template>
  <div v-if="isPageDetailPaketOpen">
    <NavSubmenu @close="emit('close')" @update:current="(val : any) => (current = val)" />
    <component :is="currentComponent" :paket-id="paketId" />
  </div>
</template>
