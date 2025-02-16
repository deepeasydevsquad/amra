<template>
  <div class="min-h-screen w-full flex flex-col md:flex-row bg-white">
    <div class="relative w-full md:w-1/2">
      <img src="/bg.png" alt="Haji Image" class="w-full h-auto object-cover bg-white" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
    </div>

    <!-- Bagian Kanan (Form) -->
    <div class="w-full md:w-1/2 p-6 flex flex-col justify-center bg-white md:-ml-4 md:pl-16">
      <div class="space-y-4 w-full px-4 max-w-lg">
        <h2 class="text-3xl font-bold text-center mb-5" style="color: #175690">
          Silahkan Buat Akun Baru!
        </h2>
        <CompanyDataForm v-model="companyData" @update:otp="userData.token = $event" />

        <PackageSelection v-model="packageSelected" />

        <UserDataForm v-model="userData" />
        <Button class="w-full" label="Buat Akun" @click="registerCompany" />
        <p class="text-sm text-center" style="color: #175690">
          Dengan masuk, Anda menyetujui
          <span class="font-semibold">Syarat dan Ketentuan & Kebijakan Privasi kami</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

import CompanyDataForm from '@/components/register/widgets/CompanyDataForm.vue'
import PackageSelection from '@/components/register/widgets/PackageSelection.vue'
import UserDataForm from '@/components/register/widgets/UserDataForm.vue'
import Button from '@/components/register/particles/Button.vue'

declare let window: any // Agar TypeScript mengenali window.snap

// State untuk menyimpan data inputan user
const companyData = ref<{ company_name: string; whatsapp_company_number: string }>({
  company_name: '',
  whatsapp_company_number: '',
})

const packageSelected = ref<string>('1')
const userData = ref<{ username: string; password: string; token: string; email: string }>({
  username: '',
  password: '',
  token: '',
  email: '',
})

// ✅ Fungsi untuk memuat Midtrans Snap
const loadMidtrans = () => {
  if (document.getElementById('midtrans-script')) return // Hindari duplikasi script
  const script = document.createElement('script')
  script.id = 'midtrans-script'
  script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
  script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY)
  script.onload = () => console.log('✅ Midtrans Snap Loaded!')
  script.onerror = () => console.error('❌ Gagal memuat Midtrans Snap!')
  document.body.appendChild(script)
}

onMounted(() => {
  loadMidtrans()
})

// ✅ Fungsi untuk mengirim data ke endpoint registrasi
const registerCompany = async () => {
  console.log('✅ Tombol diklik! Memanggil registerCompany...')

  console.log('📌 Data sebelum validasi:')
  console.log('➡️ companyData:', companyData.value)
  console.log('➡️ userData:', userData.value)
  console.log('➡️ packageSelected:', packageSelected.value)

  if (
    !companyData.value.company_name ||
    !companyData.value.whatsapp_company_number ||
    !userData.value.username ||
    !userData.value.password ||
    !userData.value.token ||
    !packageSelected.value
  ) {
    alert('⚠️ Semua field harus diisi sebelum mendaftar!')
    return
  }

  try {
    const requestData = {
      company_name: companyData.value.company_name,
      whatsapp_company_number: companyData.value.whatsapp_company_number,
      username: userData.value.username,
      email: userData.value.email,
      password: userData.value.password,
      token: userData.value.token,
      package: packageSelected.value,
    }

    console.log('📤 Data yang dikirim ke backend:', requestData)

    const response = await axios.post('http://localhost:3001/register', requestData)

    if (response.data.midtrans_token) {
      alert('✅ Registrasi berhasil! Silakan lanjutkan pembayaran.')

      // ✅ Buka Midtrans Snap untuk pembayaran
      window.snap.pay(response.data.midtrans_token, {
        onSuccess: function (result: any) {
          console.log('🎉 Pembayaran sukses:', result)
          alert('🎉 Pembayaran berhasil! Selamat, akun Anda telah terdaftar.')

          // ✅ Reset form setelah pembayaran sukses
          companyData.value = { company_name: '', whatsapp_company_number: '' }
          userData.value = { username: '', password: '', token: '', email: '' }
          packageSelected.value = '1' // Reset ke nilai default
        },
        onPending: function (result: any) {
          console.log('⌛ Menunggu pembayaran:', result)
          alert('⌛ Pembayaran sedang diproses...')
        },
        onError: function (result: any) {
          console.log('❌ Pembayaran gagal:', result)
          alert('❌ Pembayaran gagal! Silakan coba lagi.')
        },
        onClose: function () {
          alert('⚠️ Anda menutup pembayaran tanpa menyelesaikannya.')
        },
      })
    } else {
      alert('✅ Registrasi berhasil, tetapi tidak ada token Midtrans.')
    }
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message)
    alert(error.response?.data?.error || 'Registrasi gagal!')
  }
}
</script>

<style scoped>
/* Tidak ada CSS tambahan */
</style>
