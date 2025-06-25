<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, computed } from 'vue'
import { getAllHotels, getAllJamaah, createKamar } from '@/service/kamar_paket'

import PrimaryButton from '@/components/Button/PrimaryButton.vue'

// --- Props & Emits ---
const props = defineProps<{
  isFormOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save-success', message: string): void
  (e: 'show-notification', message: string, type: 'success' | 'error'): void
}>()

// --- State Management ---
const hotelList = ref<{ id: number; name: string }[]>([])
const allJamaahList = ref<{ id: number; name: string; identity: string }[]>([])
const isLoading = ref(false)
const serverErrors = ref<Record<string, string>>({})

const formData = ref({
  hotel_id: null as number | null,
  tipe_kamar: 'Laki-Laki',
  kapasitas_kamar: 10,
  jamaah_ids: [{ id: null as number | null }],
})

// --- Computed Property untuk Filter ---
const filteredJamaahList = computed(() => (currentSelectionId: number | null) => {
  const selectedIds = formData.value.jamaah_ids
    .map((j) => j.id)
    .filter((id) => id !== null && id !== currentSelectionId)
  return allJamaahList.value.filter((j) => !selectedIds.includes(j.id))
})

// --- API Calls ---
onMounted(async () => {
  try {
    const hotels = await getAllHotels()
    hotelList.value = hotels.map((h: any) => ({
      id: h.id,
      name: `${h.name} (Kota : ${h.kota_name || 'N/A'})`,
    }))

    const jamaah = await getAllJamaah()
    allJamaahList.value = jamaah.map((j: any) => ({
      id: j.id,
      name: j.fullname,
      identity: j.identity_number,
    }))
  } catch (error) {
    emit('show-notification', 'Gagal memuat data untuk form.', 'error')
  }
})

// --- Form Logic ---
const addJamaahField = () => {
  formData.value.jamaah_ids.push({ id: null })
}
const removeJamaahField = (index: number) => {
  formData.value.jamaah_ids.splice(index, 1)
}

const handleSubmit = async () => {
  isLoading.value = true
  serverErrors.value = {}

  try {
    const payload = {
      ...formData.value,
      jamaah_ids: formData.value.jamaah_ids.map((j) => j.id).filter((id) => id !== null),
    }

    await createKamar(payload)
    emit('save-success', 'Data kamar berhasil ditambahkan.')
    emit('close')
  } catch (error: any) {
    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors
      if (validationErrors && validationErrors.length > 0) {
        emit('show-notification', validationErrors[0].msg, 'error')
      }
    } else {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.'
      emit('show-notification', errorMessage, 'error')
    }
    console.error('Gagal menyimpan data:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Overlay -->
  <div
    v-if="isFormOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <h2 class="text-xl font-bold text-black">Form Tambah Kamar</h2>
        <button @click="$emit('close')" class="text-black hover:text-black text-2xl">
          &times;
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nama Hotel -->
          <div>
            <label for="hotel" class="block text-sm font-medium text-black mb-1">Nama Hotel</label>
            <select
              id="hotel"
              v-model="formData.hotel_id"
              class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            >
              <option :value="null" disabled>Pilih Hotel</option>
              <option v-for="hotel in hotelList" :key="hotel.id" :value="hotel.id">
                {{ hotel.name }}
              </option>
            </select>
          </div>

          <!-- Tipe Kamar -->
          <div>
            <label for="tipe-kamar" class="block text-sm font-medium text-black mb-1"
              >Tipe Kamar</label
            >
            <select
              id="tipe-kamar"
              v-model="formData.tipe_kamar"
              class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            >
              <option>Laki-Laki</option>
              <option>Perempuan</option>
            </select>
          </div>

          <!-- Kapasitas Kamar -->
          <div>
            <label for="kapasitas" class="block text-sm font-medium text-black mb-1"
              >Kapasitas Kamar</label
            >
            <input
              type="number"
              id="kapasitas"
              v-model="formData.kapasitas_kamar"
              min="1"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            />
          </div>

          <!-- Daftar Jamaah (dinamis) -->
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
                  {{ j.name }} ({{ j.identity }})
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

        <!-- Form Footer -->
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
