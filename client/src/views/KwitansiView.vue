<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div
      class="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-gray-800 border border-gray-300"
    >
      <!-- Header -->
      <div class="text-center border-b border-gray-300 pb-4">
        <h1 class="text-xl font-bold">Kwitansi Pembayaran</h1>
        <p class="text-sm text-gray-500">Terima kasih telah melakukan registrasi</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-6">
        <div
          class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-700 mx-auto"
        ></div>
        <p class="text-gray-700 font-semibold mt-2">Memuat...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center text-red-500 font-semibold py-6">
        {{ error }}
      </div>

      <!-- Success State -->
      <div v-else class="py-4 space-y-3">
        <!-- Order ID -->
        <div class="text-center border-b pb-2">
          <p class="text-gray-600">Order ID</p>
          <p class="text-black font-mono font-bold">{{ transaction.order_id }}</p>
        </div>

        <!-- Status -->
        <div class="flex justify-between items-center border-b pb-2">
          <p class="text-gray-600">Status:</p>
          <span class="font-bold flex items-center text-black">
            <span v-if="transaction.status === 'success'" class="text-green-500">✔️</span>
            <span v-if="transaction.status === 'pending'" class="text-yellow-500">⏳</span>
            <span v-if="transaction.status === 'failed'" class="text-red-500">❌</span>
            <span class="ml-2">{{ transaction.status.toUpperCase() }}</span>
          </span>
        </div>

        <!-- Jumlah Pembayaran -->
        <div class="flex justify-between border-b pb-2">
          <p class="text-gray-600">Jumlah Pembayaran:</p>
          <p class="text-black font-bold font-mono">{{ formatCurrency(transaction.price) }}</p>
        </div>

        <!-- Nama Rekening -->
        <div class="flex justify-between border-b pb-2">
          <p class="text-gray-600">Nama Rekening:</p>
          <p class="text-black font-bold">{{ transaction.rekening.toUpperCase() }}</p>
        </div>

        <!-- Bank -->
        <div v-if="transaction.bank" class="flex justify-between border-b pb-2">
          <p class="text-gray-600">Bank:</p>
          <p class="text-black font-bold">{{ transaction.bank.toUpperCase() }}</p>
        </div>

        <!-- Nomor Rekening -->
        <div v-if="transaction.va_number" class="flex justify-between border-b pb-2">
          <p class="text-gray-600">Nomor Rekening:</p>
          <p class="text-black font-mono font-bold">{{ transaction.va_number }}</p>
        </div>

        <!-- Keterangan -->
        <div class="flex justify-between border-b pb-2">
          <p class="text-gray-600">Keterangan:</p>
          <p class="text-black font-bold text-right leading-tight">
            Pembayaran Pendaftaran <br />
            Registrasi Aplikasi AMRA
          </p>
        </div>

        <!-- Tanggal Transaksi -->
        <div class="flex justify-between">
          <p class="text-gray-600">Tanggal Transaksi:</p>
          <p class="text-black font-bold">{{ formatDate(transaction.createdAt) }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500 mt-4 border-t pt-2">
        <p>AMRA SAAS Payment System</p>
        <p>© {{ new Date().getFullYear() }} AMRA. All Rights Reserved.</p>
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
