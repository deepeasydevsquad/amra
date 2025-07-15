<script setup lang="ts">
// Import icon
import XIcon from '@/components/User/Modules/SyaratPaket/icon/XIcon.vue'
import CheckIcon from '@/components/User/Modules/SyaratPaket/icon/CheckIcon.vue'

// Import components
import Notification from '@/components/User/Modules/SyaratPaket/particle/Notification.vue'

import LightButton from "@/components/Button/LightButton.vue"
import DangerButtonSecondary from "@/components/Button/DangerButtonSecondary.vue"
import IconPlus from '@/components/Icons/IconPlus.vue'
import DownloadIcon from '@/components/Icons/IconDownload.vue'


// import widget
// import Pagination from '@/components/Pagination/Pagination.vue'

import { ref, onMounted, computed } from 'vue'
import { getInfoPaketKT } from '@/service/k_t.ts'
const props = defineProps<{
  paketId: number
}>()

const isLoading = ref(false)
const itemsPerPage = 100 // Jumlah daftar transaksi per halaman
const currentPage = ref(1)
const search = ref('')
const totalPages = ref(0)
const timeoutId = ref<number | null>(null)


interface KTData {
  paket_id: number
  name: string
  total_anggaran: number
  belanja: number
  keuntungan: number
}

const data = ref<KTData>({paket_id: 0, name: '', total_anggaran: 0});
const notificationMessage = ref<string>('')
const notificationType = ref<'success' | 'error'>('success')
const showNotification = ref<boolean>(false)
// const totalColumns = ref(3)

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true

  if (timeoutId.value) clearTimeout(timeoutId.value)

  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const fetchData = async () => {


  console.log("~~~~~~~~~~~~~~~~~~~~1");
  console.log("~~~~~~~~~~~~~~~~~~~~2");
  console.log("~~~~~~~~~~~~~~~~~~~~3");

  try {
    isLoading.value = true
    const response = await getInfoPaketKT({
      paket_id: props.paketId,
    })
    data.value = response.data
    // console.log(dataSyaratPaket)
    // totalPages.value = Math.ceil(response.total / itemsPerPage)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

  const formatRupiah = (angka :any, prefix = "Rp ") => {
    let numberString = angka.toString().replace(/\D/g, ""),
      split = numberString.split(","),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      let separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    return prefix + (rupiah || "0");
  };

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="p-4 bg-white min-h-screen">
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" >
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
    </div>
    <div class="flex justify-between mb-4">
      <DangerButtonSecondary>
        <DownloadIcon />
        Tutup Paket
      </DangerButtonSecondary>
      <div class="flex items-center">
        <label for="search" class="block pt-2 text-base font-medium text-gray-700 mr-2">{{ data.name  ?? 'Rp 0' }}</label>
      </div>
    </div>
    <div class="overflow-hidden  border border-gray-200">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <tbody>
          <tr>
            <td class="w-[25%] px-6 py-2 border-b font-medium text-gray-900 text-start">RINCIAN KEGIATAN ANGGARAN PAKET</td>
            <td class="w-[2%] px-0 py-2 border-b font-medium text-gray-900 text-start">:</td>
            <td class="px-0 py-2 border-b font-medium text-gray-900 text-start">{{ formatRupiah(data.total_anggaran ?? 0)  ?? 'Rp 0' }}</td>
          </tr>
          <tr>
            <td class="px-6 py-2 border-b font-medium text-gray-900 text-start">RINCIAN AKTUALISASI BELANJA PAKET</td>
            <td class="px-0 py-2 border-b font-medium text-gray-900 text-start">:</td>
            <td class="px-0 py-2 border-b font-medium text-gray-900 text-start">{{ formatRupiah(data.belanja ?? 0)  ?? 'Rp 0' }}</td>
          </tr>
          <tr>
            <td class="px-6 py-2 font-medium text-gray-900 text-start">RINCIAN KEUNTUNGAN PROGRAM PAKET</td>
            <td class="px-0 py-2 font-medium text-gray-900 text-start">:</td>
            <td class="px-0 py-2 font-medium text-gray-900 text-start">{{ formatRupiah(data.keuntungan ?? 0)  ?? 'Rp 0' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="overflow-hidden  border border-gray-200 mt-10">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="w-[3%] px-6 py-3 font-medium text-gray-900 text-center">No</th>
            <th class="w-[35%] px-6 py-3 font-medium text-gray-900 text-center">Uraian</th>
            <th class="w-[8%] px-6 py-3 font-medium text-gray-900 text-center">Qt</th>
            <th class="w-[12%] px-6 py-3 font-medium text-gray-900 text-center">Biaya</th>
            <th class="w-[12%] px-6 py-3 font-medium text-gray-900 text-center">Tot. Biaya Mahram</th>
            <th class="w-[12%] px-6 py-3 font-medium text-gray-900 text-center">Tot. Diskon</th>
            <th class="w-[18%] px-6 py-3 font-medium text-gray-900 text-center">Tot. Biaya</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td></td>
            <td class="px-0 py-3 font-bold text-gray-900 text-left">POTENSI PENDAPATAN PAKET</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="px-6 py-3 font-bold text-gray-900 text-right">{{ formatRupiah(data.total_anggaran ?? 0)  ?? 'Rp 0' }}</td>
          </tr>
          <tr>
            <td class="px-0 py-3 font-medium text-gray-900 text-center">1</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">NORMAL</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center">1</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 30.000.000,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 30.000.000,-</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="overflow-hidden  border border-gray-200 mt-10">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <tbody>
          <tr class="border-b bg-gray-50 font-bold">
            <td class="w-[3%] px-6 py-3 font-bold text-gray-900 text-center">A.</td>
            <td class="w-[35%] px-0 py-3 font-bold text-gray-900 text-left" >KEBERANGKATAN</td>
            <th class="w-[8%] px-0 py-3 font-medium text-gray-900 text-center" ></th>
            <th colspan="3" class="w-[41%] px-6 py-3 font-medium text-gray-900 text-center" ></th>
            <td class="w-[13%] px-6 py-3 font-bold text-gray-900 text-right">Rp 30.000.000,-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">1</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">Pembayaran Jamaah</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" ></td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 30.000.000,-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">2</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">Diskon</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" ></td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">3</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">Piutang Jamaah</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" ></td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
          </tr>
          <tr class="border-b bg-gray-50">
            <td class="px-6 py-3 font-bold text-gray-900 text-center">B.</td>
            <td class="px-0 py-3 font-bold text-gray-900 text-left">AKTUALISASI KEGIATAN ANGGARAN</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" ></td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-bold text-gray-900 text-right">Rp 30.000.000,-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">1</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">Fee Agen</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" >10 Orang</td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">2</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">Biaya Fasilitas</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" >1000 Fasilitas</td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">3</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">Biaya Tiket</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" >1 Tiket</td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">4</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">Biaya Visa</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" >1 Unit</td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">5</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">Biaya Hotel</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" >100 Unit</td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">6</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">Biaya Transport</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" >1 Unit</td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
          </tr>
          <tr class="border-b">
            <td class="px-6 py-3 font-medium text-gray-900 text-center">7</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-left">Biaya Passport</td>
            <td class="px-0 py-3 font-medium text-gray-900 text-center" >1 unit</td>
            <td colspan="3" class="px-6 py-3 font-medium text-gray-900 text-center" ></td>
            <td class="px-6 py-3 font-medium text-gray-900 text-right">Rp 0,-</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Notification :showNotification="showNotification" :notificationType="notificationType" :notificationMessage="notificationMessage" @close="showNotification = false" />
</template>
