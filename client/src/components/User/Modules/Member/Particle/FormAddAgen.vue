<template>
  <Form :form-status="showForm" :label="'Ubah Status Agen'" width="sm:w-full sm:max-w-md" @close="handleCancel" @cancel="handleCancel"  @submit="handleSubmit" :submitLabel="'JADIKAN AGEN'">
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
  import { defineProps, defineEmits, ref, watch } from 'vue'
  import { daftarLevelAgen } from "@/service/member"
  import Form from "@/components/Modal/Form.vue"
  import SelectField from "@/components/Form/SelectField.vue"

  interface Option {
    id: number
    name: string
  }

  interface ErrorFields {
    id: string
    cabang_id: string
    fullname: string
    identity_number: string
    identity_type: string
    level_id: string
  }


  interface Option {
    id: number
    name: string
  }

  const levelAgen = ref<Option[]>([]);



  // ✅ Props dari parent
  const props = defineProps<{ showForm: boolean; memberId:number, memberName:string, memberIdentitas:string }>()

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

  const fetchLevelAgen = async () => {
    try {
      const response = await daftarLevelAgen()
      levelAgen.value = response.data
      form.value.id = props.memberId
      form.value.level_id= 0
      form.value.name= props.memberName
      form.value.identityNumber = props.memberIdentitas
    } catch (error) {
      console.error('Gagal fetch data level agen:', error)
    }
  }

    const validateForm = (): boolean => {

    errors.value = {
      id: '',
      cabang_id: '',
      fullname: '',
      identity_number: '',
      identity_type: '',
      level_id: ''
    }

    let isValid = true

    if (form.value.level_id == 0) {
      errors.value.level_id = 'Silahkan pilih salah satu level agen'
      isValid = false
    }

    return isValid
  }


  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return
    }

    // try {
    //   // const memberData = new FormData()
    //   // if( form.value.id ) {
    //   //   memberData.append('id', form.value.id.toString())
    //   // }
    //   // memberData.append('fullname', form.value.name)
    //   // memberData.append('identity_number', form.value.identityNumber)
    //   // memberData.append('identity_type', form.value.identityType)
    //   // memberData.append('gender', form.value.gender)
    //   // memberData.append('birth_place', form.value.birthplace)
    //   // memberData.append('birth_date', form.value.birthdate)
    //   // memberData.append('whatsapp_number', form.value.whatsapp)
    //   // memberData.append('password', form.value.password)
    //   // if (form.value.cabang_id) {
    //   //   memberData.append('division_id', form.value.cabang_id.toString())
    //   // }
    //   // if (form.value.photo) {
    //   //   memberData.append('photo', form.value.photo)
    //   // }

    //   // console.log("-----------------1");
    //   // console.log(form.value.id);
    //   // console.log("-----------------1");
    //   // if( form.value.id ) {

    //   //   await editMember(memberData)
    //   // }else{
    //   //   await addMember(memberData)
    //   // }


    //   // emit('save', form.value)

    //   // Emit event biar form tertutup
    //   emit('cancel')
    // } catch (error) {
    //   console.error('Gagal menyimpan data member:', error)
    // }
  }

  watch(
    () => props.showForm,
    (e) => {
      if(e == true ) {
        fetchLevelAgen();
      }
    },
    { immediate: false },
  )
</script>
