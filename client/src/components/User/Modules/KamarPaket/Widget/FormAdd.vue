<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits, computed } from 'vue'
import { getAllHotels, getAllJamaah, createKamar } from '@/service/kamar_paket'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'

// --- Props & Emits ---
const props = defineProps<{
  isFormOpen: boolean
  cabangId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save-success', message: string): void
  (e: 'show-notification', message: string, type: 'success' | 'error'): void
}>()


interface Hotel {
  id: number;
  name: string
}

interface Jamaah {
  id: number;
  name: string;
  identity: string
}

interface JamaahId {
  id: number
}

interface Form {
  hotel_id: number | null;
  tipe_kamar: string
  kapasitas_kamar: number
  jamaah_ids: JamaahId[]
}

const hotelList = ref<Hotel[]>([])
const allJamaahList = ref<Jamaah[]>([])
const isLoading = ref(false)
const serverErrors = ref<Record<string, string>>({})

const formData = ref<Form>({
  hotel_id: null,
  tipe_kamar: 'Laki-Laki',
  kapasitas_kamar: 0,
  jamaah_ids: [],
})

// // --- Computed Property untuk Filter ---
// // Computed property untuk memfilter jamaah yang belum dipilih di dropdown lain
// const filteredJamaahList = computed(() => (currentSelectionId: number | null) => {
//   const selectedIds = formData.value.jamaah_ids
//     .map((j) => j.id)
//     .filter((id) => id !== null && id !== currentSelectionId)
//   return allJamaahList.value.filter((j) => !selectedIds.includes(j.id))
// })

// --- WATCHER UNTUK MENCEGAH DUPLIKASI ---
watch(
  () => props.isFormOpen,
  (e) => {
    // const seenIds = new Set()
    // newJamaahIds.forEach((jamaah, index) => {
    //   if (jamaah.id !== null) {
    //     if (seenIds.has(jamaah.id)) {
    //       // Jika ID sudah ada, ini adalah duplikat.
    //       emit('show-notification', 'Jamaah tidak boleh dipilih lebih dari sekali.', 'error')
    //       // Reset pilihan yang duplikat menjadi null
    //       // formData.value.jamaah_ids[index].id = null
    //     } else {
    //       seenIds.add(jamaah.id)
    //     }
    //   }
    // })
  },
  { deep: true }, // 'deep' diperlukan untuk memantau perubahan di dalam array of objects
)

// // --- API Calls ---
// onMounted(async () => {
//   try {
//     // Ambil data hotel dan jamaah secara paralel
//     const [hotelResponse, jamaahResponse] = await Promise.all([
//       getAllHotels({ division_id: props.cabangId }),
//       getAllJamaah({ forEdit: false, division_id: props.cabangId }),
//     ])

//     console.log('hotelResponse:', hotelResponse)

//     // Set data hotel dari properti 'data' di dalam respons
//     hotelList.value = hotelResponse.data.map((h: any) => ({
//       id: h.id,
//       name: `${h.name} (Kota : ${h.kota_name || 'N/A'})`,
//     }))

//     // Set data jamaah dari properti 'data' di dalam respons
//     allJamaahList.value = jamaahResponse.data.map((j: any) => ({
//       id: j.id,
//       fullname: j.fullname,
//       identity_number: j.identity_number,
//     }))
//   } catch (error) {
//     console.error('Gagal memuat data untuk form:', error)
//     emit('show-notification', 'Gagal memuat data untuk form.', 'error')
//   }
// })

// --- Form Logic ---
// const addJamaahField = () => {
//   formData.value.jamaah_ids.push({ id: null })
// }

// const removeJamaahField = (index: number) => {
//   formData.value.jamaah_ids.splice(index, 1)
// }

// const handleSubmit = async () => {
//   isLoading.value = true
//   serverErrors.value = {}

//   try {
//     const payload = {
//       ...formData.value,
//       division_id: props.cabangId,
//       jamaah_ids: formData.value.jamaah_ids.map((j) => j.id).filter((id) => id !== null),
//     }

//     console.log('Payload:', payload)

//     await createKamar(payload)
//     emit('save-success', 'Data kamar berhasil ditambahkan.')
//     emit('close')
//   } catch (error: any) {
//     if (error.response && error.response.status === 422) {
//       const validationErrors = error.response.data.errors
//       if (validationErrors && validationErrors.length > 0) {
//         emit('show-notification', validationErrors[0].msg, 'error')
//       }
//     } else {
//       const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.'
//       emit('show-notification', errorMessage, 'error')
//     }
//     console.error('Gagal menyimpan data:', error)
//   } finally {
//     isLoading.value = false
//   }
// }
</script>

<template>
  <!-- Overlay -->
  <div v-if="isFormOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
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
            <label for="tipe-kamar" class="block text-sm font-medium text-black mb-1">Tipe Kamar</label>
            <select id="tipe-kamar" v-model="formData.tipe_kamar"
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
