<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { cetakKwitansiVisa } from '@/service/invoice.ts';
import Header from '@/components/User/Modules/Invoice/Particle/Header.vue';

const isLoading = ref(true);
const data = ref<any>(null);
const route = useRoute();

const errorMessage = ref<string | null>(null);

onMounted(async () => {
  try {
    const invoice = route.params.invoice as string;
    
    console.log('[VUE DEBUG] Invoice from params:', invoice);
    
    if (!invoice || invoice === 'undefined') {
      console.error('[VUE ERROR] Invoice parameter is missing or invalid');
      errorMessage.value = 'Parameter invoice tidak valid atau hilang dari URL.';
      isLoading.value = false;
      return;
    }
    
    console.log('[VUE DEBUG] Fetching kwitansi for invoice:', invoice);
    
    const response = await cetakKwitansiVisa(invoice);
    
    console.log('[VUE DEBUG] Response received:', response);
    
    if (response.error) {
      console.error('[VUE ERROR] API Error:', response.error_msg);
      errorMessage.value = `Gagal memuat data dari server: ${response.error_msg}`;
      isLoading.value = false;
      return;
    }
    
    data.value = response.data;
    console.log('[VUE DEBUG] Kwitansi data loaded:', data.value);
    
    // DEBUG: Cek apakah data header tersedia
    console.log('[VUE DEBUG] Header data check:', {
      logo: data.value?.logo,
      company_name: data.value?.company_name,
      address: data.value?.address,
      city: data.value?.city,
      pos_code: data.value?.pos_code,
      email: data.value?.email,
      whatsapp_company_number: data.value?.whatsapp_company_number
    });
    
  } catch (error: any) {
    console.error('[VUE ERROR] Error fetching visa transaction:', error);
    errorMessage.value = `Terjadi kesalahan fatal: ${error.message}`;
  } finally {
    isLoading.value = false;
    
    // Tunggu data ter-load dan header ter-render sebelum print
    if (data.value) {
      setTimeout(() => {
        console.log('[VUE DEBUG] About to print...');
        window.print();
        setTimeout(() => {
          window.close();
        }, 500);
      }, 1000); // Increase delay to 1000ms
    }
  }
});

const formatCurrency = (amount: number) => {
  if (typeof amount !== 'number') return '0';
  return new Intl.NumberFormat('id-ID').format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long', 
    year: 'numeric'
  });
};
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    <span class="ml-2">Memuat data kwitansi...</span>
  </div>

  <div v-else-if="errorMessage" class="flex flex-col justify-center items-center h-screen bg-red-50 p-4">
      <div class="text-red-700 text-center">
          <h2 class="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
          <p>{{ errorMessage }}</p>
          <button @click="window.close()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Tutup Jendela
          </button>
      </div>
  </div>
  
  <div v-else-if="data" class="bg-white p-8 text-sm print:text-[12px] text-gray-800 min-h-screen">


    <!-- Header Kwitansi -->
    <div v-if="data" class="mb-4">
      <Header :data="data"></Header>
    </div>

    <!-- Fallback Header jika komponen Header tidak berfungsi -->
    <div v-if="!data.company_name" class="flex justify-between items-start border-b pb-4 mb-4 bg-red-50 p-2">
      <div class="text-red-600 text-sm">
        <strong>WARNING:</strong> Data header tidak lengkap. Periksa response API.
      </div>
    </div>

    <div class="border-b-2 border-black mb-4"></div>

    <!-- Info Header -->
    <div class="flex justify-between mb-4">
      <div>
        <h2 class="text-lg font-bold">DETAIL TRANSAKSI VISA</h2>
        <p><span class="font-semibold">DITERIMA OLEH:</span></p>
        <p>{{'ADMINISTRATOR' }}</p>
      </div>
      <div class="text-right">
        <p><span class="font-semibold">INVOICE:</span> {{ data.invoice }}</p>
        <br>
        <p><span class="font-semibold">DITERIMA DARI</span></p>
        <p>{{ data.payer }}</p>
        <P> ( {{data.payer_identity}} )</P>
      </div>
    </div>

    <!-- Detail Transaksi Table -->
    <div class="mb-6">
      <h3 class="font-semibold mb-2">DETAIL TRANSAKSI:</h3>
      <table class="w-full border-collapse border border-gray-800 text-xs">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-800 p-2 text-left">IDENTITAS</th>
            <th class="border border-gray-800 p-2 text-left">INFO VISA</th>
            <th class="border border-gray-800 p-2 text-center">HARGA PAKET</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-800 p-2 align-top">
              <div class="space-y-1">
                <p><strong>Nama:</strong> {{ data.name }}</p>
                <p><strong>No. Identitas:</strong> {{ data.identity_number }}</p>
              </div>
            </td>
            <td class="border border-gray-800 p-2 align-top">
              <div class="space-y-1">
                <p><strong>Jenis:</strong> {{ data.jenis_visa }}</p>
                <p><strong>No. Passport:</strong> {{ data.passport_number }}</p>
                <p><strong>TTL:</strong> {{ data.birth_place }}, {{ formatDate(data.birth_date) }}</p>
                <p><strong>Berlaku s/d:</strong> {{ formatDate(data.valid_until) }}</p>
              </div>
            </td>
            <td class="border border-gray-800 p-2 text-center align-top">
              <p>Rp {{ formatCurrency(data.price) }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Total -->
    <div class="flex justify-end mb-6">
      <div class="text-right border border-gray-800 p-2">
        <p class="font-semibold">TOTAL: Rp {{ formatCurrency(data.price) }}</p>
      </div>
    </div>

    <!-- Tanda Tangan -->
    <div class="flex justify-between mt-12">
      <div class="text-center">
        <p class="mb-16">Penerima</p>
        <div class="border-t border-gray-800 pt-1">
          <p> (ADMINISTRATOR) <br> {{ data.company_name }}</p>
        </div>
      </div>
      <div class="text-center">
        <p class="mb-16">Penyetor</p>
        <div class="border-t border-gray-800 pt-1">
          <p>({{ data.payer }})</p>
        </div>
      </div>
    </div>

    <!-- Footer Info -->
    <div class="mt-8 text-xs">
      <p><strong>Tanggal Transaksi:</strong> {{ formatDate(data.createdAt) }}</p>
      <p><strong>Telepon:</strong> {{ data.profession_telephone || '-' }}</p>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 10mm;
  }
  body, html {
    background: white;
  }
  .print\:text-\[12px\] {
    font-size: 12px !important;
  }
  /* Sembunyikan elemen yang tidak perlu dicetak */
  .no-print {
    display: none !important;
  }
}
</style>