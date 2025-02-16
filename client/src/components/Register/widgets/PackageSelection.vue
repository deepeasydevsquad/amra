<template>
  <div class="max-w-md mx-auto p-4 bg-white rounded-lg">
    <p class="text-sky-700 font-bold mb-2">Pilih Paket Anda</p>
    <div class="grid grid-cols-1 gap-3">
      <RadioButton
        v-model="selectedPackage"
        name="paket"
        :value="subscriptionPrice"
        :label="`Paket Premium (12 Bulan) - Rp ${subscriptionPrice}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue'
import axios from 'axios'
import RadioButton from '../particles/RadioButton.vue'

const emit = defineEmits(['update:modelValue'])

const subscriptionPrice = ref('Loading...')
const selectedPackage = ref('1') // Default ke "1"

// ✅ Fungsi mengambil harga dari backend
const fetchSubscriptionPrice = async () => {
  try {
    const response = await axios.get('http://localhost:3001/ambil_harga')
    console.log('✅ Harga langganan dari API:', response.data.harga_langganan)

    subscriptionPrice.value = response.data.harga_langganan
    selectedPackage.value = response.data.harga_langganan
    emit('update:modelValue', response.data.harga_langganan) // ✅ Kirim ke parent
  } catch (error) {
    console.error('❌ Gagal mengambil harga langganan:', error)
    subscriptionPrice.value = 'N/A'
  }
}

onMounted(() => {
  fetchSubscriptionPrice()
})
</script>
