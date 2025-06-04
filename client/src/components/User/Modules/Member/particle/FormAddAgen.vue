<template>
  <Form :form-status="showForm" :label="'Ubah Status Agen'" width="sm:w-full sm:max-w-md" @close="handleCancel" @cancel="handleCancel" :submitLabel="'JADIKAN AGEN'">
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-0 ">
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700">Nama Member</label>
        <input placeholder="Nama member" type="text" :value="form.name" disabled class="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-gray-400" />
      </div>
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700">Nomor Identitas</label>
        <input placeholder="Nama member" type="text" :value="form.identityNumber" disabled class="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-gray-400" />
      </div>
       <SelectField v-model="form.level_id" id="level_id" label="Level Keagenan" placeholder="Pilih Level Cabang" :error="errors.level_id" :options="levelAgen" />
    </div>
  </Form>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, ref, watch, toRaw, onMounted } from 'vue'
  // import { daftarAgen as daftarAgenService, addAgen } from '@/service/agen'
  // import { daftarAgen as daftarLevelService } from '@/service/level_agen'
  import Form from "@/components/Modal/Form.vue"
  import SelectField from "@/components/Form/SelectField.vue"

  interface Option {
    id: number
    name: string
  }

  interface Member {
    id: number
    cabang_id: number
    fullname: string
    identity_number: string
    identity_type: string
    level_id: number
  }

  interface ErrorFields {
    id: string
    cabang_id: string
    fullname: string
    identity_number: string
    identity_type: string
    level_id: string
  }

  // ✅ Props dari parent
  const props = defineProps<{ showForm: boolean; formData: Member, levelAgen: Option }>()

  const emit = defineEmits<{
    (e: 'save', data: FormData): void;
    (e: 'cancel'): void;
  }>();

  // ✅ Data form yang akan ditampilkan
  const form = ref({
    id: 0,
    name: '',
    identityNumber: '',
    level_id: 0,
  })

  const errors = ref<ErrorFields>({
    id: '',
    cabang_id: '',
    fullname: '',
    identity_number: '',
    identity_type: '',
    level_id: ''
  })

  // ✅ List Agen & Level Agen dari API
  // const listAgen = ref<Agen[]>([])
  // const listLevel = ref<LevelAgen[]>([])

  // ✅ Fetch data Agen dari API
  // const fetchAgen = async () => {
  //   try {
  //     const response = await daftarAgenService()
  //     console.log('Response Agen:', response)
  //     listAgen.value = Array.isArray(response.data) ? response.data : []
  //   } catch (error) {
  //     console.error('Gagal fetch data Agen:', error)
  //   }
  // }

  // ✅ Fetch data Level Agen dari API
  // const fetchLevel = async () => {
  //   try {
  //     const response = await daftarLevelService()
  //     console.log('Response Level Agen:', response)
  //     listLevel.value = Array.isArray(response.data) ? response.data : []
  //   } catch (error) {
  //     console.error('Gagal fetch data Level Agen:', error)
  //   }
  // }

  const handleCancel = (): void => {
    emit('cancel')
    errors.value = {
      id: '',
      cabang_id: '',
      fullname: '',
      identity_number: '',
      identity_type: '',
      level_id: ''
    };
  }

  // ✅ Panggil fungsi fetch saat komponen dimuat
  // onMounted(() => {
  //   fetchAgen()
  //   fetchLevel()
  // })

  // ✅ Definisi interface untuk tipe data
  interface Agen {
    id: number
    fullname: string
  }

  interface LevelAgen {
    id: number
    name: string
  }

  // const emit = defineEmits<{
  //   (event: 'close'): void
  //   (event: 'submit', payload: any): void
  // }>()

  watch(
    () => props.formData,
    (e) => {
      form.value.id = e.id
      form.value.level_id= e.level_id
      form.value.name= e.fullname
      form.value.identityNumber = e.identity_number
    },
    { immediate: true },
  )
</script>
