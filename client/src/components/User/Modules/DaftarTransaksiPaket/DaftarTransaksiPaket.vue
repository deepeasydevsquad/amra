<script setup lang="ts">
// Import Icon
import DeleteIcon from '@/components/User/Modules/DaftarTransaksiPaket/Icon/DeleteIcon.vue'
import EditIcon from '@/components/User/Modules/DaftarTransaksiPaket/Icon/EditIcon.vue'
import RefundIcon from '@/components/User/Modules/DaftarTransaksiPaket/Icon/RefundIcon.vue'

// import element
import DangerButton from '@/components/User/Modules/DaftarTransaksiPaket/Particle/DangerButton.vue'
import EditButton from '@/components/User/Modules/DaftarTransaksiPaket/Particle/EditButton.vue'
import LightButton from '@/components/User/Modules/DaftarTransaksiPaket/Particle/LightButton.vue'
import Notification from '@/components/User/Modules/DaftarTransaksiPaket/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/DaftarTransaksiPaket/Particle/Confirmation.vue'

// import widget
import FormAdd from '@/components/User/Modules/DaftarTransaksiPaket/Widgets/FormAdd.vue'
import FormEditVisa from '@/components/User/Modules/DaftarTransaksiPaket/Widgets/FormEditVisa.vue'
import FormRefund from '@/components/User/Modules/DaftarTransaksiPaket/Widgets/FormRefund.vue'
import Pagination from '@/components/Pagination/Pagination.vue'

// Import service API
import { daftarTransaksiPaket, deleteTransaksiPaket } from '@/service/daftar_transaksi_paket';
import { ref, onMounted, computed } from 'vue';

const props = defineProps<{
  paketId: number
  search: string | null
  showBackButton?: boolean
  showAddTransactionButton?: boolean
}>()

const { showBackButton = false, showAddTransactionButton = false } = props

const isLoading = ref(false);
const itemsPerPage = 100; // Jumlah daftar transaksi per halaman
const currentPage = ref(1);
const search = ref("");
const totalPages = ref(0);
const timeoutId = ref<number | null>(null);

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

// Generate array angka halaman
const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1);
});

interface PaketTransaction {
    id: number;
    paket_id: number;
    name: string;
    departure_date: string;
    type: string;
    total_price: number;
    price: number;
    sisa: number;
    jamaah_id: number;
    fullname: string;
    identity_number: string;
    nomor_visa: string;
    tanggal_berlaku_visa: string;
    tanggal_berakhir_visa: string;
    biaya_mahram: number;
}

const dataPaketTransaction = ref<PaketTransaction[]>([]);
const transpaketId = ref<number | null>(null);
const isFormOpen = ref<boolean>(false);
const isFormEditVisaOpen = ref<boolean>(false);
const isFormRefundOpen = ref<boolean>(false);
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const showNotification = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const confirmMessage = ref<string>('');
const confirmTitle = ref<string>('');
const confirmAction = ref<(() => void) | null>(null);
const totalColumns = ref(7);

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;

  if (timeoutId.value) clearTimeout(timeoutId.value);

  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

const showConfirmation = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title;
  confirmMessage.value = message;
  confirmAction.value = action;
  showConfirmDialog.value = true;
};

const openForm = () => {
  isFormOpen.value = true;
};

const openFormEditVisa = (id: number) => {
  isFormEditVisaOpen.value = true;
  transpaketId.value = id;
};

const openFormRefund = (id: number) => {
  isFormRefundOpen.value = true;
  transpaketId.value = id;
};

const fetchData = async () => {
  try {
    isLoading.value = true
    search.value = props.search ? props.search : search.value
    const response = await daftarTransaksiPaket({
      id: props.paketId,
      search: search.value,
      perpage: itemsPerPage,
      pageNumber: currentPage.value
    });
    dataPaketTransaction.value = response.data;
    totalPages.value = Math.ceil(response.total / itemsPerPage);
  } catch (error) {
    console.error('Error fetching data:', error);
    displayNotification(error?.response?.data?.error_msg || 'Gagal memuat data transaksi paket', 'error');
  } finally {
    isLoading.value = false
  }
};

async function deleteData(transpaketId: number) {
  showConfirmation(
    'Konfirmasi Hapus',
    'Apakah Anda yakin ingin menghapus data ini?',
    async () => {
      try {
        await deleteTransaksiPaket(props.paketId, transpaketId)
        showConfirmDialog.value = false
        displayNotification('Data berhasil dihapus!', 'success')
        fetchData()
      } catch (error) {
        console.error('Error deleting data:', error)
        displayNotification(error?.response?.data?.error_msg, 'error')
      }
    }
  );
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
  fetchData();
})
</script>

<template>
  <div class="p-4 bg-white min-h-screen">
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
    </div>
    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <div class="flex items-center gap-2">
        <button
          v-if="props.showBackButton"
          @click="$emit('close')"
          class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2"
          >
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="w-5 h-5 mr-1" />
          Kembali
        </button>
        <button
          v-if="props.showAddTransactionButton"
          @click="openForm()"
          class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2" >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Mulai transaksi
        </button>
      </div>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="search"
          @change="fetchData()"
          placeholder="Cari Jamaah..."
        />
      </div>
    </div>

    <!-- Table data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="w-[20%] px-6 py-3 font-medium text-gray-900 text-center">Paket</th>
            <th class="w-[15%] px-6 py-3 font-medium text-gray-900 text-center">Tipe Paket</th>
            <th class="w-[25%] px-6 py-3 font-medium text-gray-900 text-center">Jamaah</th>
            <th class="w-[10%] px-6 py-3 font-medium text-gray-900 text-center">Total Harga</th>
            <th class="w-[15%] px-6 py-3 font-medium text-gray-900 text-center">Status Pembayaran</th>
            <th class="w-[15%] px-6 py-3 font-medium text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="dataPaketTransaction && dataPaketTransaction.length > 0">
            <tr v-for="dataTransPaket in dataPaketTransaction" :key="dataTransPaket.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-center">
                {{ dataTransPaket.name.toUpperCase() }} <br>
                (Tgl Keberangkatan: {{ dataTransPaket.departure_date }})
              </td>
              <td class="px-6 py-4 text-center">
                {{ dataTransPaket.type }} <br>
                ({{ dataTransPaket.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) }})
              </td>
              <td class="px-6 py-4">
                <ul class="list-disc list-inside text-sm">
                  <li class="items-center gap-1">{{ dataTransPaket.fullname }} </li>
                  <li class="pl-3 flex items-center gap-1">(No ID: {{ dataTransPaket.identity_number }})</li>
                  <li class="pt-6 font-bold items-center gap-1">No Visa: {{ dataTransPaket.nomor_visa }}</li>
                  <li class="font-bold items-center gap-1">Tanggal Berlaku Visa: {{ dataTransPaket.tanggal_berlaku_visa }}</li>
                  <li class="font-bold items-center gap-1">Tanggal Berakhir Visa: {{ dataTransPaket.tanggal_berakhir_visa }}</li>
                </ul>
              </td>
              <td class="px-6 py-4 text-center">{{  formatRupiah( dataTransPaket.total_price ?? 0) }}</td>
              <td class="px-6 py-4">
                <ul class="list-disc list-inside text-sm">
                  <li class="items-center gap-1"> <strong>Biaya Mahram: </strong> <br> {{ formatRupiah( dataTransPaket.biaya_mahram ?? 0) }} </li>
                  <li class="items-center gap-1"> <strong>Sudah Bayar: </strong> <br> {{ formatRupiah(  dataTransPaket.total_price ?? 0) }} </li>
                  <li class="items-center gap-1"> <strong>Sisa: </strong> <br> {{ formatRupiah( dataTransPaket.sisa ?? 0) }} </li>
                </ul>
              </td>
              <td class="px-6 py-4 text-center flex gap-2 justify-center">
                <LightButton @click="openFormRefund(dataTransPaket.id)" title="Refund Transaksi Paket">
                  <RefundIcon class="h-4 w-4 text-gray-600" />
                </LightButton>
                <EditButton @click="openFormEditVisa(dataTransPaket.id)" title="Update Informasi Visa">
                  <EditIcon></EditIcon>
                </EditButton>
                <DangerButton @click="deleteData(dataTransPaket.id, )" title="Hapus Transaksi Paket">
                  <DeleteIcon></DeleteIcon>
                </DangerButton>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td :colspan=totalColumns class="px-6 py-3 text-center text-sm text-gray-600">Daftar Transaksi Paket Tidak Ditemukan.</td>
          </tr>
        </tbody>
          <tfoot class="bg-gray-100 font-bold">
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :pages="pages"
              :total-columns="totalColumns"
              @prev-page="prevPage"
              @next-page="nextPage"
              @page-now="pageNow"
            />
          </tfoot>
      </table>
    </div>
  </div>

  <!-- Form Pengembalian Barang Handover -->
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <FormAdd
      v-if="isFormOpen"
      :isFormOpen="isFormOpen"
      :paketId="props.paketId"
      @close="isFormOpen= false; fetchData()"
      @status="(payload) => displayNotification(payload.err_msg || 'Pengembalian Barang gagal ditambahkan', payload.error ? 'error' : 'success')"
      />
  </transition>


  <!-- Form Edit Visa -->
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <FormEditVisa
      v-if="isFormEditVisaOpen"
      :isFormEditVisaOpen="isFormEditVisaOpen"
      :paketId="props.paketId"
      :transpaketId="transpaketId"
      @close="isFormEditVisaOpen= false; fetchData()"
      @status="(payload) => displayNotification(payload.err_msg || 'Pengembalian Barang gagal ditambahkan', payload.error ? 'error' : 'success')"
      />
  </transition>

  <!-- Form Refund -->
  <transition
    v-if="isFormRefundOpen"
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <FormRefund
      v-if="isFormRefundOpen"
      :isFormRefundOpen="isFormRefundOpen"
      :paketId="props.paketId"
      :transpaketId="transpaketId"
      @close="isFormRefundOpen= false; fetchData()"
      @status="(payload) => displayNotification(payload.err_msg || 'Pengembalian Barang gagal ditambahkan', payload.error ? 'error' : 'success')"
      />
  </transition>

  <!-- Confirmation Dialog -->
  <Confirmation
    :showConfirmDialog="showConfirmDialog"
    :confirmTitle="confirmTitle"
    :confirmMessage="confirmMessage"
  >
    <button @click="confirmAction && confirmAction()" class="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">
      Ya
    </button>
    <button @click="showConfirmDialog = false" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
      Tidak
    </button>
  </Confirmation>

  <!-- Notification -->
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>
