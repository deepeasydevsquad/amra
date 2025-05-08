<template>
  <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-gray-700">
      <div class="mb-4">
        <h2 class="text-xl font-semibold">Update Skema</h2>
      </div>

      <div class="flex font-semibold mb-2 border-b pb-1">
        <div class="w-16">TERM</div>
        <div class="flex-1">Nominal</div>
      </div>

      <div class="space-y-3 max-h-[300px] overflow-y-auto">
        <div v-for="(item, index) in skema" :key="item.id" class="flex items-center gap-4">
          <label class="w-16 font-medium text-center">{{ item.term }}</label>
          <input
            type="text"
            :value="formatIDR(item.nominal)"
            @input="onInputNominal($event, index)"
            class="flex-1 border rounded px-3 py-2"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button class="px-4 py-2 rounded border" @click="handleClose">Batal</button>
        <button @click="handleSave" class="px-4 py-2 rounded bg-blue-600 text-white">Simpan</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getSkema, updateSkema } from '@/service/daftar_pinjaman'

const props = defineProps<{
  peminjamanId: number
}>()

const emit = defineEmits(['close', 'update'])

const skema = ref<Array<{ id: number; term: string; nominal: number }>>([])

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

    await updateSkema(payload)
    skema.value = []
    emit('update')
  } catch (error) {
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
