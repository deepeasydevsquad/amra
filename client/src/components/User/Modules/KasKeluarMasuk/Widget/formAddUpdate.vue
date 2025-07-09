<template>
  <Form :form-status="showForm" :label="form.id === 0 ? 'Tambah Member' : 'Edit Member'" @close="handleCancel" @cancel="handleCancel" @submit="handleSubmit" width="sm:w-full sm:max-w-xl" :submitLabel="form.id === 0 ? 'TAMBAH MEMBER' : 'PERBAHARUI MEMBER'">
    <!-- <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
      <SelectField v-model="form.cabang_id" id="cabang" label="Cabang" placeholder="Pilih Cabang" :error="errors.cabang_id" :options="cabangs" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
      <InputFile label="Upload Photo Member" id="photo-upload" :error="errors.photo" @file-selected="handleFileUpload" accept=".jpg,.jpeg,.png"  />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
      <InputText v-model="form.name" label="Name Member" id="name" :error="errors.name" placeholder="Name Member" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <InputText v-model="form.identityNumber" label="Nomor Identitas" id="identity-number" :error="errors.identityNumber" placeholder="Nomor Identitas" />
      <SelectField v-model="form.gender" id="gender" label="Jenis Kelamin" placeholder="Pilih Jenis Kelamin" :error="errors.gender" :options="[{ id: '0', name: 'Pilih Gender' }, { id: 'laki_laki', name: 'Laki-laki' },{ id: 'perempuan', name: 'Perempuan' }]" />
      <InputText v-model="form.birthplace" label="Tempat Lahir" id="birthplace" :error="errors.birthplace" placeholder="Tempat Lahir" />
      <InputDate v-model="form.birthdate" id="birthdate" label="Tanggal Lahir" :error="errors.birthdate" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <SelectField v-model="form.identityType" id="tipe-identitas" label="Jenis Identitas" placeholder="Pilih Jenis Identitas" :error="errors.identityType"
        :options="[{ id: '0', name: 'Identitas' }, { id: 'ktp', name: 'KTP' },{ id: 'passport', name: 'PASSPORT' }]" />
      <InputText v-model="form.whatsapp" label="Nomor Whatsapp" id="whatsapp" :error="errors.whatsapp" placeholder="Nomor Whatsapp" note="Pastikan nomor yang terdaftar adalah nomor Whatsapp yang aktif. Nomor ini akan digunakan untuk menerima OTP."/>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <InputPassword v-model="form.password" id="password" label="Password" placeholder="Password" :error="errors.password" note="Password hanya terdiri dari alpha numeric"/>
      <InputPassword v-model="form.confirmPassword" id="confirm-password" label="Password Konfirmasi" placeholder="Password Konfirmasi" :error="errors.confirmPassword" note="Pastikan Password Konfirmasi sama dengan Password."/>
    </div> -->
  </Form>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  import Form from "@/components/Modal/Form.vue"


  interface ErrorFields {
    tanggal?: string
    keterangan?: string
    ref: string
  }


  const emit = defineEmits<{
    (e: 'save'): void
    (e: 'cancel'): void
  }>()

  const errors = ref<ErrorFields>({
    tanggal: '',
    keterangan: '',
    ref: '',
  })

  const handleCancel = (): void => {
    emit('cancel')
    errors.value = {};
    // errors.value = {
    //   name: '',
    //   identityNumber: '',
    //   identityType: '',
    //   gender: '',
    //   birthplace: '',
    //   birthdate: '',
    //   whatsapp: '',
    //   password: '',
    //   confirmPassword: '',
    //   cabang_id:'',
    //   photo: '',
    //   bank:''
    // };
  }
</script>
