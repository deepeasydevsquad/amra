<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { getAllHotels, getAllJamaah, getKamarById, updateKamar } from '@/service/kamar_paket'

import PrimaryButton from '@/components/Button/PrimaryButton.vue'

const props = defineProps<{
  isFormOpen: boolean
  kamarId: number | null
  cabangId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save-success', message: string): void
  (e: 'show-notification', message: string, type: 'success' | 'error'): void
}>()

const hotelList = ref<{ id: number; name: string; kota_name: string }[]>([])
const allJamaahList = ref<{ id: number; fullname: string; identity_number: string }[]>([])
const isLoading = ref(false)
const isFetchingData = ref(false)

const formData = ref({
  hotel_id: null as number | null,
  tipe_kamar: 'Laki-Laki',
  kapasitas_kamar: 10,
  jamaah_ids: [] as { id: number | null }[],
})

// Computed property untuk memfilter jamaah yang belum dipilih di dropdown lain
const filteredJamaahList = computed(() => (currentSelectionId: number | null) => {
  const selectedIds = formData.value.jamaah_ids
    .map((j) => j.id)
    .filter((id) => id !== null && id !== currentSelectionId)
  return allJamaahList.value.filter((j) => !selectedIds.includes(j.id))
})

// --- WATCHER UNTUK MENCEGAH DUPLIKASI ---
watch(
  () => formData.value.jamaah_ids,
  (newJamaahIds) => {
    const seenIds = new Set()
    let hasDuplicates = false
    const correctedJamaahIds = newJamaahIds.map((jamaah) => {
      if (jamaah.id === null) {
        return { id: null }
      }
      if (seenIds.has(jamaah.id)) {
        hasDuplicates = true
        return { id: null } // Tandai sebagai duplikat untuk dikoreksi
      }
      seenIds.add(jamaah.id)
      return jamaah
    })

    if (hasDuplicates) {
      emit('show-notification', 'Jamaah tidak boleh dipilih lebih dari sekali.', 'error')
      // Ganti array lama dengan yang sudah dikoreksi untuk menghindari loop
      formData.value.jamaah_ids = correctedJamaahIds
    }
  },
  { deep: true },
)

const resetForm = () => {
  formData.value = {
    hotel_id: null,
    tipe_kamar: 'Laki-Laki',
    kapasitas_kamar: 10,
    jamaah_ids: [{ id: null }],
  }
}

const loadEditData = async (kamarId: number) => {
  if (!kamarId) return
  isFetchingData.value = true
  try {
    // 1. Ambil semua data yang diperlukan secara paralel
    const [hotelResponse, jamaahData, kamarData] = await Promise.all([
      getAllHotels({ division_id: props.cabangId }),
      getAllJamaah({
        division_id: props.cabangId,
      }),
      getKamarById(kamarId),
    ])

    // 2. Proses dan set data hotel
    hotelList.value = hotelResponse.data.map((h: any) => ({
      id: h.id,
      name: `${h.name} (Kota : ${h.kota_name || 'N/A'})`,
    }))

    // 3. Gabungkan daftar jamaah yang tersedia dengan jamaah yang sudah ada di kamar
    const availableJamaah = jamaahData.data
    // Asumsi `kamarData.jamaah_ids` berisi array objek jamaah lengkap dari API
    const currentJamaahInRoom = kamarData.jamaah_ids || []

    // Buat Map untuk memastikan tidak ada duplikat jamaah
    const jamaahMap = new Map()
    currentJamaahInRoom.forEach((j: any) => jamaahMap.set(j.id, j))
    availableJamaah.forEach((j: any) => jamaahMap.set(j.id, j))

    allJamaahList.value = Array.from(jamaahMap.values()).map((j: any) => ({
      id: j.id,
      fullname: j.fullname,
      identity_number: j.identity_number,
    }))

    // 4. Set data form dari kamar yang akan diedit
    formData.value.hotel_id = kamarData.hotel_id
    formData.value.tipe_kamar = kamarData.tipe_kamar
    formData.value.kapasitas_kamar = kamarData.kapasitas_kamar
    // Gunakan data jamaah dari kamarData untuk mengisi pilihan
    formData.value.jamaah_ids =
      currentJamaahInRoom.length > 0
        ? currentJamaahInRoom.map((j: any) => ({ id: j.id })) // Pastikan formatnya { id: ... }
        : [{ id: null }]
  } catch (error) {
    console.error('Gagal memuat data untuk form edit:', error)
    emit('show-notification', 'Gagal memuat data untuk form edit.', 'error')
    emit('close')
  } finally {
    isFetchingData.value = false
  }
}

watch(
  () => props.isFormOpen,
  (isOpen) => {
    if (isOpen && props.kamarId) {
      loadEditData(props.kamarId)
    } else if (!isOpen) {
      resetForm()
    }
  },
  { immediate: true },
)

const addJamaahField = () => {
  if (formData.value.jamaah_ids.length < formData.value.kapasitas_kamar) {
    formData.value.jamaah_ids.push({ id: null })
  } else {
    emit('show-notification', 'Kapasitas kamar sudah penuh.', 'error')
  }
}

const removeJamaahField = (index: number) => {
  if (formData.value.jamaah_ids.length > 0) {
    formData.value.jamaah_ids.splice(index, 1)
  }
  // Jika setelah dihapus menjadi kosong, tambahkan satu field kosong
  if (formData.value.jamaah_ids.length === 0) {
    formData.value.jamaah_ids.push({ id: null })
  }
}

const handleSubmit = async () => {
  if (!props.kamarId) return
  isLoading.value = true
  try {
    const payload = {
      ...formData.value,
      jamaah_ids: formData.value.jamaah_ids.map((j) => j.id).filter((id) => id !== null),
    }
    await updateKamar(props.kamarId, payload)
    emit('save-success', 'Data kamar berhasil diperbarui.')
    emit('close')
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui data.'
    emit('show-notification', errorMessage, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <div
    v-if="isFormOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <h2 class="text-xl font-bold text-gray-800">Form Edit Kamar</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800 text-2xl">
          &times;
        </button>
      </div>
      <div v-if="isFetchingData" class="text-center p-8"><p>Loading data kamar...</p></div>
      <form v-else @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="edit-hotel" class="block text-sm font-medium text-black mb-1"
              >Nama Hotel</label
            >
            <select
              id="edit-hotel"
              v-model="formData.hotel_id"
              class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            >
              <option :value="null" disabled>Pilih Hotel</option>
              <option v-for="hotel in hotelList" :key="hotel.id" :value="hotel.id">
                {{ hotel.name }} (Kota: {{ hotel.kota_name }})
              </option>
            </select>
          </div>
          <div>
            <label for="edit-tipe-kamar" class="block text-sm font-medium text-black mb-1"
              >Tipe Kamar</label
            >
            <select
              id="edit-tipe-kamar"
              v-model="formData.tipe_kamar"
              class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            >
              <option>Laki-Laki</option>
              <option>Perempuan</option>
            </select>
          </div>
          <div>
            <label for="edit-kapasitas" class="block text-sm font-medium text-black mb-1"
              >Kapasitas Kamar</label
            >
            <input
              type="number"
              id="edit-kapasitas"
              v-model="formData.kapasitas_kamar"
              min="1"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-black mb-1">Daftar Jamaah</label>
            <div
              v-for="(jamaah, index) in formData.jamaah_ids"
              :key="index"
              class="flex items-center gap-2 mb-2"
            >
              <select
                v-model="jamaah.id"
                class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option :value="null" disabled>Pilih Jamaah</option>
                <option v-for="j in filteredJamaahList(jamaah.id)" :key="j.id" :value="j.id">
                  {{ j.fullname }} ({{ j.identity_number }})
                </option>
              </select>
              <button
                type="button"
                @click="removeJamaahField(index)"
                class="p-2 text-red-500 hover:text-red-700 text-2xl"
                title="Hapus Jamaah"
              >
                &times;
              </button>
            </div>
            <button
              type="button"
              @click="addJamaahField"
              class="w-full mt-2 px-4 py-2 border border-dashed border-gray-300 text-sm font-medium rounded-md text-black hover:bg-gray-50"
            >
              + Tambah Jamaah
            </button>
          </div>
        </div>
        <div class="mt-8 pt-4 border-t flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <PrimaryButton type="submit" :disabled="isLoading">
            {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
          </PrimaryButton>
        </div>
      </form>
    </div>
  </div>
</template>
