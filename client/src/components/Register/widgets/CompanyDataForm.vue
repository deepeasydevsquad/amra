<template>
  <div class="max-w-md mx-auto p-4 bg-white rounded-lg">
    <p class="text-sky-700 font-bold mb-2">Masukkan Data Perusahaan</p>
    <div class="space-y-3">
      <InputField v-model="companyName" placeholder="Nama Perusahaan" />
      <InputField v-model="whatsappNumber" placeholder="Nomor WhatsApp" />

      <div class="flex">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l-lg focus:outline-none focus:shadow-outline whitespace-nowrap flex-none"
          type="button"
          @click="getOTP"
        >
          Dapatkan OTP
        </button>
        <input
          v-model="otp"
          class="w-full p-2 border border-gray-300 rounded-r-lg rounded-l-none"
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
import InputField from '../particles/InputField.vue'

// State untuk menyimpan nilai input
const companyName = ref('')
const whatsappNumber = ref('')
const otp = ref('')
const companyPhone = ref('')

// Fungsi untuk menangani aksi "Dapatkan OTP"
const getOTP = () => {
  // Logika untuk mendapatkan OTP, misalnya panggil API
  console.log('Mengirim permintaan OTP untuk:', whatsappNumber.value)
}
</script>

<style scoped>
/* Tidak ada CSS tambahan */
</style>
