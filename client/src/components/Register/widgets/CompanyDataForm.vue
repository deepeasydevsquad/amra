<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
    <p class="text-sky-700 font-bold mb-2">Masukkan Data Perusahaan</p>
    <div class="space-y-3">
      <InputField placeholder="Nama Perusahaan" />
      <InputField placeholder="Nomor WhatsApp" />
      <div class="flex items-center space-x-2 flex-wrap">
        <input
          class="flex-1 border border-gray-300 rounded-l-md px-3 py-2"
          placeholder="Kode OTP"
        />
        <button
          class="border border-gray-300 rounded-md px-4 py-2 bg-sky-700 text-white hover:bg-sky-800 transition duration-300 ease-in-out w-full sm:w-auto mt-2 sm:mt-0"
        >
          Dapatkan OTP
        </button>
      </div>

      <InputField placeholder="Nomor Telpon Perusahaan" />
    </div>
  </div>
</template>

<script>
import InputField from '../particles/InputField.vue'

export default {
  components: {
    InputField,
  },
}
</script>

<style scoped>
/* Tidak ada CSS tambahan */
</style>
