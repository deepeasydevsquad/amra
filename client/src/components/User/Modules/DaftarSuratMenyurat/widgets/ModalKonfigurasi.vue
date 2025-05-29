<template>
  <transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 pt-20" >
      <div class="bg-white w-full max-w-xl py-8 ps-8 pe-4 rounded-2xl shadow-2xl transition-all duration-300">
        <h2 class="text-2xl font-bold mb-6 text-gray-700 text-black">Konfigurasi Surat</h2>
        <form @submit.prevent="submitForm" class="space-y-6 max-h-[70vh] overflow-y-auto pr-2 text-gray-700 scrollbar-thin scrollbar-thumb-gray-400" >
          <!-- Section: Penanda Tangan -->
          <div class="pn-6">
            <h3 class="text-lg font-semibold mb-4 ">Penanda Tangan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium">Nama</label>
                <input v-model="form.nama_tanda_tangan" type="text" class="form-input" placeholder="Masukkan nama lengkap penanda tangan" required />
              </div>
              <div>
                <label class="text-sm font-medium">Jabatan</label>
                <input v-model="form.jabatan_tanda_tangan" type="text" class="form-input"  placeholder="Contoh: Direktur Utama" required />
              </div>
              <div class="md:col-span-2">
                <label class="text-sm font-medium">Alamat</label>
                <input v-model="form.alamat_tanda_tangan" type="text" class="form-input" placeholder="Masukkan alamat lengkap" required />
              </div>
            </div>
          </div>

          <!-- Section: Perusahaan -->
          <div class="pt-0 pb-6">
            <h3 class="text-lg font-semibold mb-4">Informasi Perusahaan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="text-sm font-medium">Nama Perusahaan</label>
                <input v-model="form.nama_perusahaan" type="text" class="form-input" placeholder="Contoh: PT. Contoh Sukses Bersama" required />
              </div>
              <div class="md:col-span-2">
                <label class="text-sm font-medium">Izin Perusahaan</label>
                <input v-model="form.izin_perusahaan" type="text" class="form-input" placeholder="Contoh: Izin No. 123/ABC/XYZ" required />
              </div>
              <div>
                <label class="text-sm font-medium">Kota</label>
                <input v-model="form.kota_perusahaan" type="text" class="form-input" placeholder="Contoh: Jakarta" required />
              </div>
              <div>
                <label class="text-sm font-medium">Provinsi</label>
                <input v-model="form.provinsi_perusahaan" type="text" class="form-input" placeholder="Contoh: DKI Jakarta" required/>
              </div>
              <div class="md:col-span-2">
                <label class="text-sm font-medium">Alamat Perusahaan</label>
                <input v-model="form.alamat_perusahaan" type="text" class="form-input" placeholder="Masukkan alamat lengkap" required/>
              </div>
              <div>
                <label class="text-sm font-medium">No Kontak</label>
                <input v-model="form.no_kontak_perusahaan" type="text" class="form-input" placeholder="Contoh: 08123456789" required />
              </div>
              <div>
                <label class="text-sm font-medium"  >Website <span class="text-xs text-gray-500">(Opsional)</span></label>
                <input v-model="form.website_perusahaan" type="text" class="form-input" placeholder="Contoh: www.namadomain.com" />
              </div>
              <div class="md:col-span-2">
                <label class="text-sm font-medium">Email</label>
                <input v-model="form.email_perusahaan" type="email" class="form-input" placeholder="Contoh: info@namaperusahaan.com" required />
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition" >
              Batal
            </button>
            <button type="submit" class="px-6 py-2 rounded-lg bg-[#455494] hover:bg-[#3a477d] text-white font-semibold transition">
              Simpan Konfigurasi
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, defineProps, defineEmits, watch } from 'vue'
import { getKonfigurasi, addKonfigurasi } from '@/service/daftar_konfigurasi_surat'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'submit', 'konfigurasi_success'])

const form = reactive({
  id: '',
  nama_tanda_tangan: '',
  jabatan_tanda_tangan: '',
  alamat_tanda_tangan: '',
  nama_perusahaan: '',
  izin_perusahaan: '',
  kota_perusahaan: '',
  provinsi_perusahaan: '',
  alamat_perusahaan: '',
  no_kontak_perusahaan: '',
  website_perusahaan: '',
  email_perusahaan: '',
})

// Isi data ke form
async function fetchAndSetForm() {
  try {
    const data = await getKonfigurasi()

    // Safety check + fallback value kalau gak ada data
    Object.assign(form, {
      id: data?.id || '',
      nama_tanda_tangan: data?.nama_tanda_tangan || '',
      jabatan_tanda_tangan: data?.jabatan_tanda_tangan || '',
      alamat_tanda_tangan: data?.alamat_tanda_tangan || '',
      nama_perusahaan: data?.nama_perusahaan || '',
      izin_perusahaan: data?.izin_perusahaan || '',
      kota_perusahaan: data?.kota_perusahaan || '',
      provinsi_perusahaan: data?.provinsi_perusahaan || '',
      alamat_perusahaan: data?.alamat_perusahaan || '',
      no_kontak_perusahaan: data?.no_kontak_perusahaan || '',
      website_perusahaan: data?.website_perusahaan || '',
      email_perusahaan: data?.email_perusahaan || '',
    })
  } catch (err) {
    console.error('Gagal fetch data konfigurasi:', err)
    // fallback kalo error fetch, form direset kosong juga
    Object.assign(form, {
      id: '',
      nama_tanda_tangan: '',
      jabatan_tanda_tangan: '',
      alamat_tanda_tangan: '',
      nama_perusahaan: '',
      izin_perusahaan: '',
      kota_perusahaan: '',
      provinsi_perusahaan: '',
      alamat_perusahaan: '',
      no_kontak_perusahaan: '',
      website_perusahaan: '',
      email_perusahaan: '',
    })
  }
}

// Submit handler
async function submitForm() {
  try {
    console.log('data yang di kirim', form)
    await addKonfigurasi({ ...form })
    selesaiKonfigurasi()
  } catch (err) {
    console.error('Gagal submit konfigurasi:', err)
  }
}

function selesaiKonfigurasi() {
  emit('konfigurasi_success')
}

function closeModal() {
  emit('close')
}

// Pantau show prop: saat show=true, load data
watch(
  () => props.show,
  (val) => {
    if (val) {
      fetchAndSetForm()
    }
  },
)
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Utility class biar DRY */
.form-input {
  @apply w-full border rounded px-3 py-2 mt-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400;
}
</style>
