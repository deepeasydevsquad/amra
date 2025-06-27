<template>
  <div class="container mx-auto p-4">
     <!-- Tambah data dan Search -->
     <div class="flex justify-between mb-4" >
    <PrimaryButton @click="startTicketTransaction">
        <i class="pi pi-plus"></i>
        Mulai Transaksi Tiket
    </PrimaryButton>
    <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          type="text"
          v-model="searchQuery"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          placeholder="Cari data..."
        />
    </div>
    </div>
    <!-- Tabel Data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr class="bg-gray-100">
            <th class="w-[10%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Nomor Register</th>
            <th class="w-[35%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Info Tiket</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Info Pembayaran</th>
            <th class="w-[5%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="data.length" class="divide-y divide-gray-100 border-t border-gray-100" >
          <tr v-for="transaction in data" :key="transaction?.id">
              <!-- No Register -->
              <td class="px-4 py-2 align-top text-sm text-gray-800 whitespace-nowrap">
                <div class="font-bold text-sm">{{ transaction.nomor_register }}</div>
                <div class="text-xs text-gray-500">{{ new Date(transaction.updatedAt).toLocaleString() }}</div>
              </td>

              <!-- Info Tiket -->
              <td class="px-4 py-2 text-sm text-gray-700 align-top w-[480px]">
                <div v-for="ticket in transaction.ticket_details" :key="ticket.id" class="mb-4">
                  <div class="grid grid-cols-2 gap-x-6 gap-y-1 text-xs leading-snug">
                    <div>PAX: {{ ticket.pax }}</div>
                    <div>NAMA AIRLINES: {{ ticket.airlines_name || 'N/A' }}</div>
                    <div class="text-red-500">KODE BOOKING: {{ ticket.code_booking }}</div>
                    <div>TANGGAL BERANGKAT: {{ new Date(ticket.departure_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</div>
                    <div>HARGA TRAVEL: Rp {{ ticket.travel_price.toLocaleString() }}</div>
                    <div>HARGA KOSTUMER: Rp {{ ticket.costumer_price.toLocaleString() }}</div>
                  </div>
                </div>
                <!-- Subtotal -->
                <div class="bg-red-100 mt-2 px-4 py-1 text-sm font-bold flex justify-between items-center w-full">
                  <span>SUBTOTAL</span>
                  <span class="text-red-500">: Rp {{ transaction.total_transaksi.toLocaleString() }}</span>
                </div>
              </td>

              <!-- Info Pembayaran -->
              <td class="px-4 py-2 text-sm text-gray-700 align-top">
                <div class="space-y-1">
                  <div><strong>TOTAL TRANSAKSI TIKET</strong> : Rp {{ transaction.total_transaksi.toLocaleString() }}</div>
                  <div><strong>TOTAL PEMBAYARAN</strong> : Rp {{ calculateTotalPayment(transaction).toLocaleString() }}</div>
                  <div><strong>SISA PEMBAYARAN</strong> : Rp {{ (transaction.total_transaksi - calculateTotalPayment(transaction)).toLocaleString() }}</div>
                </div>

                <div v-if="transaction.payment_histories.length" class="mt-2 text-xs text-gray-600 border-t pt-2">
                  <div class="text-red-500 italic font-medium">RIWAYAT PEMBAYARAN (Tiga transaksi terakhir)</div>
                  <ul class="list-disc list-inside mt-1 space-y-1">
                    <li v-for="payment in transaction.payment_histories.slice(0, 3)" :key="payment.id">
                      Tanggal Transaksi: {{ new Date(payment.createdAt).toLocaleString() }} |
                      No Invoice: <span class="text-red-600 font-semibold">{{ payment.invoice }}</span> |
                      Biaya: Rp {{ payment.nominal }} |
                      Nama Petugas: {{ payment.petugas }} |
                      Nama Pelanggan: {{ payment.costumer_name }} |
                      Nomor Identitas: {{ payment.costumer_identity }}
                    </li>
                  </ul>
                </div>
              </td>

              <!-- Aksi -->
              <td class="px-4 py-2 text-center align-top">
                <div class="flex flex-col items-center space-y-2">
                  <LightButton class="p-2" title="Pembayaran Tiket"><i class="pi pi-money-bill"></i></LightButton>
                  <LightButton class="p-2" title="Refund Tiket"><i class="pi pi-refresh"></i></LightButton>
                  <LightButton class="p-2" title="Reschedule Tiket"><i class="pi pi-calendar"></i></LightButton>
                  <LightButton class="p-2" title="Detail Riwayat Pembayaran Tiket"><i class="pi pi-list"></i></LightButton>
                  <DangerButton class="p-2" title="Delete Tiket"><i class="pi pi-times"></i></DangerButton>
                </div>
              </td>
          </tr>

        </tbody>
        <tbody v-else class="divide-y divide-gray-100 border-t border-gray-100">
          <tr>
            <td :colspan="totalColumns" class="px-6 py-4 text-center text-gray-500">
              Daftar transaksi tiket tidak di temukan
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <Pagination :current-page="currentPage" :total-pages="totalPages" :pages="pages" :total-columns="totalColumns" @prev-page="prevPage" @next-page="nextPage" @page-now="pageNow" />
        </tfoot>
      </table>
    </div>

  </div>
  <!-- Form Ticket Transaction -->
  <FormTicketTransaction :showForm="showTicketTransactionDialog" :maskapaiList="maskapaiList" :formData="ticketTransactionData"  @cancel="closeTicketTransactionForm" @submitted="onTicketTransactionSubmitted" />
  </template>

<script setup lang="ts">
  import DangerButton from "@/components/Button/DangerButton.vue"
  import LightButton from "@/components/Button/LightButton.vue"
  import PrimaryButton from "@/components/Button/PrimaryButton.vue"
  import Pagination from '@/components/Pagination/Pagination.vue'
  import { reactive, computed, ref, onMounted, watchEffect } from 'vue'
  import { get_transactions, getAirlines } from "@/service/trans_tiket"
  import FormTicketTransaction from './Particle/FormTicketTransaction.vue'
  import { Maskapai } from "./Particle/FormTicketTransaction.vue"
  import { TicketTransactionForm } from "./Particle/FormTicketTransaction.vue"

  const data = ref<TicketTransaction[]>([])
  const maskapaiList = ref<Maskapai[]>([])
  const currentPage = ref(1);
  const totalPages = ref(0);
  const totalColumns = ref(4);
  const searchQuery = ref('');
  const itemsPerPage = 2;
  const search = ref('');
  const filter = ref('');

  const pages = computed(() => {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  });

  interface TicketTransaction {
    id: number;
    division_id: number;
    nomor_register: string;
    total_transaksi: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    ticket_details: TicketDetail[];
    payment_histories: PaymentHistory[];
  }

  interface TicketDetail {
      id: number;
      pax: number;
      code_booking: string;
      ticket_transaction_id: number;
      airlines_id: number | null;
      airlines_name: string | null;
      departure_date: string;
      travel_price: number;
      costumer_price: number;
      createdAt: string;
      updatedAt: string;
  }

  interface PaymentHistory {
      id: number;
      invoice: string;
      costumer_name: string;
      costumer_identity: string;
      petugas: string;
      nominal: string;
      status: string;
      createdAt: string;
      updatedAt: string;
  }

  const fetchData = async () => {
    try {
      const response = await get_transactions({
        search: search.value,
        filter: filter.value,
        perpage: itemsPerPage || 10,
        pageNumber: currentPage.value || 1
      })
      data.value = response.data
      console.log("data transaction -->");
      console.log(JSON.stringify(data.value));
      totalPages.value = Math.ceil(response.total / itemsPerPage);
    } catch (error) {
      console.error('Gagal fetch data ticket transactions:', error)
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      fetchData()
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchData()
    }
  };

  const pageNow = (page : number) => {
    currentPage.value = page
    fetchData()
  }

  onMounted(() => {
    fetchData()
  })

  const calculateTotalPayment = (transaction: TicketTransaction): number => {
  return transaction.payment_histories.reduce((sum, p) => sum + parseInt(p.nominal || '0'), 0)
  }

  const showTicketTransactionDialog = ref(false)

  const ticketTransactionData = ref<TicketTransactionForm>({
      id: 0,
      tickets: [],
      customer: {
        costumer_name: '',
        costumer_identity: '',
        dibayar: 0,
      },
      nomor_register: '',
      invoice: '',
  });

  const startTicketTransaction = () => {
      fetchMaskapai();
      showTicketTransactionDialog.value = true
  }

  const closeTicketTransactionForm = () => {
      showTicketTransactionDialog.value = false
  };

  const fetchMaskapai = async () => {
      try {
        const response = await getAirlines()
        maskapaiList.value = response.data
      } catch (error) {
        console.error('Gagal fetch data cabang:', error)
      }
  };

  const onTicketTransactionSubmitted = () => {
      showTicketTransactionDialog.value = false;
      fetchData();
  };

</script>


