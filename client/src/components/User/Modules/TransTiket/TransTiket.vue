<template>
  <div class="container mx-auto px-4 mt-10">
    <div class="flex justify-between items-center mb-6">
      <PrimaryButton @click="startTicketTransaction">
        <i class="pi pi-plus"></i> Mulai Transaksi Tiket
      </PrimaryButton>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input type="text" v-model="searchQuery" id="search" class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          placeholder="Cari data..." />
      </div>
    </div>
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr class="bg-gray-100">
            <th class="w-[15%] px-6 py-3 font-medium font-bold text-gray-900 text-center">Nomor Register</th>
            <th class="w-[45%] px-6 py-3 font-medium font-bold text-gray-900 text-center">Info Tiket</th>
            <th class="w-[35%] px-6 py-3 font-medium font-bold text-gray-900 text-center">Info Pembayaran</th>
            <th class="w-[5%] px-6 py-3 font-medium font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="data.length" class="divide-y divide-gray-100 border-t border-gray-100">
          <tr v-for="transaction in data" :key="transaction?.id" :class="transaction.status != 'active' ? ' pointer-events-none opacity-50 ' : '' ">
            <td class="px-4 py-2 align-top text-sm text-gray-800 whitespace-nowrap">
              <div class="font-bold text-sm">{{ transaction.nomor_registrasi }}</div>
              <div class="text-xs text-gray-500">
                {{ new Date(transaction.updatedAt).toLocaleString() }}
              </div>
            </td>
            <td class="px-4 py-2 text-sm text-gray-700 align-top w-[480px]">
              <div class="grid grid-cols-2 gap-x-6 gap-y-1 text-xs leading-snug">
                  <div class="text-red-500">KODE BOOKING: <b>{{ transaction.code_booking }}</b></div>
                  <div>PAX: {{ transaction.pax }}</div>
                  <div>NAMA AIRLINES: {{ transaction.airlines_name || 'N/A' }}</div>
                  <div>HARGA TRAVEL: Rp {{ transaction.travel_price.toLocaleString() }}</div>
                  <div>TANGGAL BERANGKAT: {{ transaction.departure_date }} </div>
                  <div>HARGA KOSTUMER: Rp {{ transaction.costumer_price.toLocaleString() }}</div>
                </div>
              <div class="bg-red-100 mt-2 px-4 py-1 text-sm font-bold flex justify-between items-center w-full">
                <span>SUBTOTAL</span>
                <span class="text-red-500" >: Rp {{ (transaction.costumer_price  * transaction.pax).toLocaleString() }}</span>
              </div>
            </td>
            <td class="px-4 py-2 text-xs text-gray-700 align-top">
              <div class="space-y-1" v-if="transaction.status == 'active'">
                <template v-if="transaction.paket_name">
                  <strong>NAMA PAKET</strong> : {{ transaction.paket_name || 'N/A' }}
                </template>
                <template v-else>
                  <div>
                    <strong>NAMA PELANGGAN</strong> : {{ transaction.costumer_name || 'N/A' }}
                  </div>
                </template>
                <div>
                  <strong>TOTAL TRANSAKSI TIKET</strong> : Rp {{ (transaction.costumer_price  * transaction.pax).toLocaleString() }}
                </div>
                <div>
                  <strong>TOTAL PEMBAYARAN</strong> : Rp {{ calculateTotalPayment(transaction).toLocaleString() }}
                </div>
                <div>
                  <strong>SISA PEMBAYARAN</strong> : Rp {{ ( (transaction.costumer_price  * transaction.pax) - calculateTotalPayment(transaction) ).toLocaleString() }}
                </div>
              </div>
              <div class="space-y-1 text-center py-5" v-if="transaction.status == 'refund'">
                <strong class="text-red">TRANSAKSI SUDAH DIREFUND</strong>
              </div>
              <div v-if="transaction.payment_histories.length" class="mt-2 text-xs text-gray-600 border-t pt-2">
                <div class="text-red-500 italic font-medium">RIWAYAT PEMBAYARAN (Tiga transaksi terakhir)</div>
                <table class="w-full mb-5">
                  <tbody>
                    <tr  v-for="payment in transaction.payment_histories.slice(0, 3)" :key="payment.id">
                      <td class="w-[30%] border-b border-dashed px-0 py-2 align-top">{{ new Date(payment.createdAt).toLocaleString() }}</td>
                      <td class="text-left space-y-2 text-xs border-b border-dashed px-0 py-2 align-top">Invoice: <span class="text-red-600 font-semibold">{{ payment.invoice }}</span> | Biaya: {{ formatRupiah(payment.nominal) }} | Nama Petugas: {{ payment.petugas }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
            <td class="px-4 py-2 text-center align-top">
              <div class="flex flex-col items-center space-y-2">
                <LightButton v-if=" (transaction.costumer_price  * transaction.pax) > calculateTotalPayment(transaction) && transaction.status == 'active'" class="p-2" title="Pembayaran Tiket" @click="openPembayaranForm(transaction.id)">
                  <i class="pi pi-money-bill"></i>
                </LightButton>
                <LightButton v-if="transaction.status == 'active'" @click="openModalRefund(transaction.id)" class="p-2" title="Refund Tiket" >
                  <i class="pi pi-refresh"></i>
                </LightButton>
                <LightButton @click="openModalEdit(transaction.id)" class="p-2" title="Edit Transaksi Tiket" v-if="transaction.status == 'active'">
                  <i class="pi pi-pencil"></i>
                </LightButton>
                <LightButton class="p-2" @click="openModalDetail(transaction.nomor_registrasi)" v-if="transaction.status == 'active'" title="Detail Riwayat Pembayaran Tiket">
                  <i class="pi pi-list"></i>
                </LightButton>
                <DangerButton class="p-2" title="Delete Tiket" v-if="transaction.status == 'active'">
                  <i class="pi pi-times"></i>
                </DangerButton>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else class="divide-y divide-gray-100 border-t border-gray-100">
          <tr>
            <td :colspan="totalColumns" class="px-6 py-3 text-center text-gray-500">
              Daftar transaksi tiket tidak di temukan
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <Pagination :current-page="currentPage" :total-pages="totalPages" :pages="pages" :total-columns="totalColumns" @prev-page="prevPage" @next-page="nextPage" @page-now="pageNow"/>
        </tfoot>
      </table>
    </div>
  </div>
  <!-- Form untuk memulai transaksi pembelian tiket -->
  <FormTicketTransaction :showForm="showTicketTransactionDialog" @cancel="closeTicketTransactionForm" @submitted="onTicketTransactionSubmitted"/>
  <!-- Form untuk pembayaran tiket -->
  <FormPembayaranTiket :formStatus="showModalPembayaran" :id="idPembayaranTicket" @cancel="showModalPembayaran = false" @submitted=" () => { showModalPembayaran = false; fetchData(); } "/>
  <!-- Form untuk transaksi refund -->
  <FormRefun :formStatus="showModalRefund" :id="idRefundTicket" @cancel="showModalRefund = false" @close="showModalRefund = false" @submitted="() => { showModalRefund = false; fetchData(); }"/>


  <DetailTiket :formStatus="ShowModalDetail" :nomor_register="nomor_register" @cancel="closeModalDetail"/>
  <!-- showModalEdit.value = true
  idEditTicket.value = id -->
  <FormEdit :formStatus="showModalEdit" :id="idEditTicket" @cancel="showModalEdit = false" @close="showModalEdit = false" @submitted="() => {showModalEdit = false; fetchData();}"/>
  <Notification :showNotification="showNotification" :notificationType="notificationType" :notificationMessage="notificationMessage" @close="showNotification = false" />
</template>

<script setup lang="ts">
import DangerButton from '@/components/Button/DangerButton.vue'
import LightButton from '@/components/Button/LightButton.vue'
import PrimaryButton from '@/components/Button/PrimaryButton.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import Notification from '@/components/Modal/Notification.vue'
import { reactive, computed, ref, onMounted, watchEffect } from 'vue'
import { get_transactions, getAirlines } from '@/service/trans_tiket'
import FormTicketTransaction from './Particle/FormTicketTransaction.vue'
import FormPembayaranTiket from './Particle/FormPembayaranTiket.vue'
import FormEdit from './Particle/FormEdit.vue'
import FormRefun from './Particle/FormRefun.vue'
import DetailTiket from './Particle/DetailTiket.vue'
import { Maskapai } from './Particle/FormTicketTransaction.vue'
import { TicketTransactionForm } from './Particle/FormTicketTransaction.vue'
import { register } from 'module'

const data = ref<TicketTransaction[]>([])
// const maskapaiList = ref<Maskapai[]>([])
const currentPage = ref(1)
const totalPages = ref(0)
const totalColumns = ref(4)
const searchQuery = ref('')
const itemsPerPage = 2
const search = ref('')
const filter = ref('')
const idPembayaranTicket = ref(0);
const idRefundTicket = ref(0);
const idEditTicket = ref(0);

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('')
const timeoutId = ref<number | null>(null)

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  resetNotificationTimeout()
}

const resetNotificationTimeout = () => {
  if (timeoutId.value) clearTimeout(timeoutId.value)
  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// const RefundSuccess = () => {
//   showModalRefund.value = false
//   displayNotification('Refund berhasil', 'success')
// }

const handleReschedule = () => {
  showModalReschedule.value = false
  displayNotification('Reschedule berhasil', 'success')
}

// const handleSuccess = () => {
//   showModalPembayaran.value = false
// }

const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})

interface TicketTransaction {
  id: number
  division_id: number
  nomor_registrasi: string
  costumer_id: number
  costumer_name: string
  pax: number
  code_booking: string
  airlines_name: string | null
  departure_date: string
  travel_price: number
  costumer_price: number
  paket_name: string
  status: string
  createdAt: string
  updatedAt: string
  payment_histories: PaymentHistory[]
}

// interface TicketDetail {
//   id: number
//

//   ticket_transaction_id: number
//   airlines_id: number | null

//   costumer_price: number
//   createdAt: string
//   updatedAt: string
// }

interface PaymentHistory {
  id: number
  invoice: string
  paket_name: string
  petugas: string
  nominal: string
  status: string
  createdAt: string
  updatedAt: string
}

const fetchData = async () => {
  try {
    const response = await get_transactions({
      search: search.value,
      filter: filter.value,
      perpage: itemsPerPage || 10,
      pageNumber: currentPage.value || 1,
    })
    data.value = response.data
    console.log('data transaction -->')
    console.log(JSON.stringify(data.value))
    totalPages.value = Math.ceil(response.total / itemsPerPage)
  } catch (error) {
    console.error('Gagal fetch data ticket transactions:', error)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchData()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchData()
  }
}

const pageNow = (page: number) => {
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
})

const startTicketTransaction = () => {
  showTicketTransactionDialog.value = true
}

const closeTicketTransactionForm = () => {
  showTicketTransactionDialog.value = false
}

const showModalEdit = ref(false)
const openModalEdit = (id: number) => {
  showModalEdit.value = true
  idEditTicket.value = id
}

const onTicketTransactionSubmitted = () => {
  showTicketTransactionDialog.value = false
  fetchData()
}

const showModalRefund = ref(false)

const openModalRefund = (id: number) => {
  showModalRefund.value = true
  idRefundTicket.value = id;
  // nomor_register.value = register_number
}

const ShowModalDetail = ref(false)
const nomor_register = ref('')

const closeModalDetail = () => {
  ShowModalDetail.value = false
  nomor_register.value = ''
}

const openModalDetail = (register_number: string) => {
  nomor_register.value = register_number
  console.log('SET NOMOR REGISTER:', register_number)
  ShowModalDetail.value = true
}

const showModalPembayaran = ref(false)

const pembayaranData = ref({
  ticket_transaction_id: 0,
  nominal: 0,
  costumer_name: '',
  costumer_id: 0,
  paket_name: '',
})

const openPembayaranForm = (id: number) => {
  idPembayaranTicket.value = id;
  showModalPembayaran.value = true
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
</script>
