<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative">
      <!-- Tombol Close -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <!-- Judul Modal -->
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 text-center">Edit Cabang</h2>

      <!-- Form -->
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1">Nama Kota</label>
        <select
          v-model="form.city"
          class="border p-2 rounded w-full focus:ring focus:ring-blue-300 text-gray-700"
          :disabled="!kotaList.length"
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
          class="border p-2 rounded w-full focus:ring focus:ring-blue-300 text-gray-700"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1">Kode Pos</label>
        <input
          v-model="form.pos_code"
          placeholder="Kode Pos"
          type="text"
          class="border p-2 rounded w-full focus:ring focus:ring-blue-300 text-gray-700"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1">Alamat</label>
        <input
          v-model="form.address"
          placeholder="Alamat"
          type="text"
          class="border p-2 rounded w-full focus:ring focus:ring-blue-300 text-gray-700"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1">Tanda Tangan</label>
        <input
          type="file"
          @change="handleFileUpload"
          accept="image/png"
          class="border p-2 rounded w-full focus:ring focus:ring-blue-300 text-gray-700"
        />
        <p v-if="form.tanda_tangan" class="text-sm text-gray-600 mt-1">
          File saat ini: {{ form.tanda_tangan.name || 'Sudah ada tanda tangan' }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1">Catatan</label>
        <textarea
          placeholder="Catatan"
          v-model="form.note"
          class="border text-gray-700 p-2 rounded w-full focus:ring focus:ring-blue-300"
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
          @click="updateForm"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, onMounted, watch } from 'vue'
import { daftarKota } from '../../../../../service/cabang'

interface Kota {
  id: number
  name: string
}

const emit = defineEmits(['close', 'update'])

// Props untuk menerima data cabang yang akan diedit
const props = defineProps({
  cabang: Object,
})

const kotaList = ref<Kota[]>([])
const form = ref({
  id: null,
  name: '',
  city: '',
  pos_code: '',
  address: '',
  tanda_tangan: null,
  note: '',
})

// Update form ketika data cabang berubah
watch(
  () => props.cabang,
  (newCabang) => {
    if (newCabang) {
      form.value = {
        id: newCabang.id,
        name: newCabang.name,
        city: newCabang.city,
        pos_code: newCabang.pos_code,
        address: newCabang.address,
        tanda_tangan: newCabang.tanda_tangan,
        note: newCabang.note,
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  fetchKota()
})

const fetchKota = async () => {
  try {
    const response = await daftarKota()
    kotaList.value = response.data
  } catch (error) {
    console.error('Error fetching kota:', error)
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    console.log('File yang dipilih:', file)
    form.value.tanda_tangan = file
  }
}

const updateForm = () => {
  if (!form.value.city || !form.value.pos_code || !form.value.address) {
    alert('Harap isi semua field yang wajib!')
    return
  }
  console.log('Mengirim update:', form.value)
  emit('update', {
    ...form.value,
    city: form.value.city, // city tetap sebagai ID kota
  })
  console.log('Update event emitted!')
}
</script>
