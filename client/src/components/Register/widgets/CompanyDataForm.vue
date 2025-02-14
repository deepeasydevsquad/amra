<template>
  <div class="max-w-md mx-auto p-4 bg-white rounded-lg">
    <p class="text-sky-700 font-bold mb-2">Masukkan Data Perusahaan</p>

    <!-- Notifikasi -->
    <div
      v-if="notification.message"
      :class="notification.type"
      class="p-2 rounded-md text-white mb-2"
    >
      {{ notification.message }}
    </div>

    <div class="space-y-3">
      <InputField v-model="companyName" placeholder="Nama Perusahaan" />
      <InputField v-model="whatsappNumber" placeholder="Nomor WhatsApp" />

      <div class="flex">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l-lg focus:outline-none focus:shadow-outline whitespace-nowrap flex-none"
          :class="{ 'bg-gray-400 cursor-not-allowed': countdown > 0 }"
          :disabled="countdown > 0"
          type="button"
          @click="getOTP"
        >
          {{ countdown > 0 ? `Tunggu ${countdown}s` : 'Dapatkan OTP' }}
        </button>
        <input
          v-model="otp"
          class="w-full p-2 border text-black border-gray-300 rounded-r-lg rounded-l-none"
          id="otp"
          type="text"
          placeholder="Masukkan OTP"
        />
      </div>

      <InputField v-model="companyPhone" placeholder="Nomor Telpon Perusahaan" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import InputField from '../particles/InputField.vue'

// State untuk menyimpan nilai input
const companyName = ref('')
const whatsappNumber = ref('')
const otp = ref('')
const companyPhone = ref('')

// State untuk hitung mundur OTP
const countdown = ref(0)
let countdownTimer: NodeJS.Timeout | null = null

// State untuk notifikasi
const notification = ref({ message: '', type: '' })

// Fungsi untuk menampilkan notifikasi sementara
const showNotification = (message: string, type: string) => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = { message: '', type: '' }
  }, 3000)
}

// Fungsi untuk menangani aksi "Dapatkan OTP"
const getOTP = async () => {
  if (!whatsappNumber.value) {
    showNotification('Silakan masukkan nomor WhatsApp Anda.', 'bg-red-500')
    return
  }

  try {
    const response = await axios.post('http://localhost:3001/send-otp', {
      whatsappNumber: whatsappNumber.value,
    })

    showNotification('OTP berhasil dikirim!', 'bg-green-500')

    // Mulai hitung mundur 60 detik
    countdown.value = 60
    if (countdownTimer) clearInterval(countdownTimer)

    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  } catch (error) {
    console.error('Gagal mengirim OTP:', error)
    showNotification('Gagal mengirim OTP. Coba lagi nanti.', 'bg-red-500')
  }
}
</script>

<style scoped>
/* Tidak ada CSS tambahan */
</style>
