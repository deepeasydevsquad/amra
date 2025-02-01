<template>
  <div>
    <p class="text-sky-700 font-bold mb-2">Data Pendaftar</p>
    <div class="space-y-3">
      <InputField type="email" placeholder="Email" />
      <InputField type="password" placeholder="Password" />
      <InputField type="password" placeholder="Konfirmasi Password" />
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
