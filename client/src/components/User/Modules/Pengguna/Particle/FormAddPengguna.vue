<template>
  <!-- Modal -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
      <!-- Header Modal -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-700">Pilih Member dan Grup</h2>
      </div>

      <!-- Body Modal -->
      <div class="p-6">
        <!-- Select Member -->
        <div class="mb-4">
          <label for="member" class="block text-sm font-medium text-gray-700 mb-2">Member</label>
          <select
            id="member"
            v-model="selectedMember"
            @change="updateCabangId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          >
            <option value="0">Pilih Member</option>
            <option v-for="member in members" :key="member.id" :value="member.id">
              {{ member.fullname }}
            </option>
          </select>
        </div>

        <!-- Select Grup -->
        <div class="mb-6">
          <label for="grup" class="block text-sm font-medium text-gray-700 mb-2">Grup</label>
          <select
            id="grup"
            v-model="selectedGrup"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          >
            <option value="0">Pilih Grup</option>
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
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { getMember } from '@/service/member'
import { daftarGrup } from '@/service/grup'
import { addPengguna, daftarPengguna } from '@/service/pengguna'

const penggunaList = ref<any[]>([]) // State untuk menyimpan data pengguna

// Fungsi untuk mengambil data pengguna dari API
const fetchPengguna = async () => {
  try {
    const response = await daftarPengguna()
    if (response.success && response.data) {
      penggunaList.value = response.data
    }
  } catch (error) {
    console.error('Gagal mengambil data pengguna:', error)
  }
}

interface Grup {
  id: number
  cabang_id: number
  name: string
}

interface Member {
  id: number
  fullname: string
  cabang_id: number // Tambahkan cabang_id
}

const grups = ref<Grup[]>([])
const members = ref<Member[]>([])

// Fetch data grup dari API
const fetchGrup = async () => {
  try {
    const response = await daftarGrup()
    if (response.success && response.data) {
      grups.value = response.data
    }
  } catch (error) {
    console.error('Gagal mengambil data grup:', error)
  }
}

// Fetch data member dari API
const fetchMember = async () => {
  try {
    const response = await getMember()
    if (response && Array.isArray(response.data)) {
      members.value = response.data
      console.log('✅ Data member berhasil dimuat:', members.value)
    } else {
      console.error('❌ Data member bukan array atau response tidak valid:', response)
    }
  } catch (error) {
    console.error('❌ Gagal fetch data member:', error)
  }
}

// Props untuk kontrol modal dari parent
const props = defineProps({
  isModalOpen: Boolean,
})

// Emit event untuk menutup modal
const emit = defineEmits(['update:isModalOpen'])

// State untuk select member, grup, dan cabang_id
const selectedMember = ref<number | null>(0)
const selectedGrup = ref<number | null>(0)
const selectedCabangId = ref<number | null>(null) // Tambahkan ref untuk cabang_id

// Fungsi untuk mengambil cabang_id dari member yang dipilih
const updateCabangId = (): void => {
  const selectedMemberData = members.value.find((member) => member.id === selectedMember.value)
  if (selectedMemberData) {
    selectedCabangId.value = selectedMemberData.cabang_id
  } else {
    selectedCabangId.value = null
  }
}

// Fungsi untuk menutup modal
const closeModal = (): void => {
  fetchPengguna()
  emit('update:isModalOpen', false) // Emit perubahan ke parent
}

// Fungsi untuk handle submit dengan FormData
const handleSubmit = async (): Promise<void> => {
  if (!selectedMember.value || !selectedGrup.value || !selectedCabangId.value) {
    alert('Silakan pilih member, grup, dan pastikan cabang_id tersedia!')
    return
  }

  try {
    // Buat objek FormData
    const formData = new FormData()

    // Tambahkan data ke FormData
    formData.append('member_id', selectedMember.value.toString())
    formData.append('grup_id', selectedGrup.value.toString())
    formData.append('division_id', selectedCabangId.value.toString())

    // Debugging: Tampilkan isi FormData
    for (const [key, value] of formData.entries()) {
      console.log(key, value)
    }

    // Panggil fungsi addPengguna dengan FormData
    const response = await addPengguna(formData)

    if (response.success) {
      emit('pengguna-added')
      closeModal()
    } else {
      alert('Gagal menyimpan data: ' + response.message)
    }
  } catch (error) {
    console.error('❌ Gagal menyimpan data:', error)
    alert('Terjadi kesalahan saat menyimpan data.')
  }
}

// Fetch data ketika komponen dimount
onMounted(() => {
  fetchMember()
  fetchGrup()
})
</script>
