<template>
  <div class="max-w-md mx-auto p-4 bg-white rounded-lg">
    <p class="text-sky-700 font-bold mb-2">Data Pendaftar</p>
    <div class="space-y-3">
      <InputField v-model="InputsValue" type="email" placeholder="Email" />
      <InputField v-model="InputsValue" type="password" placeholder="Password" />
      <InputField v-model="InputsValue" type="password" placeholder="Konfirmasi Password" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputField from '../particles/InputField.vue'

const InputsValue = ref('')
</script>

<style scoped>
/* Tidak ada CSS tambahan */
</style>
