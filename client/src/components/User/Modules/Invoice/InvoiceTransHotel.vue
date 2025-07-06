<script setup lang="ts">
import Header from '@/components/User/Modules/Invoice/Particle/Header.vue'
import { ref, onMounted, nextTick } from 'vue'
import { kwitansi_trans_hotel } from '@/service/invoice'
import { useRoute } from 'vue-router'

const data = ref<any>(null)
const route = useRoute()
const invoice = route.params.invoice

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(async () => {
  try {
    const response = await kwitansi_trans_hotel(invoice)

    const isWrapped = 'data' in response && 'error' in response
    const result = isWrapped ? response.data : response

    data.value = result

    await nextTick()

    // ✅ CEK data aman sebelum nge-print
    if (data.value?.data && data.value.data.length > 0) {
      setTimeout(() => {
        window.print()
      }, 300)
    } else {
      console.warn('❗ Data kosong atau tidak valid:', data.value)
    }
  } catch (error) {
    console.error('❌ Gagal mengambil data invoice:', error)
  }
})
</script>

<template>

  <div class="bg-white max-w-[210mm] mx-auto p-[15mm] font-serif print:p-[10mm] print:m-0 print:shadow-none"
    style="color: black; font-size: 10pt; text-align: justify; line-height: 1.3">
    <Header v-if="data" :data="data.header" />

    <!-- Judul "Detail Transaksi Hotel" & Invoice -->

    <div v-if="data" class="mt-8">
      <div class="flex justify-between items-center text-sm font-semibold pb-1 mb-4">
        <div>DETAIL TRANSAKSI HOTEL</div>
        <div>INVOICE : {{ data.data[0]?.invoice || '-' }}</div>
      </div>
      <!-- Keterangan penerima -->
      <div class="flex justify-between text-sm mb-4">
        <div>
          <div class="font-semibold">DITERIMA OLEH</div>
          <div>{{ data.data[0]?.petugas || '-' }}</div>
        </div>
        <div class="text-right">
          <div class="font-semibold">DITERIMA DARI</div>
          <div>
            {{ data.data[0]?.payer || '-' }}<br />
            ({{ data.data[0]?.payer_identity || '-' }})
          </div>
        </div>
      </div>

      <!-- Judul -->
      <h2 class="font-semibold text-sm mb-1">DETAIL TRANSAKSI :</h2>

      <!-- Tabel transaksi -->
      <table class="w-full border-collapse text-[10pt] mb-8">
        <thead>
          <tr class="bg-gray-100 border">
            <th class="border px-4 py-2 text-center w-[30%]">NAMA/NOMOR IDENTITAS PEMBAYAR</th>
            <th class="border px-4 py-2 text-center w-[50%]">INFO HOTEL</th>
            <th class="border px-4 py-2 text-center w-[20%]">HARGA PAKET</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(detail, i) in data.data[0]?.details"
            :key="i"
            class="border-b border-gray-200"
          >
            <td class="px-4 py-2 align-top whitespace-nowrap">
              <span>{{ detail.name }}</span
              ><br />
              <span>{{ detail.identity_number }}</span>
            </td>
            <td class="px-4 py-2 align-top leading-relaxed">
              <div class="grid grid-cols-[90px_1fr] gap-y-1">
                <div>Nama Hotel</div>
                <div>: {{ detail.hotel_name }}</div>

                <div>TTL</div>
                <div>: {{ detail.birth_place }}, {{ formatDate(detail.birth_date) }}</div>

                <div>Check In</div>
                <div>: {{ formatDate(detail.check_in) }}</div>

                <div>Check Out</div>
                <div>: {{ formatDate(detail.check_out) }}</div>
              </div>
            </td>
            <td class="px-4 py-2 align-top text-right">
              Rp {{ Number(detail.price).toLocaleString('id-ID') }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="px-4 py-2 text-right font-semibold" colspan="2">TOTAL</td>
            <td class="px-4 py-2 text-right font-semibold">
              Rp
              {{
                data.data[0]?.details
                  .reduce((sum, d) => sum + Number(d.price || 0), 0)
                  .toLocaleString('id-ID')
              }}
            </td>
          </tr>
        </tfoot>
      </table>

      <!-- Tanda tangan -->
      <div class="flex justify-between text-sm mt-10">
        <div class="text-center">
          <div>Penerima</div>
          <br /><br />
          <div>({{ data.data[0]?.petugas || '-' }})</div>
        </div>
        <div class="text-center">
          <div>Penyetor</div>
          <br /><br />
          <div>({{ data.data[0]?.payer || '-' }})</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media screen {
  body {
    background-color: #f3f4f6;
  }

  .print-area {
    width: 210mm;
    height: 330mm;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    margin: auto;
    overflow: hidden;
  }
}

@media print {
  @page {
    size: 210mm 330mm; /* Ukuran F4 */
    margin: 20mm;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: white;
  }

  .print-area {
    width: 210mm;
    height: 330mm;
    box-shadow: none;
    margin: 0;
    padding: 0;
  }
}
</style>
