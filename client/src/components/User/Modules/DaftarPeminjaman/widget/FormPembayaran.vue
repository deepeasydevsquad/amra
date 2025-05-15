<template>
  <div
    v-if="isOpen"
    v-bind="attrs"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-gray-700">
      <h2 class="text-xl font-bold text-center mb-1">Pembayaran Bulanan</h2>

      <!-- Term sebagai Input Disabled -->
      <div class="mb-4">
        <label for="term" class="block text-sm font-medium">Pembayaran ke</label>
        <input
          id="term"
          type="text"
          :value="`Pembayaran ke-${term}`"
          class="mt-1 block w-full rounded-md bg-gray-200 text-center font-medium text-gray-600"
          disabled
        />
      </div>

      <!-- Input Nominal (Formatted Display) -->
      <div class="mb-4">
        <label for="nominalDisplay" class="block text-sm font-medium">Nominal</label>
        <input
          id="nominalDisplay"
          type="text"
          :value="formattedNominal"
          @input="onFormattedInput"
          :disabled="loading"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
        />
      </div>

      <div v-if="errorMessage" class="text-sm text-red-500 mb-2">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="text-sm text-green-600 mb-2">
        {{ successMessage }}
      </div>

      <div class="flex justify-end space-x-2">
        <button
          @click="emitClose"
          class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          :disabled="loading"
        >
          Tutup
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 rounded-lg bg-black hover:bg-gray-900 text-white"
          :disabled="loading"
        >
          <span v-if="loading">Proses...</span>
          <span v-else>Bayar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { pembayaranPerbulan } from '@/service/daftar_pinjaman'
import axios from 'axios'
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()

// Props & Types
interface Riwayat {
  status: string
  jumlah: number
  tanggal: string
}
interface PeminjamanData {
  id: number
  riwayat_pembayaran: Riwayat[]
}
const props = defineProps<{
  peminjaman: PeminjamanData
  isOpen: boolean
}>()
const emit = defineEmits(['close'])

// State
const nominal = ref<number>(0)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

// Term ke-n (hanya menghitung yang status === 'cicilan')
const term = computed(() => {
  return props.peminjaman.riwayat_pembayaran?.filter((p) => p.status === 'cicilan').length + 1
})

// Reset form saat modal dibuka
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      nominal.value = 0
      errorMessage.value = ''
      successMessage.value = ''
      nextTick(() => inputRef.value?.focus())
    }
  },
)

// Format ke IDR
const formatToRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formattedNominal = computed(() => formatToRupiah(nominal.value))

// Input handler untuk parsing dari input teks ke angka
const onFormattedInput = (e: Event) => {
  const input = (e.target as HTMLInputElement).value
  const numeric = parseInt(input.replace(/[^\d]/g, '')) || 0
  nominal.value = numeric
}

// Close modal
const emitClose = () => emit('close')
const emitSuccess = () => emit('success')

// Submit handler
const handleSubmit = async () => {
  try {
    loading.value = true

    const formData = {
      peminjaman_id: props.peminjaman.id,
      nominal: nominal.value,
    }

    const result = await pembayaranPerbulan(formData) // Kirim sebagai body
    console.log('Full response backend:', result)

    // Jika invoice adalah kode yang perlu digabungkan dengan URL dasar
    const invoiceUrl = `/invoice-pembayaran/${result.invoice}`

    // Membuka invoice di jendela baru
    window.open(invoiceUrl, '_blank')

    emitSuccess()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      errorMessage.value = error.response.data.message || 'Terjadi kesalahan.'
    } else {
      errorMessage.value = (error as Error).message
    }
  } finally {
    loading.value = false
  }
}
</script>
