<template>
  <transition name="fade-scale">
    <div
      v-if="formtambahsurat"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl animate-fade-in">
        <h2 class="text-xl font-semibold mb-1 text-gray-700">Buat Surat</h2>
        <p class="text-sm text-gray-500 mb-4">Isi data lengkap untuk membuat surat baru</p>

        <form @submit.prevent="submitForm" class="grid gap-4 text-gray-700">
          <div>
            <label class="block text-sm font-medium">Nomor Surat</label>
            <input
              v-model="form.nomor_surat"
              class="input"
              required
              placeholder="Contoh: 001/SRT/2025"
            />
          </div>

          <div>
            <label class="block text-sm font-medium">Tanggal</label>
            <input
              v-model="form.tanggal_surat"
              type="date"
              class="input"
              required
              placeholder="Pilih tanggal"
            />
          </div>

          <div>
            <label class="block text-sm font-medium">Tujuan</label>
            <input
              type="text"
              v-model="form.tujuan"
              class="input"
              required
              placeholder="Contoh: Kemenag, Imigrasi"
            />
          </div>

          <div>
            <label class="block text-sm font-medium">Jenis Surat</label>
            <select v-model="form.tipe_surat" class="input">
              <option value="">-- Pilih --</option>
              <option value="surat_cuti">Surat Cuti</option>
              <option value="rekom_paspor">Surat Rekom Paspor</option>
            </select>
          </div>

          <!-- Surat Cuti -->
          <transition name="fade">
            <div v-if="form.tipe_surat === 'surat_cuti'" class="grid gap-2">
              <label class="text-sm font-medium">Jamaah</label>
              <select v-model="form.jamaah_id" class="input">
                <option value="">-- Pilih Jamaah --</option>
                <option v-for="j in jamaahList" :key="j.id" :value="j.id">{{ j.nama }}</option>
              </select>

              <label class="text-sm font-medium">Jabatan</label>
              <input v-model="form.jabatan" class="input" placeholder="Contoh: Ketua Rombongan" />

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-sm font-medium">Keberangkatan</label>
                  <input v-model="form.keberangkatan" type="date" class="input" />
                </div>
                <div>
                  <label class="text-sm font-medium">Kepulangan</label>
                  <input v-model="form.kepulangan" type="date" class="input" />
                </div>
              </div>
            </div>
          </transition>

          <!-- Rekom Paspor -->
          <transition name="fade">
            <div v-if="form.tipe_surat === 'rekom_paspor'" class="grid gap-2">
              <label class="text-sm font-medium">Jamaah</label>
              <select v-model="form.jamaah_id" class="input">
                <option value="">-- Pilih Jamaah --</option>
                <option v-for="j in jamaahList" :key="j.id" :value="j.id">{{ j.nama }}</option>
              </select>

              <label class="text-sm font-medium">Bulan dan Tahun Keberangkatan </label>
              <input
                v-model="form.bulan_tahun_berangkat"
                class="input"
                placeholder="Contoh: Januari"
              />
            </div>
          </transition>

          <div class="flex justify-end gap-2 mt-4">
            <button type="button" class="px-4 py-2 bg-gray-300 rounded" @click="emit('close')">
              Batal
            </button>
            <button type="submit" class="bg-[#455494] px-4 py-2 text-white rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { get_jamaah, add_surat } from '@/service/daftar_konfigurasi_surat'

const props = defineProps({
  formtambahsurat: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['close', 'handletambahsurat'])

const jamaahList = ref([])

const form = ref({
  nomor_surat: '',
  tanggal_surat: '',
  tujuan: '',
  tipe_surat: '',
  jamaah_id: '',
  jabatan: '',
  keberangkatan: '',
  kepulangan: '',
  bulan_tahun_berangkat: '',
})

let alreadyFetched = false // biar gak fetch berulang2

watch(
  () => form.value.tipe_surat,
  async (newJenis) => {
    if ((newJenis === 'surat_cuti' || newJenis === 'rekom_paspor') && !alreadyFetched) {
      try {
        const data = await get_jamaah()
        jamaahList.value = data.map((item) => ({
          id: item.jamaah_id,
          nama: item.nama_jamaah,
        }))
        alreadyFetched = true
      } catch (err) {
        console.error('Gagal fetch jamaah:', err)
      }
    }
  },
)

const submitForm = async () => {
  try {
    await add_surat({ ...form.value })
    emit('handletambahsurat')

    const jenisSurat = form.value.tipe_surat
    const jamaahId = form.value.jamaah_id

    const url = `${window.location.origin}/cetak_surat/${jenisSurat}?jamaah_id=${jamaahId}`
    window.open(url, '_blank')
    form.value = {
      nomor_surat: '',
      tanggal_surat: '',
      tujuan: '',
      tipe_surat: '',
      jamaah_id: '',
      jabatan: '',
      keberangkatan: '',
      kepulangan: '',
      bulan_tahun_berangkat: '',
    }
  } catch (error) {
    console.error('Gagal submit surat:', error)
  }
}
</script>

<style scoped>
.input {
  @apply w-full p-2 border border-gray-300 rounded placeholder-gray-400 text-gray-700;
}

.fade-enter-active,
.fade-leave-active,
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
