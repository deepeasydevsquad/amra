<template>
  <!-- Modal -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
      <!-- Header Modal -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-700">Update Grup</h2>
      </div>

      <!-- Body Modal -->
      <div class="p-6">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Grup</label>
          <select
            v-model="selectedGrup"
            class="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null">Pilih Grup</option>
            <option v-for="grup in grups" :key="grup.id" :value="grup.id">
              {{ grup.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Footer Modal -->
      <div class="p-6 border-t border-gray-200 flex justify-end gap-4">
        <button
          @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
        >
          Batal
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue'
import { daftarGrup } from '@/service/grup'
import { editPengguna, daftarPengguna } from '@/service/pengguna'

// Interfaces
interface Grup {
  id: number
  cabang_id: number
  name: string
}

interface Pengguna {
  id: number
  grup_id: number
}

// Refs
const grups = ref<Grup[]>([])
const penggunaList = ref<Pengguna[]>([])
const selectedGrup = ref<number | null>(null)

const fetchPengguna = async () => {
  try {
    const response = await daftarPengguna()
    if (response.success && response.data) {
      penggunaList.value = response.data
    }
  } catch (error) {
    console.error('❌ Gagal fetch data grup:', error)
  }
}

// Props dari parent
const props = defineProps({
  isModalOpen: Boolean,
  penggunaToUpdate: Object as () => Pengguna | null,
})

// Debug props.penggunaToUpdate
console.log('📝 props.penggunaToUpdate:', props.penggunaToUpdate)

// Emit event ke parent
const emit = defineEmits(['update:isModalOpen'])

// Fetch data grup
const fetchGrup = async () => {
  try {
    const response = await daftarGrup()
    if (response.success && response.data) {
      grups.value = response.data
      console.log('✅ Grup Loaded:', grups.value)
    }
  } catch (error) {
    console.error('❌ Gagal fetch data grup:', error)
  }
}

// Auto-select grup saat modal dibuka
watch(
  [() => props.penggunaToUpdate, grups],
  ([pengguna, grupList]) => {
    if (pengguna && grupList.length > 0) {
      const grupDitemukan = grupList.find((grup) => grup.name === pengguna.Grup?.name)
      selectedGrup.value = grupDitemukan ? grupDitemukan.id : null
      console.log('✅ Grup Selected:', selectedGrup.value)
    }
  },
  { immediate: true },
)

// Fungsi untuk menutup modal
const closeModal = (): void => {
  emit('update:isModalOpen', false)
}

// Fungsi untuk handle submit
const handleSubmit = async (): Promise<void> => {
  if (!selectedGrup.value) {
    alert('Silakan pilih grup!')
    return
  }

  if (!props.penggunaToUpdate || !props.penggunaToUpdate.id) {
    alert('Data pengguna tidak valid!')
    return
  }

  try {
    // Buat objek FormData
    const formData = new FormData()

    // Tambahkan data ke FormData
    formData.append('id', props.penggunaToUpdate.id.toString())
    formData.append('grup_id', selectedGrup.value.toString())

    // Debugging: Tampilkan isi FormData
    for (const [key, value] of formData.entries()) {
      console.log(key, value)
    }

    // Panggil fungsi editPengguna dengan FormData
    const response = await editPengguna(formData)

    if (response.success) {
      emit('pengguna-updated')
      closeModal()
    } else {
      alert('Gagal mengupdate data: ' + response.message)
    }
  } catch (error) {
    console.error('❌ Gagal mengupdate data:', error)
    alert('Terjadi kesalahan saat mengupdate data.')
  }
}

// Fetch data saat komponen dimount
onMounted(async () => {
  await fetchGrup()
  await fetchPengguna()
})
</script>
