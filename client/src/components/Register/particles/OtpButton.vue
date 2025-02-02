<template>
  <div>
    <label for="whatsappNumber">Nomor WhatsApp</label>
    <input type="text" id="whatsappNumber" v-model="whatsappNumber" />

    <button @click="requestOtp">Dapatkan OTP</button>

    <label for="otp">Masukkan OTP</label>
    <input type="text" id="otp" v-model="otp" />

    <button @click="submitOtp">Submit OTP</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      whatsappNumber: '',
      otp: '',
    }
  },
  methods: {
    requestOtp() {
      console.log('Minta OTP untuk nomor:', this.whatsappNumber)
    },
    submitOtp() {
      console.log('OTP yang dimasukkan:', this.otp)
    },
  },
}
</script>

<style scoped>
/* Tambahkan gaya Anda di sini */
</style>
