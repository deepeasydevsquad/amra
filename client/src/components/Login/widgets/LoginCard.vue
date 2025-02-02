<template>
  <div class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="bg-white shadow-lg rounded-lg w-full flex">
      <!-- Bagian Kiri -->
      <div class="w-1/2 rounded-l-lg">
        <img src="@/assets/images/Login/bg.png" alt="Haji Image" class="object-cover w-full h-full" />
      </div>

      <!-- Bagian Kanan -->
      <div class="ml-6 p-8 flex flex-col justify-center items-center max-w-2lg">
        <div class="flex flex-col justify-center w-full max-w-sm mb-2">
          <h2 class="text-3xl font-bold text-center mb-10 text-[#175690]">Selamat Datang</h2>
          <LoginButton
            icon="lock.svg"
            label="Masuk dengan akun Admin"
            color="bg-sky-700 text-white"
          />
          <LoginButton
            icon="mdi_account-tie.svg"
            label="Masuk dengan akun Staff"
            color="border border-gray-400 text-gray-500"
          />
        </div>

        <a href="#" class="text-xs text-center mb-16 text-[#175690] ">
          Dengan masuk, Anda menyetujui
          <span class="font-semibold">Syarat dan Ketentuan & Kebijakan Privasi kami</span>
        </a>

        <div class="flex mt-6 gap-3 w-full">
          <ForgotPasswordButton />
          <GuideButton />
        </div>

        <RegisterButton />
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginButton from "@/components/Login/particles/LoginButton.vue";
import ForgotPasswordButton from "@/components/Login/particles/ForgotPasswordButton.vue";
import GuideButton from "@/components/Login/particles/GuideButton.vue";
import RegisterButton from "@/components/Login/particles/RegisterButton.vue";
</script>

<style scoped>
/* Additional styles if needed */
</style>

