<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
    <p class="text-sky-700 font-bold mb-2">Masukkan Data Perusahaan</p>
    <div class="space-y-3">
      <InputField placeholder="Nama Perusahaan" />
      <InputField placeholder="Nomor WhatsApp" />
      <div class="flex">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l-lg focus:outline-none focus:shadow-outline whitespace-nowrap flex-none"
          type="submit"
        >
          Dapatkan OTP
        </button>
        <input
          class="w-full p-2 border border-gray-300 rounded-r-lg rounded-l-none"
          id="otp"
          type="text"
          placeholder="Masukkan OTP"
        />
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
