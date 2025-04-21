<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
      <h2 class="text-xl font-semibold mb-6 text-center text-gray-700">Pilih Opsi Tambah Jamaah</h2>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleFromMember"
          class="flex-1 bg-black text-white py-2 px-4 rounded-xl hover:bg-gray-800 transition"
        >
          Dari Member
        </button>

        <button
          @click="handleNewJamaah"
          class="flex-1 border border-black text-black py-2 px-4 rounded-xl hover:bg-gray-100 transition"
        >
          Jamaah Baru
        </button>
      </div>

      <button @click="closeModal" class="mt-6 text-sm text-gray-500 hover:underline block mx-auto">
        Batal
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function handleFromMember() {
  showModal.value = false
  emit('pilih-member')
}

function handleNewJamaah() {
  showModal.value = false
  emit('pilih-baru')
}

const emit = defineEmits(['pilih-member', 'pilih-baru', 'close'])

defineExpose({
  openModal,
})
</script>
