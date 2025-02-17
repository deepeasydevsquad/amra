<template>
  <div class="min-h-screen w-full flex flex-col md:flex-row bg-white">
    <div class="relative w-full md:w-1/2">
      <img src="/bg.png" alt="Haji Image" class="w-full h-auto object-cover bg-white" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
    </div>

    <!-- Bagian Kanan (Form) -->
    <div class="w-full md:w-1/2 p-6 flex flex-col justify-center bg-white md:-ml-4 md:pl-16">
      <div class="space-y-4 w-full px-4 max-w-lg">
        <h2 class="text-3xl font-bold text-center mb-5 text-primary">Silahkan Buat Akun Baru!</h2>
        <CompanyDataForm v-model="companyData" @update:otp="userData.token = $event" />
        <PackageSelection v-model="packageSelected" />
        <UserDataForm v-model="userData" />
        <Button class="w-full" label="Buat Akun" @click="registerCompany" />
        <p class="text-sm text-center text-primary">
          Dengan masuk, Anda menyetujui
          <span class="font-semibold">Syarat dan Ketentuan & Kebijakan Privasi kami</span>
        </p>
      </div>
    </div>

    <!-- Notifikasi -->
    <transition name="fade">
      <div
        v-if="notification.show"
        class="fixed top-5 right-5 p-4 rounded-lg text-white shadow-lg"
        :class="notification.type"
      >
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

import CompanyDataForm from '@/components/Register/widgets/CompanyDataForm.vue'
import PackageSelection from '@/components/Register/widgets/PackageSelection.vue'
import UserDataForm from '@/components/Register/widgets/UserDataForm.vue'
import Button from '@/components/Register/particles/Button.vue'

declare let window: any

const notification = ref({ show: false, message: '', type: '' })

const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
  notification.value = { show: true, message, type }
  setTimeout(() => (notification.value.show = false), 3000)
}

const companyData = ref({ company_name: '', whatsapp_company_number: '' })
const packageSelected = ref('1')
const userData = ref({ username: '', password: '', token: '', email: '', confirmPassword: '' })

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email)

// Load Midtrans Snap script saat komponen dimount
onMounted(() => {
  if (!window.snap) {
    let script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', 'YOUR_CLIENT_KEY_HERE') // Ganti dengan client key Midtrans
    document.head.appendChild(script)
  }
})

const registerCompany = async () => {
  if (
    !companyData.value.company_name ||
    !companyData.value.whatsapp_company_number ||
    !userData.value.username ||
    !userData.value.password ||
    !userData.value.token ||
    !packageSelected.value ||
    !userData.value.confirmPassword
  ) {
    showNotification('⚠️ Semua field harus diisi!', 'warning')
    return
  }

  if (userData.value.username.length < 8) {
    showNotification('⚠️ Username minimal 8 karakter!', 'error')
    return
  }

  if (!isValidEmail(userData.value.email)) {
    showNotification('⚠️ Format email tidak valid!', 'error')
    return
  }

  if (userData.value.password !== userData.value.confirmPassword) {
    showNotification('⚠️ Password dan konfirmasi tidak cocok!', 'error')
    return
  }

  try {
    const response = await axios.post('http://localhost:3001/register', {
      company_name: companyData.value.company_name,
      whatsapp_company_number: companyData.value.whatsapp_company_number,
      username: userData.value.username,
      email: userData.value.email,
      password: userData.value.password,
      token: userData.value.token,
      package: packageSelected.value,
    })

    console.log('🔥 Response dari backend:', response.data) // Debugging token Midtrans

    if (response.data.midtrans_token) {
      showNotification('✅ Registrasi berhasil! Silakan lanjutkan pembayaran.', 'success')

      setTimeout(() => {
        console.log('🚀 Memanggil Midtrans Snap dengan token:', response.data.midtrans_token)
        window.snap.pay(response.data.midtrans_token, {
          onSuccess: () => showNotification('🎉 Pembayaran berhasil! Akun terdaftar.', 'success'),
          onPending: () => showNotification('⌛ Pembayaran dalam proses...', 'warning'),
          onError: () => showNotification('❌ Pembayaran gagal!', 'error'),
          onClose: () => showNotification('⚠️ Anda menutup pembayaran.', 'warning'),
        })
      }, 500) // Delay sedikit untuk memastikan Snap siap
    } else {
      showNotification('❌ Gagal mendapatkan token pembayaran!', 'error')
    }
  } catch (error) {
    console.error('❌ Error saat registrasi:', error)
    showNotification(error.response?.data?.error || 'Registrasi gagal!', 'error')
  }
}

</script>

<style scoped>
.success {
  background-color: #4caf50;
}
.error {
  background-color: #f44336;
}
.warning {
  background-color: #ff9800;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.text-primary {
  color: #175690;
}
</style>
