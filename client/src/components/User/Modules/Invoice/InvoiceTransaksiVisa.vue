<template>
  <div
    class="bg-white max-w-[210mm] mx-auto p-[15mm] font-serif print:p-[10mm] print:m-0 print:shadow-none"
    style="color: black; font-size: 10pt; text-align: justify; line-height: 1.3"
  >
    <!-- Header -->
    <div class="text-center mb-4">
      <h1 class="text-lg underline font-semibold">INVOICE TRANSAKSI VISA</h1>
      <div class="text-base">No: {{ data?.invoice || '-' }}</div>
    </div>

    <!-- Tanggal Transaksi -->
    <div class="text-right mb-4">
      <div class="font-semibold">{{ formatDate(data?.createdAt) }}</div>
    </div>

    <!-- Info Pembayar -->
    <div class="mb-4">
      <p>Kepada, YTH</p>
      <p class="font-semibold">{{ data?.payer || '-' }}</p>
      <p>Telp. : {{ data?.profession_telephone || '-' }}</p>
      <p>di - Tempat</p>
    </div>

    <!-- Data Pemohon Visa -->
    <div class="mb-4">
      <p>Dengan ini kami sampaikan detail transaksi visa untuk:</p>
      <div class="flex flex-col gap-1 mt-2">
        <div class="flex">
          <div class="w-[140px]">Nama Lengkap</div>
          <div>: {{ data?.name || '-' }}</div>
        </div>
        <div class="flex">
          <div class="w-[140px]">No. Identitas</div>
          <div>: {{ data?.identity_number || '-' }}</div>
        </div>
        <div class="flex">
          <div class="w-[140px]">Tempat, Tanggal Lahir</div>
          <div>: {{ data?.birth_place || '-' }}, {{ formatDate(data?.birth_date) }}</div>
        </div>
        <div class="flex">
          <div class="w-[140px]">No. Passport</div>
          <div>: {{ data?.passport_number || '-' }}</div>
        </div>
        <div class="flex">
          <div class="w-[140px]">Berlaku s/d</div>
          <div>: {{ formatDate(data?.valid_until) }}</div>
        </div>
      </div>
    </div>

    <!-- Detail Harga -->
    <div class="mb-4">
      <p>Detail biaya pengurusan visa:</p>
      <div class="flex flex-col gap-1 mt-2">
        <div class="flex">
          <div class="w-[140px]">Jenis Visa</div>
          <div>: {{ data?.jenis_visa || '-' }}</div>
        </div>
        <div class="flex">
          <div class="w-[140px]">Harga</div>
          <div class="font-semibold">: {{ formatRupiah(data?.price) }}</div>
        </div>
      </div>
    </div>

    <!-- Total -->
    <div class="mb-4 border-t pt-2">
      <div class="flex">
        <div class="w-[140px] font-semibold">TOTAL PEMBAYARAN</div>
        <div class="font-bold text-lg">: {{ formatRupiah(data?.price) }}</div>
      </div>
    </div>

    <!-- Penutup -->
    <p class="mb-4">
      Demikian invoice ini kami buat dengan sebenar-benarnya untuk dapat digunakan sebagaimana mestinya.
      Atas perhatian dan kerjasamanya kami ucapkan terima kasih.
    </p>

    <!-- Footer -->
    <div class="flex justify-between mt-8">
      <div class="text-left">
        <div class="mb-2">Pembayar</div>
        <div class="h-12"></div>
        <div class="font-semibold underline">{{ data?.payer || '-' }}</div>
      </div>
      <div class="text-right">
        <div class="mb-2">{{ formatDate(data?.createdAt) }}</div>
        <div class="mb-2">Petugas</div>
        <div class="h-12"></div>
        <div class="font-semibold">ADMINISTRATOR</div>
        <div class="font-semibold underline">{{data?.petugas}}</div>
      </div>
    </div>

    <!-- Loading atau Error State -->
    <div v-if="!data && !errorMessage" class="text-center py-10">
      <p>Memuat data invoice...</p>
    </div>

    <div v-if="errorMessage" class="text-center py-10 text-red-600">
      <h2 class="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { cetakKwitansiVisa } from '@/service/invoice'
import { useRoute } from 'vue-router'

const route = useRoute()
const invoiceVisa = route.params.invoice
const data = ref<any>(null)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await cetakKwitansiVisa(invoiceVisa)
    
    if (response.error) {
      errorMessage.value = `Gagal memuat data dari server: ${response.error_msg}`
      return
    }
    
    const isWrapped = 'data' in response && !response.error
    data.value = isWrapped ? response.data : response
    
    // Auto print setelah data dimuat
    setTimeout(() => {
      window.print()
    }, 300)
    
  } catch (error: any) {
    console.error('Gagal mengambil data invoice visa:', error)
    errorMessage.value = `Terjadi kesalahan: ${error.message}`
  }
})

const formatRupiah = (value: number | string): string => {
  if (!value) return 'Rp 0'
  const angka = typeof value === 'number' ? value : parseInt(value)
  return angka.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<style>
@media print {
  body {
    margin: 0;
    background: white;
    color: black !important;
  }
}
</style>