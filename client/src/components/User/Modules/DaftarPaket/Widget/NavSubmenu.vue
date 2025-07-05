<template>
    <!-- --- PERUBAHAN --- -->
    <!-- BackButton dihapus dari sini karena sudah dipindah ke layout DetailPaket.vue -->

    <!-- @click sekarang mengirimkan event 'update:current' ke parent component -->
    <!-- <nav class="flex divide-x border rounded-md overflow-hidden shadow-sm">

      <SubmenuItem label="Transaksi" icon="transaksi" :active="current === 'transaksi'" @click="$emit('update:current', 'transaksi')" />
      <SubmenuItem label="Jamaah" icon="jamaah" :active="current === 'jamaah'" @click="$emit('update:current', 'jamaah')" />
      <SubmenuItem label="Manifes" icon="manifes" :active="current === 'manifes'" @click="$emit('update:current', 'manifes')" />
      <SubmenuItem label="Syarat" icon="syarat" :active="current === 'syarat'" @click="$emit('update:current', 'syarat')" />
      <SubmenuItem label="Kamar" icon="kamar" :active="current === 'kamar'" @click="$emit('update:current', 'kamar')" />
      <SubmenuItem label="Bus" icon="bus" :active="current === 'bus'" @click="$emit('update:current', 'bus')" />
      <SubmenuItem label="Agen" icon="agen" :active="current === 'agen'" @click="$emit('update:current', 'agen')" />
      <SubmenuItem label="K&T" icon="k&t" :active="current === 'k&t'" @click="$emit('update:current', 'k&t')" />
    </nav> -->

    <div class="inline-flex rounded-md shadow-xs mb-5" role="group">
      <!-- <template v-for="item in items" :key="item.value"> -->
      <button   @click="$emit('update:current', 'transaksi')"  type="button" :class="current === 'transaksi' ? 'shadow-md z-10 ring-2 text-blue-700 ring-blue-700 bg-gray-200 font-semibold' : 'text-gray-700 hover:bg-gray-100'"
        class="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
          <!-- <font-awesome-icon :icon="['fas', item.icon]" :class="current === 'transaksi' ? 'text-blue-700 ring-blue-700 font-normal' : ' text-gray-600  hover:bg-gray-100'"  class="w-4 h-4 me-1 hover:text-blue-700 focus:text-blue-700" /> -->
          <span>Transaksi</span>
        </button>

        <button  @click="current = item.value" v-else type="button" :class="current === item.value ? 'z-10 ring-2 text-blue-700 ring-blue-700 bg-gray-200 shadow-md  font-semibold' : 'text-gray-700 hover:bg-gray-100'" class="px-4 py-2 text-sm font-medium bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
          <font-awesome-icon :icon="['fas', item.icon]" :class="current === item.value ? 'text-blue-700 ring-blue-700 font-normal' : ' text-gray-600  hover:bg-gray-100'"  class="w-4 h-4 me-1 hover:text-blue-700 focus:text-blue-700" />
          <span>{{ item.label }}</span>
        </button>

        <button  @click="current = item.value" v-else-if="item.value == 'pembayaran_paket_agen'" type="button"  :class="current === item.value ? 'z-10 ring-2 text-blue-700 ring-blue-700 bg-gray-200 shadow-md font-semibold' : 'text-gray-700 hover:bg-gray-100'" class="px-4 py-2 text-sm font-medium  bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
          <font-awesome-icon :icon="['fas', item.icon]" :class="current === item.value ? 'text-blue-700 ring-blue-700 font-normal' : ' text-gray-600  hover:bg-gray-100'"  class="w-4 h-4 me-1 hover:text-blue-700 focus:text-blue-700" />
          <span>{{ item.label }}</span>
        </button>
      <!-- </template> -->
    </div>

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
