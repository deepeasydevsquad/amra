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
            type="number"
            v-model.number="skema[index].nominal"
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

const skema = ref([])

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

    await updateSkema(payload) // Pastikan API lo menerima JSON

    skema.value = []
    emit('update')
  } catch (error) {
    console.error('Gagal menyimpan skema:', error)
  }
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
