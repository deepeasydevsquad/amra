<template>
  <transition name="modal-fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <div
      v-if="modalTambahPinjaman"
      class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800">Tambah Peminjaman</h3>
          <button @click="closeModal" class="text-gray-600 hover:text-gray-800">&times;</button>
        </div>
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Form content -->
          <div class="mb-4">
            <label for="jamaah" class="block text-sm font-medium text-gray-700">Nama Jamaah</label>
            <select
              name="jamaah"
              id="jamaah"
              v-model="selectedJamaah"
              class="mt-1 px-3 py-2 border rounded-md w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="0">Pilih Jamaah</option>
              <option v-for="jamaah in jamaahs" :key="jamaah.id" :value="jamaah.id">
                {{ jamaah.nama_jamaah }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label for="nominal" class="block text-sm font-medium text-gray-700">
              Nominal Peminjaman
            </label>
            <input
              :value="formatRupiah(nominal)"
              @input="updateNominal($event.target.value)"
              type="text"
              id="nominal"
              class="mt-1 px-3 py-2 border rounded-md w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Masukkan nominal peminjaman"
              required
            />
          </div>

          <div class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label for="dp" class="block text-sm font-medium text-gray-700">DP</label>
              <input
                :value="formatRupiah(dp)"
                @input="updateDP($event.target.value)"
                type="text"
                id="dp"
                class="mt-1 px-3 py-2 border rounded-md w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Masukkan DP peminjaman"
                required
              />
            </div>

            <div>
              <label for="tenor" class="block text-sm font-medium text-gray-700">Tenor</label>
              <input
                v-model="tenor"
                type="number"
                id="tenor"
                class="mt-1 px-3 py-2 border rounded-md w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Tenor"
                required
              />
            </div>
          </div>
          <div class="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label for="berangkat" class="block text-sm font-medium text-gray-700 mb-1">
                Sudah berangkat
              </label>
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="berangkat"
                  class="h-5 w-5 text-blue-600 border-gray-300 rounded"
                />
                <span class="text-sm text-gray-700">Sudah Berangkat</span>
              </div>
            </div>

            <div>
              <label for="mulai_bayar" class="block text-sm font-medium text-gray-700 mb-1">
                Mulai bayar
              </label>
              <input
                v-model="mulaiBayar"
                type="date"
                id="mulai_bayar"
                class="border px-3 py-2 rounded-md text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="mt-4 flex justify-end space-x-2">
            <button @click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md">
              Batal
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import { daftarJamaah } from '@/service/daftar_jamaah'
import { addPinjaman } from '@/service/daftar_pinjaman'

const fetchJamaahs = async () => {
  try {
    const response = await daftarJamaah()
    jamaahs.value = response.data
    console.log('Jamaahs:', jamaahs.value)
  } catch (error) {
    console.error('Error fetching Jamaahs:', error)
  }
}

onMounted(() => {
  fetchJamaahs()
})

const jamaahs = ref([])
const selectedJamaah = ref<number | 0>(0)
const nominal = ref<number | null>(null)
const dp = ref<number | null>(null)
const mulaiBayar = ref<string>(new Date().toISOString().slice(0, 10))
const tenor = ref<number | null>(null)
const berangkat = ref<boolean>(false)

const formatRupiah = (value: number | null) => {
  if (value === null) return ''
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const updateDP = (inputValue: string) => {
  const number = parseInt(inputValue.replace(/[^0-9]/g, ''), 10)
  dp.value = isNaN(number) ? null : number
}

const updateNominal = (inputValue: string) => {
  const number = parseInt(inputValue.replace(/[^0-9]/g, ''), 10)
  nominal.value = isNaN(number) ? null : number
}

// Menerima prop modalTambahPinjaman dari parent
const props = defineProps({
  modalTambahPinjaman: {
    type: Boolean,
    required: true,
  },
})

// Emit untuk memberitahu parent saat modal ditutup
const emit = defineEmits<{
  (e: 'close'): void
}>()

// Menutup modal
const closeModal = () => {
  emit('close') // Emit event close untuk memberitahu parent bahwa modal ditutup
}

// Fungsi untuk menangani submit form
const submitForm = async () => {
  const formData = {
    jamaah_id: selectedJamaah.value,
    nominal: nominal.value,
    dp: dp.value,
    mulai_bayar: mulaiBayar.value,
    tenor: tenor.value,
    sudah_berangkat: berangkat.value,
  }

  console.log('Data form yang dikirim:', formData)

  try {
    const result = await addPinjaman(formData)
    console.log('Result:', result)
    resetForm()
    closeModal() // Menutup modal setelah submit
  } catch (error) {
    console.error('Gagal submit form:', error)
  }
}

// Hook untuk kontrol animasi
const beforeEnter = (el: HTMLElement) => {
  el.style.opacity = '0'
  el.style.transform = 'scale(0.9)'
}

const enter = (el: HTMLElement, done: Function) => {
  el.offsetHeight // trigger reflow
  el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
  el.style.opacity = '1'
  el.style.transform = 'scale(1)'
  done()
}

const leave = (el: HTMLElement, done: Function) => {
  el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
  el.style.opacity = '0'
  el.style.transform = 'scale(0.9)'
  done()
}

// Fungsi untuk mereset form
const resetForm = () => {
  selectedJamaah.value = 0
  nominal.value = null
  dp.value = null
  mulaiBayar.value = new Date().toISOString().slice(0, 10)
  tenor.value = null
  berangkat.value = false
}
</script>

<style scoped>
/* Styling untuk modal */
.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Transisi animasi modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.modal-fade-enter, .modal-fade-leave-to /* .modal-fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: scale(0.9);
}
</style>
