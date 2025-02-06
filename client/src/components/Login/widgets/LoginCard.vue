<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import LoginButton from '@/components/Login/particles/LoginButton.vue'
import ForgotPasswordButton from '@/components/Login/particles/ForgotPasswordButton.vue'
import GuideButton from '@/components/Login/particles/GuideButton.vue'
import RegisterButton from '@/components/Login/particles/RegisterButton.vue'

const username = ref('')
const password = ref('')

const handleLogin = async (type) => {
  try {
    // Kirim data login ke server Express.js menggunakan axios
    const response = await axios.post(import.meta.env.VITE_APP_API_BASE_URL + '/auth/login', {
      type: type,
      username: username.value,
      password: password.value,
    })

    if (response.status === 200) {
      console.log('Login successful', response.data)
      // Tindakan setelah login berhasil, seperti redirect
    } else {
      console.log('Login failed', response.data)
      // Tindakan setelah login gagal
    }
  } catch (error) {
    console.error('An error occurred during login:', error)
  }
}
</script>

<template>
  <div class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="bg-white shadow-lg rounded-lg w-full flex">
      <!-- Bagian Kiri -->
      <div class="w-1/2 rounded-l-lg">
        <img src="/bg.png" alt="Haji Image" class="object-cover w-full h-full" />
      </div>

      <!-- Bagian Kanan -->
      <div class="ml-6 p-8 flex flex-col justify-center items-center max-w-2lg">
        <div class="flex flex-col justify-center w-full mb-0">
          <h2 class="text-3xl font-bold text-center mb-10 text-[#175690]">Selamat Datang</h2>
          <div class="space-y-3">
            <input
              v-model="company_code"
              type="text"
              placeholder="Kode Perusahaan"
              class="w-full p-2 border border-gray-300 rounded-lg input-field"
            />
            <p class="text-gray-500 text-xs mt-0 mb-10 italic">
              Kode Perusahaan wajib diisi jika anda masuk sebagai Staff.
            </p>
            <input
              v-model="username"
              type="text"
              placeholder="Username"
              class="w-full p-2 border border-gray-300 rounded-lg input-field"
            />
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full p-2 border border-gray-300 rounded-lg input-field"
            />
            <LoginButton
              @click="handleLogin('administrator')"
              icon="lock.svg"
              label="Masuk dengan akun Admin"
              color="bg-sky-700 text-white"
            />
            <LoginButton
              @click="handleLogin('administrator')"
              icon="mdi_account-tie.svg"
              label="Masuk dengan akun Staff"
              color="border border-gray-400 text-gray-500"
            />
          </div>
        </div>

        <p class="text-center mb-4 mt-6 text-[#175690] font-semibold">Atau</p>
        <!-- <div class="flex mt-6 gap-3 w-full">
          <ForgotPasswordButton />
          <GuideButton />
        </div> -->

        <RegisterButton />
        <a href="#" class="text-xs text-center mt-5 mb-16 text-[#175690]">
          Dengan masuk, Anda menyetujui
          <span class="font-semibold">Syarat dan Ketentuan & Kebijakan Privasi kami</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
