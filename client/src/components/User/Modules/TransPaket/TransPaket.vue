<script setup lang="ts">
import { ref, computed } from 'vue'
import NavSubmenu from '@/components/User/Modules/TransPaket/Widget/NavSubmenu.vue'

// Import komponen tab
import PageDaftarPaket from '@/components/User/Modules/TransPaket/widget/PageDaftarPaket.vue'
import PageDaftarJamaah from '@/components/User/Modules/TransPaket/widget/PageDaftarJamaah.vue'
import PagePembayaranPaket from '@/components/User/Modules/TransPaket/Widget/PagePembayaranPaket.vue'
import PagePembayaranPaketAgen from '@/components/User/Modules/TransPaket/Widget/PagePembayaranPaketAgen.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const current = ref('daftar_paket')

const componentMap: Record<string, any> = {
  daftar_paket: PageDaftarPaket,
  daftar_jamaah: PageDaftarJamaah,
  pembayaran_paket: PagePembayaranPaket,
  pembayaran_paket_agen: PagePembayaranPaketAgen,
}

const currentComponent = computed(() => componentMap[current.value])


</script>

<template>
  <div class="pl-4 pr-4 flex flex-col h-full">
    <NavSubmenu @close="emit('close')"  @update:current="(val : any) => current = val" />
    <component :is="currentComponent" />
  </div>
</template>
