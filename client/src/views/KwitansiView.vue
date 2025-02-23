<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200"
  >
    <div class="bg-white shadow-xl rounded-lg p-6 w-full max-w-md text-gray-800">
      <h1 class="text-2xl font-bold text-gray-700 text-center mb-4">Kwitansi Pembayaran</h1>

      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"
        ></div>
        <p class="text-yellow-600 font-semibold">Memuat...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center text-red-500 font-semibold">{{ error }}</div>

      <!-- Success State -->
      <div v-else>
        <div class="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
          <!-- Order ID (Tengah) -->
          <div class="text-center">
            <p class="text-gray-600">Order ID</p>
            <p class="text-gray-800 font-bold">{{ transaction.order_id }}</p>
          </div>

          <!-- Status -->
          <div class="flex justify-between">
            <p class="text-gray-600">Status:</p>
            <p :class="statusClass(transaction.status)" class="font-bold">
              {{ transaction.status.toUpperCase() }}
            </p>
          </div>

          <!-- Jumlah Pembayaran -->
          <div class="flex justify-between">
            <p class="text-gray-600">Jumlah Pembayaran:</p>
            <p class="text-gray-800 font-bold">{{ formatCurrency(transaction.price) }}</p>
          </div>

          <!-- Nama Rekening -->
          <div class="flex justify-between">
            <p class="text-gray-600">Nama Rekening:</p>
            <p class="text-gray-800 font-bold">{{ transaction.rekening }}</p>
          </div>

          <!-- Bank -->
          <div v-if="transaction.bank" class="flex justify-between">
            <p class="text-gray-600">Bank:</p>
            <p class="text-gray-800 font-bold">{{ transaction.bank.toUpperCase() }}</p>
          </div>

          <!-- Nomor Rekening -->
          <div v-if="transaction.va_number" class="flex justify-between">
            <p class="text-gray-600">Nomor Rekening:</p>
            <p class="text-gray-800 font-bold">{{ transaction.va_number }}</p>
          </div>

          <!-- Tanggal Transaksi -->
          <div class="flex justify-between">
            <p class="text-gray-600">Tanggal Transaksi:</p>
            <p class="text-gray-800 font-bold">{{ formatDate(transaction.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

interface Transaction {
  order_id: string
  bank: string
  va_number: string
  status: string
  harga: number
  nama_rekening: string
  createdAt: string
}

export default defineComponent({
  setup() {
    const transaction = ref<Partial<Transaction>>({})
    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)
    const route = useRoute()

    // Format Harga
    const formatCurrency = (amount: string | number | undefined) => {
      if (!amount) return '0'
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
        Number(amount),
      )
    }

    // Format Tanggal
    const formatDate = (dateString: string | null) => {
      if (!dateString) return 'Tidak tersedia'
      const date = new Date(dateString)
      return isNaN(date.getTime())
        ? 'Format tanggal tidak valid'
        : date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
    }

    // Status Styling
    const statusClass = (status: string | undefined) => {
      if (!status) return 'text-gray-500'
      const lowerStatus = status.toLowerCase()
      if (lowerStatus === 'success') return 'text-green-500 font-bold'
      if (lowerStatus === 'pending') return 'text-yellow-500 font-bold'
      if (lowerStatus === 'failed') return 'text-red-500 font-bold'
      return 'text-gray-700 font-bold'
    }

    // Ambil Data dari API
    onMounted(async () => {
      const orderId = route.query.order_id as string
      console.log('Order ID dari query:', orderId)

      if (!orderId) {
        error.value = 'Order ID tidak ditemukan'
        loading.value = false
        return
      }

      try {
        const response = await axios.get(`http://localhost:3001/kwitansi/${orderId}`)
        console.log('Response dari server:', response.data)

        if (response.data && Object.keys(response.data).length > 0) {
          transaction.value = {
            ...response.data,
            harga: Number(response.data.harga), // Konversi harga ke number
          }
          console.log('Data yang di-set ke transaction:', transaction.value)
        } else {
          error.value = 'Data transaksi tidak ditemukan'
        }
      } catch (err) {
        console.error('Error fetching transaction:', err)
        error.value = 'Gagal mengambil data transaksi'
      } finally {
        loading.value = false
      }
    })

    return {
      transaction,
      loading,
      error,
      formatCurrency,
      formatDate,
      statusClass,
    }
  },
})
</script>

<style scoped></style>
