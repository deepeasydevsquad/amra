<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { updatePengaturan, getPengaturan } from '@/service/pengaturan'

interface Company {
  id: number
  code: string
  kurs: string
  logo: string
  company_name: string
  email: string
  whatsapp_company_number: string
  invoice_logo: string | null
  invoice_title: string | null
}

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const company = ref<Company | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const logoFile = ref<File | null>(null)
const invoiceLogoFile = ref<File | null>(null)
const iconFile = ref<File | null>(null)

const fetchCompanyData = async () => {
  try {
    isLoading.value = true
    const response = await getPengaturan()
    if (response?.company) {
      company.value = response.company
    } else {
      throw new Error('Data perusahaan tidak ditemukan!')
    }
  } catch (error) {
    errorMessage.value = 'Gagal mengambil data perusahaan. Coba lagi nanti.'
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  const errors: Record<string, string> = {}
  if (!company.value) return errors

  const validCurrencies = ['IDR', 'SAR', 'USD']
  if (!validCurrencies.includes(company.value.kurs)) {
    errors.kurs = 'Mata uang hanya boleh IDR, SAR, atau USD'
  }

  if (!company.value.company_name?.trim()) {
    errors.company_name = 'Nama perusahaan wajib diisi'
  }

  if (!company.value.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Format email tidak valid'
  }

  if (!company.value.whatsapp_company_number?.match(/^\d+$/)) {
    errors.whatsapp = 'Nomor WhatsApp harus berupa angka'
  }

  if (!company.value.invoice_title?.trim()) {
    errors.invoice_title = 'Header invoice wajib diisi'
  }

  return errors
}

const validateFile = (file: File, type: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const validExtensions = {
      logo: 'png',
      invoice_logo: 'png',
      icon: 'ico',
    }

    const sizeLimit = {
      logo: 1024 * 1024, // 1MB
      invoice_logo: 1024 * 1024, // 1MB
      icon: 500 * 1024, // 500KB
    }

    const dimensions = {
      logo: { width: 300, height: 80 },
      invoice_logo: { width: 270, height: 80 },
      icon: { width: 48, height: 48 }, // 🔥 Tambahkan validasi dimensi icon
    }

    // ✅ 1. Validasi ukuran file
    if (file.size > sizeLimit[type]) {
      return resolve(`Ukuran file maksimal ${sizeLimit[type] / 1024}KB`)
    }

    // ✅ 2. Validasi ekstensi file (berdasarkan nama file)
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    if (fileExt !== validExtensions[type]) {
      return resolve(`File harus berformat .${validExtensions[type]}`)
    }

    // ✅ 3. Validasi dimensi gambar (termasuk icon sekarang!)
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      if (img.width !== dimensions[type].width || img.height !== dimensions[type].height) {
        return resolve(`Dimensi harus ${dimensions[type].width}x${dimensions[type].height} px`)
      }
      resolve(null) // ✅ Tidak ada error
    }
    img.onerror = () => resolve('File gambar tidak valid')
  })
}

const handleFileUpload = async (event: Event, type: string) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  // 🛑 Tunggu hasil validasi sebelum lanjut
  const error = await validateFile(file, type)

  if (error) {
    alert(error)
    target.value = '' // Jika ada error, hentikan proses
    return
  }

  // Jika valid, simpan file
  if (type === 'logo') logoFile.value = file
  if (type === 'invoice_logo') invoiceLogoFile.value = file
  if (type === 'icon') iconFile.value = file
}

const updateCompanyData = async () => {
  if (!company.value) return

  const errors = validateForm()
  if (Object.keys(errors).length > 0) {
    alert(Object.values(errors).join('\n'))
    return
  }

  const formData = new FormData()
  formData.append('company_name', company.value.company_name)
  formData.append('kurs', company.value.kurs)
  formData.append('email', company.value.email)
  formData.append('whatsapp_company_number', company.value.whatsapp_company_number)
  formData.append('invoice_title', company.value.invoice_title || '')

  if (logoFile.value) formData.append('logo', logoFile.value)
  if (invoiceLogoFile.value) formData.append('invoice_logo', invoiceLogoFile.value)
  if (iconFile.value) formData.append('icon', iconFile.value)

  console.log('Data yang dikirim:', Object.fromEntries(formData.entries())) // Debug data

  try {
    const response = await updatePengaturan(formData)
    console.log('Response dari server:', response) // Debug response

    alert('Pengaturan berhasil diperbarui!')
  } catch (error) {
    console.error('Error saat update data:', error)
    alert('Terjadi kesalahan saat memperbarui pengaturan.')
  }
}

onMounted(fetchCompanyData)
</script>

<template>
  <div class="p-6 bg-white min-h-screen">
    <div v-if="isLoading" class="text-center text-gray-600">Loading...</div>
    <div v-else-if="errorMessage" class="text-center text-red-600">{{ errorMessage }}</div>

    <div v-else-if="company" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-gray-600 font-semibold mb-1">Logo Surat Perusahaan</label>

        <div class="border p-4 rounded-md flex items-center justify-center">
          <img
            v-if="company?.logo"
            :src="`${BASE_URL}/uploads/pengaturan/${company.logo}`"
            alt="Logo"
            class="h-20"
          />

          <up v-else>Loading logo...</up>
        </div>
        <input
          type="file"
          accept=".png"
          class="mt-2 w-full border p-2 rounded-md text-sm text-gray-900"
          @change="handleFileUpload($event, 'logo')"
        />
        <p class="mt-1 text-sm text-gray-500">
          Format: <span class="font-semibold">.png</span> | Maks:
          <span class="font-semibold">1MB</span> | Dimensi:
          <span class="font-semibold">300x80 px</span>
        </p>
      </div>

      <div>
        <label class="block text-gray-600 font-semibold mb-1">Nama Perusahaan</label>
        <input
          type="text"
          v-model="company.company_name"
          class="w-full border p-2 rounded-md text-gray-700"
        />
      </div>
    </div>

    <div v-if="company" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div>
        <label class="block text-gray-600 font-semibold mb-1">Kurs</label>
        <select v-model="company.kurs" class="w-full border p-2 rounded-md text-gray-700">
          <option value="IDR">IDR</option>
          <option value="SAR">SAR</option>
          <option value="USD">USD</option>
        </select>
      </div>
      <div>
        <label class="block text-gray-600 font-semibold mb-1">Email Perusahaan</label>
        <input
          type="email"
          v-model="company.email"
          class="w-full border p-2 rounded-md text-gray-700"
        />
      </div>
    </div>

    <div v-if="company" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div>
        <label class="block text-gray-600 font-semibold mb-1">Nomor Whatsapp</label>
        <input
          type="text"
          v-model="company.whatsapp_company_number"
          class="w-full border p-2 rounded-md text-gray-700"
        />
      </div>
      <div>
        <label class="block text-gray-600 font-semibold mb-1">Header Invoice</label>
        <input
          type="text"
          v-model="company.invoice_title"
          class="w-full border p-2 rounded-md text-gray-700"
        />
      </div>
    </div>

    <div v-if="company" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div>
        <label class="block text-gray-600 font-semibold mb-1">Logo Invoice</label>
        <input
          type="file"
          accept=".png"
          class="w-full border p-2 rounded-md text-sm text-gray-600"
          @change="handleFileUpload($event, 'invoice_logo')"
        />
        <p class="mt-1 text-sm text-gray-500">
          Format: <span class="font-semibold">.png</span> | Maks:
          <span class="font-semibold">1MB</span> | Dimensi:
          <span class="font-semibold">270x80 px</span>
        </p>
      </div>

      <div>
        <label class="block text-gray-600 font-semibold mb-1">Icon</label>
        <input
          type="file"
          accept=".ico"
          class="w-full border p-2 rounded-md text-sm text-gray-600"
          @change="handleFileUpload($event, 'icon')"
        />
        <p class="mt-1 text-sm text-gray-500">
          Format: <span class="font-semibold">.ico</span> | Maks:
          <span class="font-semibold">500KB</span> | Dimensi:
          <span class="font-semibold">48x48 px</span>
        </p>
      </div>
    </div>

    <div class="mt-6 flex justify-end">
      <button @click="updateCompanyData" class="bg-blue-600 text-white px-4 py-2 rounded-md">
        Edit Pengaturan
      </button>
    </div>
  </div>
</template>
