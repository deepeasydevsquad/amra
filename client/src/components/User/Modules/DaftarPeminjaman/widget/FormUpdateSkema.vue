<template>
  <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl  text-gray-700">
      <div class="mb-4">
        <h2 class="text-xl font-semibold">Update Skema</h2>
      </div>
      <div class="max-h-[50vh] overflow-y-auto">
         <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead class="bg-white">
            <tr>
              <th class="w-[15%] px-6 py-2 font-bold text-gray-900 text-center border ">Term</th>
              <th class="w-[45%] px-6 py-2 font-bold text-gray-900 text-center border ">Amount</th>
              <th class="w-[40%] px-6 py-2 font-bold text-gray-900 text-center border ">Tanggal Jatuh tempo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in skema" :key="item.id">
              <td class="py-2 border-b text-center">{{ item.term }}</td>
              <td class="py-2 border-b text-center">
                <input type="text" :value="formatIDR(item.nominal)" @input="onInputNominal($event, index)" class="flex-1 border rounded px-3 py-2" />
              </td>
              <td class="py-2 border-b text-center">
                <input type="date" :value="item.duedate"  @input="onInputDueDate($event, index)"  class="flex-1 border rounded px-3 py-2" />
              </td>
            </tr>
          </tbody>

        </table>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <button class="px-4 py-2 rounded border" @click="handleClose">Batal</button>
        <PrimaryButton @click="handleSave" >Simpan Skema</PrimaryButton>
      </div>
    </div>
  </div>

    <Notification
      :showNotification="showNotification"
      :notificationType="notificationType"
      :notificationMessage="notificationMessage"
      @close="showNotification = false"
    />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getSkema, updateSkema } from '@/service/daftar_pinjaman'
import PrimaryButton from "@/components/Button/PrimaryButton.vue"
import Notification from '@/components/User/Modules/DaftarPeminjaman/Particle/Notification.vue'

const props = defineProps<{peminjamanId: number}>()

// Notifikasi State
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')
const timeoutId = ref<number | null>(null)
const searchTimeout = ref<number | null>(null)

const emit = defineEmits(['close', 'update'])

const skema = ref<Array<{ id: number; term: string; nominal: number, duedate: string }>>([])

const fetchSkema = async () => {
  try {
    const res = await getSkema(props.peminjamanId)
    skema.value = res.data
  } catch (err) {
    console.error('Failed to fetch skema:', err)
  }
}

const handleSave = async () => {
  try {
    const payload = {
      peminjaman_id: props.peminjamanId,
      updatedSkema: skema.value,
    }

    console.log('Payload preview:', payload)

    await updateSkema(payload);

    skema.value = []
    emit('update')
  } catch (error) {
    showNotification.value = true;
    notificationMessage.value = error.response.data.error_msg;
    notificationType.value = 'error';
    console.error('Gagal menyimpan skema:', error)
  }
}

// Format angka ke format IDR
const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0)
}

// Handle input manual
const onInputNominal = (event: Event, index: number) => {
  const rawValue = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
  const numericValue = parseInt(rawValue, 10) || 0
  skema.value[index].nominal = numericValue
}

const onInputDueDate = (event: Event, index: number) => {
  const rawValue = (event.target as HTMLInputElement).value
  skema.value[index].duedate = rawValue
}

// Re-fetch data setiap kali peminjamanId berubah
watch(
  () => props.peminjamanId,
  () => {
    fetchSkema()
  },
  { immediate: true },
)

const handleClose = () => {
  skema.value = [] // Reset form
  emit('close') // Tutup modal
}
</script>
