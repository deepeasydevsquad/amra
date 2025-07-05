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
  <div class="inline-flex rounded-md shadow-xs mb-5" role="group">
      <button   @click="emit('close')"  type="button"
        class="px-4 py-2 text-sm font-medium bg-white border-t border-b border-s border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mx-0 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <template v-for="item in items" :key="item.value">
        <button  @click="current = item.value" v-if="item.value == 'k&t'" type="button"  :class="current === item.value ? 'z-10 ring-2 text-blue-700 ring-blue-700 bg-gray-200 shadow-md font-semibold' : 'text-gray-700 hover:bg-gray-100'" class="px-4 py-2 w-30 text-sm font-medium bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
          <font-awesome-icon :icon="['fas', item.icon]" :class="current === item.value ? 'text-blue-700 ring-blue-700 font-normal' : ' text-gray-600  hover:bg-gray-100'"  class="w-4 h-4 me-1 hover:text-blue-700 focus:text-blue-700" />
          <span>{{ item.label }}</span>
        </button>
        <button  @click="current = item.value" v-else type="button" :class="current === item.value ? 'z-10 ring-2 text-blue-700 ring-blue-700 bg-gray-200 shadow-md  font-semibold' : 'text-gray-700 hover:bg-gray-100'" class="px-4 py-2 w-30 text-sm font-medium bg-white border-t border-b border-s border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
          <font-awesome-icon :icon="['fas', item.icon]" :class="current === item.value ? 'text-blue-700 ring-blue-700 font-normal' : ' text-gray-600  hover:bg-gray-100'"  class="w-4 h-4 me-1 hover:text-blue-700 focus:text-blue-700" />
          <span>{{ item.label }}</span>
        </button>
      </template>
    </div>
</template>
