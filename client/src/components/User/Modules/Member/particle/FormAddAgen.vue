<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Jadikan Agen</h2>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700">Nama Member</label>
        <input
          type="text"
          :value="form.name"
          disabled
          class="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
        />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700">Nomor Identitas Member</label>
        <input
          type="text"
          :value="form.identityNumber"
          disabled
          class="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
        />
      </div>

      <!-- ✅ Dropdown untuk memilih Upline -->
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700">Pilih Upline</label>
        <select v-model="form.upline" class="w-full mt-1 px-3 py-2 border rounded-lg text-gray-700">
          <option value="" class="text-gray-700">Pilih upline member</option>
          <option v-for="agen in listAgen" :key="agen.id" :value="agen.id" class="text-gray-700">
            {{ agen.Member?.fullname || 'Tanpa Nama' }}
          </option>
        </select>
      </div>

      <!-- ✅ Dropdown untuk memilih Level Agen dari API -->
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700">Level Agen</label>
        <select
          v-model="form.levelAgen"
          class="w-full mt-1 px-3 py-2 border rounded-lg text-gray-700"
        >
          <option value="" class="text-gray-700">Pilih Level Agen</option>
          <option v-for="level in listLevel" :key="level.id" :value="level.name">
            {{ level.name }}
          </option>
        </select>
      </div>

      <div class="flex justify-end mt-4 space-x-2">
        <button @click="$emit('close')" class="px-4 py-2 text-gray-700 border rounded-lg">
          CANCEL
        </button>
        <PrimaryButton @click="submitForm">JADIKAN AGEN</PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, toRaw, onMounted } from 'vue'
import { daftarAgen as daftarAgenService, addAgen } from '@/service/agen'
import { daftarAgen as daftarLevelService } from '@/service/level_agen'
import PrimaryButton from "@/components/Button/PrimaryButton.vue"

// ✅ List Agen & Level Agen dari API
const listAgen = ref<Agen[]>([])
const listLevel = ref<LevelAgen[]>([])

// ✅ Fetch data Agen dari API
const fetchAgen = async () => {
  try {
    const response = await daftarAgenService()
    console.log('Response Agen:', response)
    listAgen.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Gagal fetch data Agen:', error)
  }
}

// ✅ Fetch data Level Agen dari API
const fetchLevel = async () => {
  try {
    const response = await daftarLevelService()
    console.log('Response Level Agen:', response)
    listLevel.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Gagal fetch data Level Agen:', error)
  }
}

// ✅ Panggil fungsi fetch saat komponen dimuat
onMounted(() => {
  fetchAgen()
  fetchLevel()
})

// ✅ Definisi interface untuk tipe data
interface Agen {
  id: number
  fullname: string
}

interface LevelAgen {
  id: number
  name: string
}

interface Member {
  id: number
  cabang_id: number
  fullname: string
  identity_number: string
  identity_type: string
}

// ✅ Props dari parent
const props = defineProps<{ isOpen: boolean; member: Member | null }>()
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: any): void
}>()

// ✅ Data form yang akan ditampilkan
const form = ref({
  name: '',
  identityNumber: '',
  upline: '',
  levelAgen: '',
})

// ✅ Watch untuk update data saat modal dibuka
watch(
  () => props.member,
  (newMember) => {
    if (newMember) {
      const rawMember = toRaw(newMember)
      console.log('Member updated:', rawMember)

      form.value.name = rawMember.fullname || ''
      form.value.identityNumber = rawMember.identity_number || ''
    }
  },
  { immediate: true },
)

// ✅ Function untuk submit form
const submitForm = async () => {
  // Pastikan data yang dikirim sesuai dengan format yang diinginkan
  const payload = {
    member_id: props.member?.id, // Gunakan ID member yang diterima dari props
    level_keagenan_id: listLevel.value.find((level) => level.name === form.value.levelAgen)?.id, // Dapatkan ID level berdasarkan nama
    upline_id: form.value.upline, // Upline yang dipilih
  }

  try {
    console.log('Data yang dikirim ke server:', payload)
    await addAgen(payload) // Kirim data ke server
    emit('submit', payload)

    // Reset form setelah submit
    form.value.upline = ''
    form.value.levelAgen = ''

    // Tutup modal
    emit('close')
  } catch (error) {
    console.error('Error detail:', {
      message: error.message,
      response: error.response?.data,
      config: error.config,
    })
    alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message))
  }
}
</script>
