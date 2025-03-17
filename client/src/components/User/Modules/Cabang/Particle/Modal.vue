<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
    >
      <Transition name="modal-scale">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative" v-if="isOpen">
          <!-- Tombol Close -->
          <button
            @click="$emit('close')"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <!-- Judul Modal -->
          <h2 class="text-2xl font-semibold mb-4 text-gray-800 text-center">Tambah Cabang</h2>

          <!-- Form -->
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-1">Nama Kota</label>
            <select
              v-model="form.city"
              class="border p-2 rounded w-full focus:ring focus:ring-sky-600 text-gray-700"
              :disabled="kotaList.length == 0"
            >
              <option value="" disabled>Pilih Kota</option>
              <option v-for="kota in kotaList" :key="kota.id" :value="kota.id">
                {{ kota.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-1">Nama Cabang</label>
            <input
              v-model="form.name"
              placeholder="Nama Cabang"
              type="text"
              class="border p-2 rounded w-full focus:ring focus:ring-sky-600 text-gray-700"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-1">Kode Pos</label>
            <input
              v-model="form.pos_code"
              placeholder="Kode Pos"
              type="text"
              class="border p-2 rounded w-full focus:ring focus:ring-sky-600 text-gray-700"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-1">Alamat</label>
            <input
              v-model="form.address"
              placeholder="Alamat"
              type="text"
              class="border p-2 rounded w-full focus:ring focus:ring-sky-600 text-gray-700"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-1">Tanda Tangan</label>
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/png"
              class="border p-2 rounded w-full focus:ring focus:ring-green-300 text-gray-700"
            />
            <p class="text-xs text-gray-500 mt-1">
              Gambar harus berekstensi <span class="font-semibold">.png</span>, maksimal
              <span class="font-semibold">1 MB</span>, dan berukuran
              <span class="font-semibold">110 x 80 pixel</span>.
            </p>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-1">Catatan</label>
            <textarea
              placeholder="Catatan"
              v-model="form.note"
              class="border text-gray-700 p-2 rounded w-full focus:ring focus:ring-sky-600"
            ></textarea>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex justify-end space-x-2">
            <button
              @click="$emit('close')"
              class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
            <button
              @click="saveForm"
              class="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue'
import { daftarKota } from '../../../../../service/cabang'

interface Kota {
  id: number
  name: string
}

const emit = defineEmits(['close', 'save'])

const kotaList = ref<Kota[]>([])

const form = ref({
  name: '',
  city: '',
  pos_code: '',
  address: '',
  tanda_tangan: null,
  note: '',
})

const isOpen = ref(true)

onMounted(() => {
  fetchKota()
})

const fetchKota = async () => {
  try {
    const response = await daftarKota()
    kotaList.value = response.data
    console.log('Kota:', kotaList.value)
  } catch (error) {
    console.error('Error fetching kota:', error)
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    form.value.tanda_tangan = file
  }
}

const saveForm = () => {
  if (!form.value.city || !form.value.pos_code || !form.value.address) {
    alert('Harap isi semua field yang wajib!')
    return
  }
  emit('save', { ...form.value, city: form.value.city })
  isOpen.value = false
}
</script>

<style scoped>
/* Background Fade */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease-out;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Modal Scale & Slide */
.modal-scale-enter-active {
  transition:
    transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
    opacity 0.3s ease-out;
}
.modal-scale-leave-active {
  transition:
    transform 0.3s ease-in,
    opacity 0.2s ease-in;
}
.modal-scale-enter-from {
  transform: scale(0.8) translateY(20px);
  opacity: 0;
}
.modal-scale-leave-to {
  transform: scale(0.9) translateY(-10px);
  opacity: 0;
}
</style>
