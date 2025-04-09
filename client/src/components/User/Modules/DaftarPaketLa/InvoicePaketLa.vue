<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getInvoicePaketLA  } from '../../../../service/invoice_paketla'
import { useInvoiceStore } from '../../../../stores/invoiceStore'
import router from '@/router'; // ini untuk navigasi ke halaman lain

interface DetailFasilitas {
  id: number
  fasilitas_paket_la_id: number
  description: string
  check_in: string
  check_out: string
  day: number
  pax: number // ini bisa ditreat sebagai qty
  price: number
}

interface FasilitasPaketLA {
  id: number
  paket_la_id: number
  invoice: string
  total: number
  order_date: string
  detail_fasilitas: DetailFasilitas[]
}

interface DetailCompany {
  id: number
  pos_code: string
  address: string
}

interface CompanyData {
  id: number
  logo: string
  company_name: string
  email: string
  whatsapp_company_number: string
  detail_company: DetailCompany[]
}

interface InvoiceData {
  id: number
  division_id: number
  client_name: string
  client_hp_number: string
  client_address: string
  companyData: CompanyData[]
  fasilitas_paket_la: FasilitasPaketLA[]
}

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const invoiceData = ref<InvoiceData[]>([])
const companyData = ref<CompanyData[]>([])

const fetchData = async () => {
  try {
    const invoiceStore = useInvoiceStore();
    const paketId = invoiceStore.paketId;
    const fasilitasId = invoiceStore.fasilitasId;
    const body = {
      id: paketId,
      fasilitaspaketlaId: fasilitasId,
    }

    const response = await getInvoicePaketLA(body)
    if (response && response.data) {
      invoiceData.value = response.data
      companyData.value = response.data.companyData
    }
  } catch (error) {
    console.error("Error fetching invoice data:", error)
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
}

onMounted(async () => {
  try {
    fetchData()

    // Tunggu sebentar agar DOM selesai dirender
    setTimeout(() => {
      window.print()
    }, 1000)

    // Tunggu 2 detik sebelum navigasi ke halaman lain
    setTimeout(() => {
      router.push({ name: 'user' })
    }, 2000)

  } catch (err) {
    console.error("Error:", err)
  }
})
</script>

<template>
  <div class="p-8 text-gray-900 font-sans text-sm">
    <!-- Header -->
    <div class="flex items-center justify-between border-b-2 border-gray-400 pb-4 mb-6">
      <img
        :src="companyData?.logo ? `${BASE_URL}/uploads/pengaturan/${companyData?.logo}` : `${BASE_URL}/uploads/pengaturan/logo1.png`"
        alt="Logo"
        class="h-16 object-contain"
      />
      <div class="text-right leading-tight">
        <h2 class="text-2xl font-bold uppercase">{{ companyData?.company_name || '-' }}</h2>
        <p>{{ companyData?.detail_company?.address || '-' }}</p>
        <p>
          Kode Pos: {{ companyData?.detail_company?.pos_code || '-' }},
          Email: {{ companyData?.email || '-' }},
          Telp: {{ companyData?.whatsapp_company_number || '-' }}
        </p>
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-center text-lg font-bold mb-6 border-b pb-2">INVOICE ITEM FASILITAS PAKET LA</h3>

    <!-- Info Client & Invoice -->
    <div class="grid grid-cols-2 gap-6 mb-8">
      <div class="space-y-1">
        <p><span class="font-medium">Nama Client:</span> {{ invoiceData?.client_name }}</p>
        <p><span class="font-medium">No HP:</span> {{ invoiceData?.client_hp_number }}</p>
        <p><span class="font-medium">Alamat:</span> {{ invoiceData?.client_address }}</p>
      </div>
      <div class="text-right space-y-1">
        <p><span class="font-medium">No Invoice:</span> #{{ invoiceData.fasilitas_paket_la?.invoice }}</p>
        <p><span class="font-medium">Order Date:</span> {{ invoiceData.fasilitas_paket_la?.order_date }}</p>
      </div>
    </div>

    <!-- Tabel Detail -->
    <p class="font-semibold mb-2">Detail Item Paket LA:</p>
    <table class="w-full table-fixed text-xs border border-collapse border-gray-400 mb-8">
      <thead class="bg-gray-200 text-center">
        <tr>
          <th class="border border-gray-400 px-2 py-1 w-[15%]">Description</th>
          <th class="border border-gray-400 px-2 py-1 w-[15%]">Check In</th>
          <th class="border border-gray-400 px-2 py-1 w-[15%]">Check Out</th>
          <th class="border border-gray-400 px-2 py-1 w-[10%]">Day</th>
          <th class="border border-gray-400 px-2 py-1 w-[10%]">Qty</th>
          <th class="border border-gray-400 px-2 py-1 w-[17.5%]">Price</th>
          <th class="border border-gray-400 px-2 py-1 w-[17.5%]">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in invoiceData.fasilitas_paket_la?.detail_fasilitas"
          :key="index"
          class="text-center"
        >
          <td class="border px-2 py-1">{{ item.description }}</td>
          <td class="border px-2 py-1">{{ item.check_in }}</td>
          <td class="border px-2 py-1">{{ item.check_out }}</td>
          <td class="border px-2 py-1">{{ item.day }}</td>
          <td class="border px-2 py-1">{{ item.pax }}</td>
          <td class="border px-2 py-1">Rp {{ formatCurrency(item.price) }}</td>
          <td class="border px-2 py-1">Rp {{ formatCurrency(item.amount || 0) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="font-semibold">
          <td colspan="6" class="text-right border px-2 py-2">Total Harga:</td>
          <td class="text-center border px-2 py-2">
            Rp {{ formatCurrency(invoiceData?.fasilitas_paket_la?.total || 0) }}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- Ketentuan -->
    <div class="text-xs mb-8">
      <p class="font-semibold mb-2">Ketentuan dan Syarat:</p>
      <ul class="list-decimal pl-5 space-y-1">
        <li>Prioritas penerbitan visa sudah menyetor pembayaran/memiliki deposit</li>
        <li>Proses visa dilakukan minimal H+1 setelah pelunasan</li>
        <li>Ketentuan visa error mengacu pada sistem dari muassasah</li>
        <li>Jadwal Raudhah tergantung kepada sistem dan ketentuan dari muassasah</li>
        <li>Perubahan jadwal bus tergantung kepada company terkait</li>
        <li>
          Jama'ah batal berangkat dikarenakan visa tidak keluar bukan menjadi tanggung jawab PT. Zam Zam Wisata Islami:
          <ul class="list-disc pl-5 mt-1 space-y-1">
            <li>Jadwal keberangkatan mendadak (H-3)</li>
            <li>Perubahan jadwal keberangkatan dari maskapai</li>
            <li>Pembatasan kuota jama'ah umroh</li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- TTD -->
    <div class="text-right mt-6 leading-tight">
      <p>{{ invoiceData.client_address }}, {{ invoiceData.fasilitas_paket_la?.order_date }}</p>
      <p class="font-semibold mt-10">SIGNATURE</p>
    </div>
  </div>
</template>


<style scoped>
/* Optional tambahan styling jika diperlukan */
</style>


