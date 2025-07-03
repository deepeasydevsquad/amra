<script setup lang="ts">
import { ref, computed } from 'vue'
import NavSubmenu from '@/components/User/Modules/TransPaket/Widget/NavSubmenu.vue'

// Import komponen tab
import PageDaftarPaket from '@/components/User/Modules/TransPaket/Widget/PageDaftarPaket.vue'
import PageDaftarJamaah from '@/components/User/Modules/TransPaket/Widget/PageDaftarJamaah.vue'
import PagePembayaranPaket from '@/components/User/Modules/TransPaket/Widget/PagePembayaranPaket.vue'
import PagePembayaranPaketAgen from '@/components/User/Modules/TransPaket/Widget/PagePembayaranPaketAgen.vue'
import DetailPaket from '@/components/User/Modules/DetailPaket/DetailPaket.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isVisible = ref(true)
const current = ref('daftar_paket')
const selectedPaketId = ref(0)

const componentMap: Record<string, any> = {
  daftar_paket: PageDaftarPaket,
  daftar_jamaah: PageDaftarJamaah,
  pembayaran_paket: PagePembayaranPaket,
  pembayaran_paket_agen: PagePembayaranPaketAgen,
  detail_paket: DetailPaket,
}

const currentComponent = computed(() => componentMap[current.value])

const handleShowDetailPaket = (paketId: number) => {
  selectedPaketId.value = paketId
  current.value = 'detail_paket'
}

const handleCloseDetailPaket = () => {
  current.value = 'daftar_paket'
}
</script>

<template>
  <div v-if="isVisible" class="pl-4 pr-4 flex flex-col h-full">
    <NavSubmenu v-if="current !== 'detail_paket'" @close="emit('close')"  @update:current="(val : any) => current = val" />
    <component :is="currentComponent" @showDetailPaket="handleShowDetailPaket" @closeDetailPaket="handleCloseDetailPaket" :paketId="selectedPaketId" />
  </div>
</template>
