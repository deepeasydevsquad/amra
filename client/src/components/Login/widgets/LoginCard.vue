<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import LoginButton from '@/components/Login/particles/LoginButton.vue'
import ForgotPasswordButton from '@/components/Login/particles/ForgotPasswordButton.vue'
import GuideButton from '@/components/Login/particles/GuideButton.vue'
import RegisterButton from '@/components/Login/particles/RegisterButton.vue'
import api from '@/service/api' // Import service API


interface Login {
  type: string;
  company_code: string;
  username: string;
  password: string;
}

const inputLogin = ref<Partial<Login>>({
  type: 'administrator',
  company_code: '',
  username: '',
  password: ''
});


const isLoading = ref(true)

const handleLogin = async (type: string) => {

  console.log("VITE_APP_API_BASE_URL-----------");
  console.log(import.meta.env.VITE_APP_API_BASE_URL);
  console.log("VITE_APP_API_BASE_URL-----------");
  const API_BASE_URL = window.location.hostname + ':3001';
  console.log("API_BASE_URL-----------");
  console.log(API_BASE_URL);
  console.log("API_BASE_URL-----------");

  try {
    const baseUrl = window.location.protocol + '//' + window.location.hostname + ':3001';
    // Kirim data login ke server Express.js menggunakan axios
    const response = await axios.post(baseUrl + '/auth/login', {
      type: inputLogin.value.type,
      username: inputLogin.value.username,
      password: inputLogin.value.password,
    })

    // const response = await api.post("/daftar_akun/", param);
    // filter
    if (response.status === 200) {
      console.log('Login successful', response.data)

      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)

      window.location.href = '/user'
      // Tindakan setelah login berhasil, seperti redirect
    } else {
      console.log('Login failed', response.data)
      // Tindakan setelah login gagal
    }
  } catch (error) {
    console.error('An error occurred during login:', error)
  }
}

setTimeout(() => {
  if (isLoading.value) {
    isLoading.value = false
  }
}, 1000)
</script>

<template>
  <div class="loading-container" :style="{ display: isLoading ? 'block' : 'none' }">
    <div class="loading-spinner"></div>
  </div>
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
            <select v-model="inputLogin.type" class="w-full border rounded-md px-3 py-2 text-gray-700 bg-white" >
                <option class="text-gray-700" value="administrator">Administrator</option>
                <option class="text-gray-700" value="staff">Staff</option>
            </select>
            <p class="text-gray-500 text-xs mt-0 mb-10 italic">Pilih Salah Satu Tipe Akun Anda</p>
            <template v-if="inputLogin.type === 'staff'">
              <input v-model="inputLogin.company_code" type="text" placeholder="Kode Perusahaan" class="w-full p-2 border border-gray-300 rounded-lg input-field"/>
              <p class="text-gray-500 text-xs mt-0 mb-10 italic">
                Kode Perusahaan wajib diisi jika anda masuk sebagai Staff.
              </p>
            </template>
            <input
              v-model="inputLogin.username"
              type="text"
              placeholder="Username"
              class="w-full p-2 border border-gray-300 rounded-lg input-field"
            />
            <input
              v-model="inputLogin.password"
              type="password"
              placeholder="Password"
              class="w-full p-2 border border-gray-300 rounded-lg input-field"
            />
            <LoginButton
              @click="handleLogin('administrator')"
              icon="lock.svg"
              label="Masuk Akun Sekarang"
              color="bg-sky-700 text-white"
            />
          </div>
        </div>

        <p class="text-center mb-4 mt-6 text-[#175690] font-semibold">Atau</p>
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
