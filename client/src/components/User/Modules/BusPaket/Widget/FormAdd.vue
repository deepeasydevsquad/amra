<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, computed } from 'vue'
import { getAllJamaah, getAllCities, createBus } from '@/service/bus_paket'

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

const cityList = ref<{ id: number; name: string }[]>([])
const allJamaahList = ref<{ id: number; name: string; identity: string }[]>([])
const isLoading = ref(false)
const serverErrors = ref<Record<string, string>>({})

const formData = ref({
  bus_number: '',
  city_id: null as number | null,
  kapasitas_bus: 10,
  bus_leader: '',
  jamaah_ids: [{ id: null as number | null }],
})

const filteredJamaahList = computed(() => (currentSelectionId: number | null) => {
  const selectedIds = formData.value.jamaah_ids
    .map((j) => j.id)
    .filter((id) => id !== null && id !== currentSelectionId)
  return allJamaahList.value.filter((j) => !selectedIds.includes(j.id))
})

// --- API Calls ---
onMounted(async () => {
  try {
    // Load cities
    const cities = await getAllCities()
    cityList.value = cities.map((c: any) => ({
      id: c.id,
      name: c.name,
    }))

    // Load jamaah
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

    await createBus(payload)
    emit('save-success', 'Data bus berhasil ditambahkan.')
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
        <h2 class="text-xl font-bold text-black">Form Tambah Bus</h2>
        <button @click="$emit('close')" class="text-black hover:text-black text-2xl">
          &times;
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nomor Bus -->
          <div>
            <label for="bus_number" class="block text-sm font-medium text-black mb-1"
              >Nomor Bus</label
            >
            <input
              id="bus_number"
              type="text"
              placeholder="Nomor Bus contoh: BL 12345 UA"
              v-model="formData.bus_number"
              class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder:text-gray-400"
            />
          </div>

          <!-- Bus Leader -->
          <div>
            <label for="bus_leader" class="block text-sm font-medium text-black mb-1"
              >Bus Leader</label
            >
            <input
              id="bus_leader"
              type="text"
              placeholder="Pemimpin Bus"
              v-model="formData.bus_leader"
              class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder:text-gray-400"
            />
          </div>

          <!-- Kapasitas Bus -->
          <div>
            <label for="kapasitas" class="block text-sm font-medium text-black mb-1"
              >Kapasitas Bus</label
            >
            <input
              type="number"
              id="kapasitas"
              v-model="formData.kapasitas_bus"
              min="1"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder:text-gray-400"
            />
          </div>

          <!-- Pilih Kota -->
          <div>
            <label for="city" class="block text-sm font-medium text-black mb-1">Nama Kota</label>
            <select
              id="city"
              v-model="formData.city_id"
              class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder:text-gray-400"
            >
              <option :value="null" disabled>Pilih Kota Singgah</option>
              <option v-for="city in cityList" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
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
<style scoped></style>
