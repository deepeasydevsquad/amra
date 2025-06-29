<script setup lang="ts">
  import { ref, computed } from 'vue'
  import NavSubmenu from '@/components/User/Modules/DetailPaket/Widget/NavSubmenu.vue'

  // Import komponen tab
  import PageTransaksi from '@/components/User/Modules/DaftarTransaksiPaket/DaftarTransaksiPaket.vue'
  import PageJamaah from '@/components/User/Modules/DaftarJamaahPaket/DaftarJamaahPaket.vue'
  import PageKamar from '@/components/User/Modules/KamarPaket/KamarPaket.vue'
  import PaketAgen from '@/components/User/Modules/PaketAgen/PaketAgen.vue'
  import PageBus from '@/components/User/Modules/BusPaket/BusPaket.vue'
  import PageManifest from '@/components/User/Modules/ManifestPaket/ManifestPaket.vue'
  import pageSyarat from '@/components/User/Modules/SyaratPaket/SyaratPaket.vue'

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
    agen: PaketAgen,
    kamar: PageKamar,
    bus: PageBus,
    manifes: PageManifest,
    syarat: pageSyarat,
    // tambah yang lain jika perlu
  }

  const currentComponent = computed(() => componentMap[current.value])

  console.log(currentComponent)
</script>

<template>
  <div v-if="props.isPageDetailPaketOpen">
    <NavSubmenu @close="emit('close')"  @update:current="(val : any) => current = val" />
    <component :is="currentComponent" :paket-id="props.paketId" />
  </div>
</template>
