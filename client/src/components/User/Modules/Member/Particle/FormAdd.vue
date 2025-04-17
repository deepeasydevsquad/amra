<template>
  <h2 class="text-gray-700 text-center text-2xl font-semibold mb-6">Tambah Member</h2>

  <!-- Input Cabang (Hanya untuk Administrator) -->
  <div v-if="types === 'administrator'" class="mb-6">
    <label for="cabang" class="block text-sm font-medium text-gray-700 mb-2">Cabang</label>
    <select
      id="cabang"
      v-model="form.cabang_id"
      class="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      :class="{ 'border-red-500': errors.cabang_id }"
    >
      <option value="0" disabled>Pilih Cabang</option>
      <option v-for="cabang in cabangs" :key="cabang.id" :value="cabang.id">
        {{ cabang.name }}
      </option>
    </select>
    <p v-if="errors.cabang_id" class="text-red-500 text-sm mt-1">{{ errors.cabang_id }}</p>
  </div>

  <!-- Upload Photo -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
      <div class="flex items-center">
        <input
          type="file"
          class="hidden"
          id="photo-upload"
          @change="handleFileUpload"
          accept=".jpg,.jpeg,.png"
        />
        <label
          for="photo-upload"
          class="px-4 py-2 bg-gray-100 border text-gray-700 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
        >
          Choose File
        </label>
        <span class="ml-4 text-gray-500">{{ fileName || 'No file chosen' }}</span>
      </div>
      <p v-if="errors.photo" class="text-red-500 text-sm mt-1">{{ errors.photo }}</p>
      <p class="text-sm text-gray-500 mt-2">Ukuran maksimum: 600 KB. Tipe file: JPG, JPEG, PNG.</p>
    </div>

    <!-- Name Member -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name Member</label>
      <input
        type="text"
        id="name"
        v-model="form.name"
        class="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.name }"
        placeholder="Name Member"
      />
      <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
    </div>

    <!-- Nomor Identitas -->
    <div>
      <label for="identity-number" class="block text-sm font-medium text-gray-700 mb-2"
        >Nomor Identitas</label
      >
      <input
        type="text"
        id="identity-number"
        v-model="form.identityNumber"
        class="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.identityNumber }"
        placeholder="Nomor Identitas Member"
      />
      <p v-if="errors.identityNumber" class="text-red-500 text-sm mt-1">
        {{ errors.identityNumber }}
      </p>
    </div>
  </div>

  <!-- Gender, Birthplace, and Birthdate -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div>
      <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
      <select
        id="gender"
        v-model="form.gender"
        class="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.gender }"
      >
        <option value="" disabled selected>Pilih Jenis Kelamin</option>
        <option class="text-gray-700" value="laki_laki">Laki-laki</option>
        <option class="text-gray-700" value="perempuan">Perempuan</option>
      </select>
      <p v-if="errors.gender" class="text-red-500 text-sm mt-1">{{ errors.gender }}</p>
    </div>

    <div>
      <label for="birthplace" class="block text-sm font-medium text-gray-700 mb-2"
        >Tempat Lahir</label
      >
      <input
        type="text"
        id="birthplace"
        v-model="form.birthplace"
        class="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.birthplace }"
        placeholder="Tempat Lahir"
      />
      <p v-if="errors.birthplace" class="text-red-500 text-sm mt-1">{{ errors.birthplace }}</p>
    </div>

    <div>
      <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-2"
        >Tanggal Lahir</label
      >
      <input
        type="date"
        id="birthdate"
        v-model="form.birthdate"
        class="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.birthdate }"
      />
      <p v-if="errors.birthdate" class="text-red-500 text-sm mt-1">{{ errors.birthdate }}</p>
    </div>
  </div>

  <!-- Email and WhatsApp -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div>
      <label for="bank-list" class="block text-sm font-medium text-gray-700 mb-2"
        >Jenis Identitas</label
      >
      <select
        id="bank-list"
        v-model="form.identityType"
        class="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.bank }"
      >
        <option value="" disabled selected>Identitas</option>
        <option class="text-gray-700" value="ktp">KTP</option>
        <option class="text-gray-700" value="passport">PASSPORT</option>
      </select>
      <p v-if="errors.bank" class="text-red-500 text-sm mt-1">{{ errors.bank }}</p>
    </div>

    <div>
      <label for="whatsapp" class="block text-sm font-medium text-gray-700 mb-2"
        >Nomor Whatsapp</label
      >
      <input
        type="text"
        id="whatsapp"
        v-model="form.whatsapp"
        class="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.whatsapp }"
        placeholder="Nomor Whatsapp"
      />
      <p v-if="errors.whatsapp" class="text-red-500 text-sm mt-1">{{ errors.whatsapp }}</p>
      <p class="text-xs text-gray-500 mt-2">
        Pastikan nomor yang terdaftar adalah nomor Whatsapp yang aktif. Nomor ini akan digunakan
        untuk menerima OTP.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <!-- Password -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
      <input
        type="password"
        id="password"
        v-model="form.password"
        class="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.password }"
        placeholder="Password"
      />
      <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      <p class="text-sm text-gray-500 mt-2">Password hanya terdiri dari alpha numeric.</p>
    </div>

    <!-- Password Konfirmasi -->
    <div>
      <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
        Password Konfirmasi
      </label>
      <input
        type="password"
        id="confirm-password"
        v-model="form.confirmPassword"
        class="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.confirmPassword }"
        placeholder="Password Konfirmasi"
      />
      <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">
        {{ errors.confirmPassword }}
      </p>
    </div>
  </div>
  <!-- Action Buttons -->
  <div class="flex justify-end gap-4">
    <button
      type="button"
      @click="handleCancel"
      class="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
    >
      CANCEL
    </button>
    <button
      type="submit"
      @click="handleSubmit"
      class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      SIMPAN
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMember, addMember, getType } from '@/service/member'
import { daftarCabang } from '@/service/cabang'

// Definisikan tipe untuk data member
interface Member {
  id: number
  fullname: string
  identity_number: string
  gender: string
  whatsapp_number: string
  tipe: string // Tipe pengguna (administrator atau staff)
}

// Definisikan tipe untuk cabang
interface Cabang {
  id: number
  name: string
}

// Definisikan tipe untuk form yang sesuai dengan semua field di template
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
  cabang_id?: number // Menggunakan ID cabang, bukan nama cabang
  photo?: File
}

// Definisikan tipe untuk error validasi
interface ErrorFields {
  name?: string
  identityNumber?: string
  identityType: string
  gender?: string
  birthplace?: string
  birthdate?: string
  whatsapp?: string
  password?: string
  confirmPassword?: string
  cabang_id?: string
  photo?: string
}

const emit = defineEmits<{
  (e: 'save', data: FormData): void
  (e: 'cancel'): void
}>()

const types = ref<string[]>([])
const cabangs = ref<Cabang[]>([])
const members = ref<Member[]>([])
const fileName = ref<string>('')
const errors = ref<ErrorFields>({})

const typeUser = async () => {
  try {
    const response = await getType()
    types.value = response
    console.log('Data dari API:', JSON.stringify(types.value, null, 2)) // Debu
  } catch (error) {
    console.error('Gagal fetch data type:', error)
  }
}

// Data form dengan semua field yang digunakan di template
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
  cabang_id: 0,
})

// Handle file upload
const handleFileUpload = (event: Event): void => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]

    // Validasi jenis file
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      errors.value.photo = 'File harus berupa JPG, JPEG, atau PNG'
      fileName.value = ''
      return
    }

    // Validasi ukuran file (600KB = 614400 bytes)
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

// Fungsi untuk mengambil data cabang
const fetchCabang = async (): Promise<void> => {
  try {
    const response = await daftarCabang()
    cabangs.value = response.data
    console.log('Data cabang:', response.data)
  } catch (error) {
    console.error('Gagal fetch data cabang:', error)
  }
}

// Fungsi untuk mengambil data member
const fetchMember = async (): Promise<void> => {
  try {
    const response = await getMember()
    members.value = response.data as Member[]
    console.log('Data member:', response.data)
  } catch (error) {
    console.error('Gagal fetch data member:', error)
  }
}

// Validasi form
const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  // Validasi cabang (jika user adalah administrator)
  if (members.value[0]?.tipe === 'administrator' && !form.value.cabang_id) {
    errors.value.cabang_id = 'Silakan pilih cabang'
    isValid = false
  }

  // Validasi nama
  if (!form.value.name.trim()) {
    errors.value.name = 'Nama tidak boleh kosong'
    isValid = false
  }

  // Validasi nomor identitas
  if (!form.value.identityNumber.trim()) {
    errors.value.identityNumber = 'Nomor identitas tidak boleh kosong'
    isValid = false
  }

  // Validasi jenis kelamin
  if (!form.value.gender) {
    errors.value.gender = 'Silakan pilih jenis kelamin'
    isValid = false
  }

  // Validasi tempat lahir
  if (!form.value.birthplace.trim()) {
    errors.value.birthplace = 'Tempat lahir tidak boleh kosong'
    isValid = false
  }

  // Validasi tanggal lahir
  if (!form.value.birthdate) {
    errors.value.birthdate = 'Tanggal lahir tidak boleh kosong'
    isValid = false
  }

  // Validasi nomor WhatsApp
  if (!form.value.whatsapp.trim()) {
    errors.value.whatsapp = 'Nomor WhatsApp tidak boleh kosong'
    isValid = false
  } else if (!/^\d+$/.test(form.value.whatsapp)) {
    errors.value.whatsapp = 'Nomor WhatsApp harus berupa angka'
    isValid = false
  }

  // Validasi password
  if (!form.value.password) {
    errors.value.password = 'Password tidak boleh kosong'
    isValid = false
  } else if (!/^[a-zA-Z0-9]+$/.test(form.value.password)) {
    errors.value.password = 'Password hanya boleh berisi alpha numeric'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password minimal 6 karakter'
    isValid = false
  }

  // Validasi konfirmasi password
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Konfirmasi password tidak boleh kosong'
    isValid = false
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Konfirmasi password tidak cocok'
    isValid = false
  }

  return isValid
}

// Fungsi untuk menyimpan data member
// Fungsi untuk menyimpan data member
const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  try {
    const memberData = new FormData()
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

    console.log('Data yang dikirim ke server:', memberData)

    await addMember(memberData)
    console.log('Member berhasil ditambahkan')

    emit('save', form.value)

    // Emit event biar form tertutup
    emit('cancel')
  } catch (error) {
    console.error('Gagal menyimpan data member:', error)
  }
}

// Fungsi untuk membatalkan dan menutup form
const handleCancel = (): void => {
  emit('cancel')
}

// Jalankan fetchMember dan fetchCabang saat komponen dimount
onMounted(() => {
  fetchMember()
  fetchCabang()
  typeUser()
  // Ini isinya: "administrator"
})
</script>
