<template>
  <Form :form-status="isModalOpen" :label="'Update Data Pengguna'" width="sm:w-full sm:max-w-md" @close="closeModal" @cancel="closeModal"  @submit="handleSubmit" :submitLabel="'UPDATE PENGGUNA'">
    <div class="p-0">
        <div class="mb-0">
          <label class="block text-sm font-medium text-gray-700">Grup</label>
          <select
            v-model="selectedGrup"
            class="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null">Pilih Grup</option>
            <option v-for="grup in grups" :key="grup.id" :value="grup.id">
              {{ grup.name }}
            </option>
          </select>
        </div>
      </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue'
// import { daftarGrup } from '@/service/grup'
import { editPengguna, daftarPengguna, getGrup } from '@/service/pengguna'
import Form from "@/components/Modal/Form.vue"

// Interfaces
interface Grup {
  id: number
  cabang_id: number
  name: string
}

interface Pengguna {
  id: number
  grup_id: number
}

// Refs
const grups = ref<Grup[]>([])
const penggunaList = ref<Pengguna[]>([])
const selectedGrup = ref<number | null>(null)

const fetchPengguna = async () => {
  try {
    const response = await daftarPengguna()
    if (response.success && response.data) {
      penggunaList.value = response.data
    }
  } catch (error) {
    console.error('❌ Gagal fetch data grup:', error)
  }
}

// Props dari parent
const props = defineProps({
  isModalOpen: Boolean,
  idPengguna: Number,
})

// Debug props.penggunaToUpdate
// console.log('📝 props.penggunaToUpdate:', props.penggunaToUpdate)

// Emit event ke parent
const emit = defineEmits(['update:isModalOpen'])

// Fetch data grup
const fetchGrup = async () => {
  try {
    const response = await getGrup()
    if (response.error == false && response.data) {
      grups.value = response.data
      console.log('✅ Grup Loaded:', grups.value)
    }
  } catch (error) {
    console.error('❌ Gagal fetch data grup:', error)
  }
}

// Auto-select grup saat modal dibuka
// watch(
//   [() => props.penggunaToUpdate, grups],
//   ([pengguna, grupList]) => {
//     if (pengguna && grupList.length > 0) {
//       const grupDitemukan = grupList.find((grup) => grup.name === pengguna.Grup?.name)
//       selectedGrup.value = grupDitemukan ? grupDitemukan.id : null
//       console.log('✅ Grup Selected:', selectedGrup.value)
//     }
//   },
//   { immediate: true },
// )

// Fungsi untuk menutup modal
const closeModal = (): void => {
  emit('update:isModalOpen', false)
}

// Fungsi untuk handle submit
const handleSubmit = async (): Promise<void> => {
  if (!selectedGrup.value) {
    alert('Silakan pilih grup!')
    return
  }

  if (!props.penggunaToUpdate || !props.penggunaToUpdate.id) {
    alert('Data pengguna tidak valid!')
    return
  }

  try {
    // Buat objek FormData
    const formData = new FormData()

    // Tambahkan data ke FormData
    formData.append('id', props.penggunaToUpdate.id.toString())
    formData.append('grup_id', selectedGrup.value.toString())

    // Debugging: Tampilkan isi FormData
    for (const [key, value] of formData.entries()) {
      console.log(key, value)
    }

    // Panggil fungsi editPengguna dengan FormData
    const response = await editPengguna(formData)

    if (response.success) {
      emit('pengguna-updated')
      closeModal()
    } else {
      alert('Gagal mengupdate data: ' + response.message)
    }
  } catch (error) {
    console.error('❌ Gagal mengupdate data:', error)
    alert('Terjadi kesalahan saat mengupdate data.')
  }
}

// Fetch data saat komponen dimount
// onMounted(async () => {
//   await fetchGrup()
//   await fetchPengguna()
// })


watch(
  () => props.isModalOpen,
  async (newDefaultValue) =>  {
    if (newDefaultValue) {
      await fetchPengguna();

      // emit('update:modelValue', newDefaultValue);
      // // centang checkboxnya
      // props.options.forEach((option) => {
      //   if (newDefaultValue.includes(option[idField].toString())) {
      //     toggleOption(option);
      //   }
      // });
    }
  },
  { immediate: true }
);
</script>
