<script setup lang="ts">
import { ref, computed } from 'vue'
import NavSubmenu from '@/components/User/Modules/DetailPaket/Widget/NavSubmenu.vue'

// Import komponen tab
import PageTransaksi from '@/components/User/Modules/DaftarTransaksiPaket/DaftarTransaksiPaket.vue'
import PageJamaah from '@/components/User/Modules/DaftarJamaahPaket/DaftarJamaahPaket.vue'

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
  jamaah: PageJamaah,
  // tambah yang lain jika perlu
}

const currentComponent = computed(() => componentMap[current.value])

console.log(currentComponent)
</script>

<template>
  <div v-if="props.isPageDetailPaketOpen">
    <NavSubmenu
      @close="emit('close')"
      @update:current="(val : any) => current = val"
    />

    <component
      :is="currentComponent"
      :paket-id="props.paketId"
    />
  </div>
</template>
