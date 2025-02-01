<template>
  <div>
    <p class="text-sky-700 font-bold mb-2">Masukkan Data Perusahaan</p>
    <div class="space-y-3">
      <InputField placeholder="Nama Perusahaan" />
      <InputField placeholder="Nomor WhatsApp" />
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
