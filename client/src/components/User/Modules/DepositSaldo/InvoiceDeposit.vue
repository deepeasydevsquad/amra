<template>
  <div class="bg-white p-8 text-sm text-gray-800">
    <!-- Tombol Download PDF - TIDAK AKAN MUNCUL DI PRINT -->
    <div class="mb-6 flex justify-end no-print">
      <button
        @click="downloadPDF"
        class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Download PDF
      </button>
    </div>

    <!-- Wrapper PDF -->
    <div id="invoice">
      <!-- Header -->
      <div class="flex justify-between items-start border-b pb-4 mb-4">
        <div class="w-1/3">
          <img
            :src="company?.logo ? `${BASE_URL}/uploads/pengaturan/${company.logo}` : 'logo1.png'"
            alt="Logo"
            class="h-14"
          />
        </div>
        <div class="text-right w-2/3">
          <h2 class="text-2xl font-extrabold uppercase">{{ company?.company_name || '-' }}</h2>
          <p class="text-sm font-bold tracking-wide leading-snug">
            {{ company?.Divisions?.[0]?.address || '-' }}, {{ company?.Divisions?.[0]?.city || '-'
            }}<br />
            Kode Pos: {{ company?.Divisions?.[0]?.pos_code || '-' }}, Email:
            {{ company?.email || '-' }} <br />
            Telp: {{ company?.whatsapp_company_number || '-' }}
          </p>
        </div>
      </div>

      <h2 class="text-lg font-bold mb-4 text-left">Kwitansi Pembayaran Deposit Saldo</h2>

      <!-- Info Transaksi -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="border rounded-md p-3 min-h-[80px]">
          <p class="text-xs font-semibold text-gray-600">Kode Transaksi</p>
          <p class="text-base font-medium">{{ deposit?.invoice || '-' }}</p>
        </div>
        <div class="border rounded-md p-3 min-h-[80px]">
          <p class="text-xs font-semibold text-gray-600">Status</p>
          <p class="text-base font-medium">Sukses</p>
        </div>
        <div class="border rounded-md p-3 min-h-[80px]">
          <p class="text-xs font-semibold text-gray-600">Info Member</p>
          <p class="text-base font-medium">
            {{ deposit?.Member?.fullname || '-' }}
          </p>
        </div>
      </div>

      <!-- Tabel Transaksi -->
      <table class="w-full text-left border border-collapse mb-4 table-fixed">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2 w-1/5">Waktu Transaksi</th>
            <th class="border p-2 w-1/5">Keperluan</th>
            <th class="border p-2 w-1/5">Penerima</th>
            <th class="border p-2 w-2/5">Info</th>
            <th class="border p-2 w-1/5">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border p-2">{{ formatDate(deposit?.createdAt) }}</td>
            <td class="border p-2 capitalize">{{ deposit?.tipe_transaksi }}</td>
            <td class="border p-2">{{ deposit?.penerima }}</td>
            <td class="border p-2">{{ deposit?.info }}</td>
            <td class="border p-2">Rp {{ formatRupiah(deposit?.nominal) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Total -->
      <div class="text-right mb-4">
        <p>
          Total Penambahan Deposit:
          <span class="font-semibold">Rp {{ formatRupiah(deposit?.nominal) }}</span>
        </p>
        <p>
          Total Deposit Sekarang:
          <span class="font-semibold">Rp {{ formatRupiah(deposit?.saldo_sesudah) }}</span>
        </p>
      </div>

      <!-- Tanda Tangan -->
      <div class="flex justify-between mt-8">
        <div>
          <p class="mb-12">Member/Jamaah</p>
          <p class="border-t border-gray-400 w-40"></p>
        </div>
        <div>
          <p class="mb-12">Penerima</p>
          <p class="border-t border-gray-400 w-40"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import { dataCompany } from '@/service/deposit_saldo'
const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

const deposit = ref<any>(null)
const company = ref<any>(null)

const fetchCompany = async () => {
  try {
    company.value = await dataCompany()
    console.log('data company', company.value)
  } catch (error) {
    console.log('gagal fetch data', error)
  }
}

const formatRupiah = (val: number) => (val ? val.toLocaleString('id-ID') : '0')
const formatDate = (val: string) => (val ? val.replace('T', ' ').slice(0, 19) : '-')

const downloadPDF = () => {
  const element = document.getElementById('invoice')
  if (!element) return

  const opt = {
    margin: 0.5,
    filename: 'kwitansi-pembayaran.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  }

  html2pdf().set(opt).from(element).save()
}

onMounted(() => {
  fetchCompany()
  const raw = localStorage.getItem('depositInfo')
  deposit.value = raw ? JSON.parse(raw) : null

  if (deposit.value) {
    setTimeout(() => window.print(), 500)
  }
})
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }

  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
  }

  html,
  body {
    width: 100%;
    height: 100%;
  }

  @page {
    margin: 0.5in;
  }
}
</style>
