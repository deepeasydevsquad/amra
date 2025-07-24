<template>
  <Form :form-status="showForm" :label="'Form Upload File Pendukung'" class="text-sm" width="sm:w-1/2" @close="handleCancel" @cancel="handleCancel"  @submit="handleSubmit" :submitLabel="'UPLOAD FILE'">
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-0 px-1">
      <div class="space-y-4">
        <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead class="bg-gray-50">
            <tr>
              <th class="w-[45%] px-6 py-2 font-medium text-gray-900 text-center border-b border-t">Nama File</th>
              <th class="w-[45%] px-6 py-2 font-medium text-gray-900 text-center border-b border-t">File</th>
              <th class="w-[10%] px-6 py-2 font-medium text-gray-900 text-center border-b border-t">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="formData.length === 0">
              <tr>
                <td colspan="3" class="px-6 py-1 text-center text-gray-500">Tidak ada file yang diunggah</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(file, index) in formData" :key="index">
                <td class="px-4 pt-4 border-b text-center align-top">
                  <InputText label_status="false" v-model="file.title" label="Nama File" id="title" placeholder="Nama File" :error="errors.title" />
                </td>
                <td class="px-4 pt-4 border-b text-center">
                  <InputFile label_status="false" id="photo-upload" :error="errors.photo" @file-selected="handleFileUpload" accept=".jpg,.jpeg,.png" />
                </td>
                <td class="px-6 py-1 border-b text-center">
                  <DangerButton @click="deleteRow(index, formData.length )" title="Hapus Transaksi Paket">
                    <DeleteIcon></DeleteIcon>
                  </DangerButton>
                </td>
              </tr>
            </template>
          </tbody>
           <tfoot>
            <tr>
              <td class="py-3 px-0 border-b " colspan="3">
                 <div class="flex justify-end">
                    <PrimaryButton @click="addRow()">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      TAMBAH ROW
                    </PrimaryButton>
                 </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </Form>
</template>
<script setup lang="ts">
  import { defineProps, defineEmits, ref, watch } from 'vue'
  import Form from "@/components/Modal/Form.vue"
  import InputText from '@/components/Form/InputText.vue'
  import InputFile from '@/components/Form/InputFile.vue'
  import PrimaryButton from '@/components/Button/PrimaryButton.vue'
  import { error } from 'console'
  import alertify from 'alertifyjs'

  import DeleteIcon from '@/components/Icons/DeleteIcon.vue'
  import DangerButton from '@/components/Button/DangerButton.vue'

  interface FilePendukung {
    id?: number
    title: string
    filename: string
  }

  const props = defineProps<{ showForm: boolean }>()
  const errors = ref<Record<string, string>>({})
  const formData = ref<Partial<FilePendukung>[]>([])
  const emit = defineEmits<{
    (e: 'cancel'): void;
  }>();
  const handleCancel = (): void => {
    emit('cancel')
    errors.value = {};
  }

  function createEmptyForm(): FilePendukung {
    return {
      title: '',
      filename: '',
    }
  }

  const validateForm = (): boolean => {

    let isValid = true
    errors.value = {};

    // if (form.value.level_id == 0) {
    //   errors.value.level_id = 'Silahkan pilih salah satu level agen'
    //   isValid = false
    // }

    return isValid
  }

  const deleteRow = (index: number, length: number): void => {
    if( length <= 1 ) {
      alertify.error('Minimal harus ada satu file pendukung yang diunggah');
      return
    }
    formData.value.splice(index, 1)
  }

  const addRow = (): void => {
    formData.value.push(createEmptyForm())
  }


  const handleFileUpload = (event: Event): void => {
    // const input = event as HTMLInputElement
    // if (input) {
    //   const file = input

    //   // Validasi jenis file
    //   if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
    //     errors.value.photo = 'File harus berupa JPG, JPEG, atau PNG'
    //     fileName.value = ''
    //     return
    //   }

    //   // Validasi ukuran file (600KB = 614400 bytes)
    //   if (file.size > 614400) {
    //     errors.value.photo = 'Ukuran file maksimum 600KB'
    //     displayNotification('Ukuran file gambar maksimum 600KB', 'error')
    //     fileName.value = ''
    //     return
    //   }

    //   fileName.value = file.name
    //   formData.value.photo = file
    //   console.log(fileName.value)
    //   console.log(formData.value.photo)
    // }
  }


  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return
    }

    try {
      // const response = await makeAnAgen({ id : form.value.id, level: form.value.level_id, upline: form.value.upline_id } );
      // if(response.error) {
      //   displayNotification(response.error_msg, 'error');
      // }else{
      //   displayNotification(response.error_msg, 'success');
      // }
      emit('cancel')
    } catch (error) {
      console.error('Gagal menyimpan data member:', error)
    }
  }



  watch(
    () => props.showForm,
    async (val) => {
      if (val) {
        formData.value= [createEmptyForm()]
      }
    },
  )

</script>
