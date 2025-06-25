<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import { getAllHotels, getAllJamaah, getKamarById, updateKamar } from '@/service/kamar_paket'

import PrimaryButton from '@/components/Button/PrimaryButton.vue'

const props = defineProps<{
  isFormOpen: boolean
  kamarId: number | null
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

// --- Computed Property untuk Filter ---
const filteredJamaahList = computed(() => (currentSelectionId: number | null) => {
  const selectedIds = formData.value.jamaah_ids
    .map((j) => j.id)
    .filter((id) => id !== null && id !== currentSelectionId)
  return allJamaahList.value.filter((j) => !selectedIds.includes(j.id))
})

const loadInitialData = async () => {
  try {
    const [hotelsData, jamaahData] = await Promise.all([
      getAllHotels(),
      getAllJamaah(true, props.kamarId),
    ])
    hotelList.value = hotelsData
    allJamaahList.value = jamaahData
  } catch (error) {
    emit('show-notification', 'Gagal memuat data untuk form.', 'error')
  }
}

const loadKamarData = async (id: number) => {
  isFetchingData.value = true
  try {
    const kamarData = await getKamarById(id)
    formData.value = kamarData
    if (!formData.value.jamaah_ids || formData.value.jamaah_ids.length === 0) {
      formData.value.jamaah_ids = [{ id: null }]
    }
  } catch (error) {
    emit('show-notification', 'Gagal memuat data kamar yang akan diedit.', 'error')
    emit('close')
  } finally {
    isFetchingData.value = false
  }
}

onMounted(loadInitialData)

watch(
  () => props.kamarId,
  (newId) => {
    if (newId && props.isFormOpen) loadKamarData(newId)
  },
)

const addJamaahField = () => formData.value.jamaah_ids.push({ id: null })
const removeJamaahField = (index: number) => formData.value.jamaah_ids.splice(index, 1)

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
