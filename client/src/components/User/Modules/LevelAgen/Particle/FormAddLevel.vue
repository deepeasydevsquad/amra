<template>
  <!-- Modal -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
      <!-- Header Modal -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-700">Tambah Level Keagenan</h2>
      </div>

      <!-- Body Modal -->
      <div class="p-6">
        <!-- Nama Level Keagenan -->
        <div class="mb-4">
          <label for="namaLevel" class="block text-sm font-medium text-gray-700 mb-2">
            Nama Level Keagenan
          </label>
          <input
            id="namaLevel"
            v-model="namaLevel"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder="Nama Level Keagenan"
          />
        </div>

        <!-- Level & Default Fee Keagenan -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label for="level" class="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <input
              id="level"
              v-model="level"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-100"
              readonly
            />
          </div>
          <div class="flex-1">
            <label for="defaultFee" class="block text-sm font-medium text-gray-700 mb-2">
              Default Fee Keagenan
            </label>
            <input
              id="defaultFee"
              v-model="defaultFee"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              placeholder="Default Fee Keagenan"
            />
          </div>
        </div>
      </div>

      <!-- Footer Modal -->
      <div class="p-6 border-t border-gray-200 flex justify-end gap-4">
        <button
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import { daftarAgen, addAgen } from '../../../../../service/level_agen'

// Modal State
const isModalOpen = ref(true)
const namaLevel = ref('')
const level = ref('')
const defaultFee = ref('')

// Data agen
const agenData = ref([])

// Fungsi untuk cari level kosong atau level terakhir
const getNextLevel = (levels) => {
  // Ambil semua angka level yang ada
  const sortedLevels = levels.map((l) => l.level).sort((a, b) => a - b)

  // Cek apakah ada level kosong
  for (let i = 1; i <= sortedLevels.length; i++) {
    if (!sortedLevels.includes(i)) {
      return i // Kembalikan level kosong pertama
    }
  }

  // Kalau tidak ada yang kosong, ambil level terakhir + 1
  return sortedLevels.length + 1
}

// Fetch data level agen
const fetchAgen = async () => {
  try {
    const response = await daftarAgen()
    agenData.value = response.data
    console.log('Data agen:', agenData.value)

    // Set level otomatis di form
    level.value = getNextLevel(agenData.value)
  } catch (error) {
    console.log('Error fetch agen:', error)
  }
}

// Panggil fetchAgen saat modal muncul
onMounted(() => {
  fetchAgen()
})

// Emit event modal
const emit = defineEmits(['update:isModalOpen'])

const closeModal = () => {
  emit('update:isModalOpen', false)
}

const handleSubmit = async () => {
  if (!namaLevel.value.trim()) {
    alert('Nama level tidak boleh kosong')
    return
  }

  try {
    const response = await addAgen({
      nama: namaLevel.value.trim(),
      level: Number(level.value),
      default_fee: defaultFee.value,
    })

    console.log('Response:', response.data)
    emit('level-added')
    closeModal()
  } catch (error) {
    console.error('Error detail:', {
      message: error.message,
      response: error.response?.data,
      config: error.config,
    })
    alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message))
  }
}
</script>
