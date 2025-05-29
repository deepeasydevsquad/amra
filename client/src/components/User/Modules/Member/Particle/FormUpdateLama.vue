<template>
  <Form :form-status="showForm" :label="'Tambah Member'" @close="handleCancel" @cancel="handleCancel" @submit="handleSubmit" width="sm:w-full sm:max-w-2xl" submitLabel="TAMBAH MEMBER">
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
      <SelectField v-model="form.cabang_id" id="cabang" label="Cabang" placeholder="Pilih Cabang" :error="errors.cabang_id" :options="cabangs" />
    </div>
    <!-- Upload Photo -->
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
      <!-- Upload Photo -->
      <InputFile label="Upload Photo Member" id="photo-upload" :error="errors.photo" @file-selected="handleFileUpload" accept=".jpg,.jpeg,.png"  />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6 ">
      <!-- Name Member -->
      <InputText v-model="form.name" label="Name Member" id="name" :error="errors.name" placeholder="Name Member" />
    </div>
    <!-- Gender, Birthplace, and Birthdate -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Nomor Identitas -->
      <InputText v-model="form.identityNumber" label="Nomor Identitas" id="identity-number" :error="errors.identityNumber" placeholder="Nomor Identitas" />
      <!-- Gender -->
      <SelectField v-model="form.gender" id="gender" label="Jenis Kelamin" placeholder="Pilih Jenis Kelamin" :error="errors.gender" :options="[{ id: '0', name: 'Pilih Gender' }, { id: 'laki_laki', name: 'Laki-laki' },{ id: 'perempuan', name: 'Perempuan' }]" />
      <!-- Tempat Lahir -->
      <InputText v-model="form.birthplace" label="Tempat Lahir" id="birthplace" :error="errors.birthplace" placeholder="Tempat Lahir" />
      <!-- Tanggal Lahir -->
      <InputDate v-model="form.birthdate" id="birthdate" label="Tanggal Lahir" :error="errors.birthdate" />
    </div>
    <!-- Email and WhatsApp -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Jenis Identitas -->
      <SelectField v-model="form.identityType" id="bank-list" label="Jenis Identitas" placeholder="Pilih Jenis Identitas" :error="errors.identityType"
        :options="[{ id: '0', name: 'Identitas' }, { id: 'ktp', name: 'KTP' },{ id: 'passport', name: 'PASSPORT' }]" />
        <!-- Nomor Whatsapp -->
      <InputText v-model="form.whatsapp" label="Nomor Whatsapp" id="whatsapp" :error="errors.whatsapp" placeholder="Nomor Whatsapp" note="Pastikan nomor yang terdaftar adalah nomor Whatsapp yang aktif. Nomor ini akan digunakan untuk menerima OTP."/>
    </div>
    <!-- Password dan Konfirmasi -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Password -->
      <InputPassword v-model="form.password" id="password" label="Password" placeholder="Password" :error="errors.password" note="Password hanya terdiri dari alpha numeric"/>
      <!-- Password Konfirmasi -->
      <InputPassword v-model="form.confirmPassword" id="confirm-password" label="Password Konfirmasi" placeholder="Password Konfirmasi" :error="errors.confirmPassword" note="Pastikan Password Konfirmasi sama dengan Password."/>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getMember, editMember } from '@/service/member'
import { daftarCabang } from '@/service/cabang'
import PrimaryButton from "@/components/Button/PrimaryButton.vue"

interface Cabang {
  id: number
  name: string
}

interface Member {
  id: number
  fullname: string
  identity_number: string
  identity_type: string
  bith_date: string
  bith_place: string
  gender: string
  whatsapp_number: string
  cabang_id?: number
  photo?: string
}

interface FormData {
  name: string
  identityNumber: string
  identityType: string
  gender: string
  birthplace: string
  birthdate: string
  whatsapp: string
  password: string
  confirmPassword: string
  cabang_id?: number
  photo?: File
}

interface ErrorFields {
  [key: string]: string | undefined
}

// const props = defineProps<{ member: Member | null, showForm:boolean }>()
defineProps<{ showForm: boolean, cabangs: Cabang[], member : Member, types: string  }>()

// const props = defineProps<{ showAddForm: boolean  }>()

// const members = ref<Cabang[]>([])
const cabangs = ref<Cabang[]>([])
const fileName = ref<string>('')
const errors = ref<ErrorFields>({})

const emit = defineEmits<{
  (e: 'save', data: FormData): void
  (e: 'cancel'): void
}>()

const form = ref<FormData>({
  name: '',
  identityNumber: '',
  identityType: '',
  gender: '',
  birthplace: '',
  birthdate: '',
  whatsapp: '',
  password: '',
  confirmPassword: '',
  cabang_id: undefined,
})

// Watch for changes in the member prop and update the form
// watch(
//   () => props.member,
//   (newMember) => {
//     if (newMember) {
//       form.value = {
//         id: newMember.id,
//         name: newMember.fullname,
//         identityNumber: newMember.identity_number,
//         identityType: newMember.identity_type,
//         gender: newMember.gender,
//         birthplace: newMember.birth_place,
//         birthdate: newMember.birth_date
//           ? new Date(newMember.birth_date).toISOString().split('T')[0]
//           : '', // Convert to "YYYY-MM-DD"
//         whatsapp: newMember.whatsapp_number,
//         password: '',
//         confirmPassword: '',
//         cabang_id: newMember.cabang_id,
//       }
//     }
//   },
//   { immediate: true },
// )

const handleFileUpload = (event: Event): void => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      errors.value.photo = 'File harus berupa JPG, JPEG, atau PNG'
      fileName.value = ''
      return
    }

    if (file.size > 614400) {
      errors.value.photo = 'Ukuran file maksimum 600KB'
      fileName.value = ''
      return
    }

    fileName.value = file.name
    form.value.photo = file
    errors.value.photo = undefined
  }
}

// const fetchCabang = async (): Promise<void> => {
//   try {
//     const response = await daftarCabang()
//     cabangs.value = response.data
//     console.log('Data cabang:', response.data)
//   } catch (error) {
//     console.error('Gagal fetch data cabang:', error)
//   }
// }

// const fetchMember = async (): Promise<void> => {
//   try {
//     const response = await getMember()
//     members.value = response.data
//     console.log('Data cabang:', response.data)
//   } catch (error) {
//     console.error('Gagal fetch data cabang:', error)
//   }
// }

const validateForm = (): boolean => {
  // Implement your validation logic here
  return true
}

const handleSubmit = async (): Promise<void> => {
  if (!form.value.id) {
    console.error('ID member tidak ditemukan')
    return
  }
  if (!validateForm()) {
    return
  }

  try {
    const memberData = new FormData()
    memberData.append('id', form.value.id.toString())
    memberData.append('fullname', form.value.name)
    memberData.append('identity_number', form.value.identityNumber)
    memberData.append('identity_type', form.value.identityType)
    memberData.append('gender', form.value.gender)
    memberData.append('birth_place', form.value.birthplace)
    memberData.append('birth_date', form.value.birthdate)
    memberData.append('whatsapp_number', form.value.whatsapp)
    memberData.append('password', form.value.password)
    if (form.value.cabang_id) {
      memberData.append('division_id', form.value.cabang_id.toString())
    }
    if (form.value.photo) {
      memberData.append('photo', form.value.photo)
    }

    console.log('📌 Data yang dikirim ke server:')
    for (const pair of memberData.entries()) {
      console.log(pair[0], pair[1])
    }

    await editMember(memberData)
    console.log('Member berhasil diupdate')

    emit('save', form.value)

    // Emit event biar form tertutup
    emit('cancel')
  } catch (error) {
    console.error('Gagal menyimpan data member:', error)
  }
}

const handleCancel = (): void => {
  emit('cancel')
}

// onMounted(() => {
//   fetchCabang()
//   fetchMember()
// })
</script>
