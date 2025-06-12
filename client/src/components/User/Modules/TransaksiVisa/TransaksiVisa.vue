<script setup lang="ts">
// Import Icon
import CetakIcon from '@/components/Icons/CetakIcon.vue'
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import PrimaryButton from "@/components/Button/PrimaryButton.vue"

// import element
import LightButton from '@/components/Button/LightButton.vue'
import DangerButton from "@/components/Button/DangerButton.vue"
import Notification from '@/components/User/Modules/TransaksiVisa/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/TransaksiVisa/Particle/Confirmation.vue'

// Import Form
import FormAdd from '@/components/User/Modules/TransaksiVisa/Widget/FormAdd.vue'

// Import Service & Vue
import { getDaftarTransaksiVisa, deleteTransaksiVisa } from '@/service/transaksi_visa';
import { ref, onMounted, computed } from 'vue';

// --- State ---
const itemsPerPage = 3;
const currentPage = ref(1);
const search = ref('');
const filter = ref('belum_ada_transaksi');
const totalPages = ref(0);
const totalColumns = ref(0);

const TransaksiVisa = ref<TransaksiVisa[]>([]);
const isFormOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData();
  }
};

const pageNow = (page : number) => {
  currentPage.value = page;
  fetchData();
}

// --- Computed Pagination ---
const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1);
});

// State untuk notifikasi & konfirmasi
const showConfirmDialog = ref<boolean>(false);
const showNotification = ref<boolean>(false);
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const confirmMessage = ref<string>('');
const confirmTitle = ref<string>('');
const confirmAction = ref<(() => void) | null>(null);

// --- Interface ---
interface TransaksiVisa {
  id : number;
  invoice : string;
  petugas : string;
  payer : string;
  payer_identity : string;
  name : string;
  identity_number : string;
  birth_place : string;
  birth_date : string;
  passport_number : string;
  valid_until : string;
  price : number;
  createdAt : string;
  jenis_visa : string; 
}

// --- Functions ---
const fetchData = async () => {
  try {
    isLoading.value = true
    
    console.log('Fetching data with params:', {
      search: search.value,
      filter: filter.value,
      perpage: itemsPerPage,
      pageNumber: currentPage.value,
    });
    
    const response = await getDaftarTransaksiVisa({
      search: search.value,
      filter: filter.value,
      perpage: itemsPerPage,
      pageNumber: currentPage.value,
    });
    
    console.log('Fetch response:', response);
    
    if (response && response.error) {
      displayNotification(response.error_msg || 'Terjadi kesalahan saat mengambil data', "error");
      return;
    }
    
    totalPages.value = Math.ceil((response?.total || 0) / itemsPerPage);
    TransaksiVisa.value = response?.data || [];

    console.log('Fetched data:', response?.data);

  } catch (error) {
    console.error('Error fetching data:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      displayNotification('Gagal terhubung ke server. Periksa koneksi internet Anda.', 'error');
    } else if (error instanceof Error) {
      displayNotification(`Error: ${error.message}`, 'error');
    } else {
      displayNotification('Gagal mengambil data. Silakan coba lagi.', 'error');
    }
  } finally {
    isLoading.value = false
  }
};

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  setTimeout(() => {
    notificationMessage.value = message;
    notificationType.value = type;
    showNotification.value = true;
  }, 100);
};

const handleSaveSuccess = (message: string) => {
  displayNotification(message, 'success');
};

const showConfirmation = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title;
  confirmMessage.value = message;
  confirmAction.value = action;
  showConfirmDialog.value = true;
};

// --- Lifecycle Hook ---
onMounted(async () => {
  await fetchData();
  totalColumns.value = document.querySelectorAll("thead th").length;
});

const deleteItem = async (id: number) => {
  try {
    console.log('Attempting to delete item with ID:', id);
    
    const response = await deleteTransaksiVisa(id);
    
    console.log('Delete response:', response);
    
    if (response && response.error) {
      displayNotification(response.error_msg || 'Terjadi kesalahan saat menghapus data', 'error');
    } else if (response && response.success) {
      displayNotification('Data transaksi berhasil dihapus.', 'success');
      await fetchData();
    } else if (response && response.success) {
      displayNotification(response.message || 'Data transaksi berhasil dihapus.', 'success');
      await fetchData();
    } else {
      displayNotification(response.error_msg || 'Gagal menghapus data.', 'error');
    }
    
  } catch (error) {
    console.error('Error deleting data:', error);
    
    // Cek jenis error yang lebih spesifik
    if (error instanceof TypeError && error.message.includes('fetch')) {
      displayNotification('Gagal terhubung ke server. Periksa koneksi internet Anda.', 'error');
    } else if (error instanceof Error) {
      displayNotification(`Error: ${error.message}`, 'error');
    } else {
      displayNotification('Gagal menghapus data. Silakan coba lagi.', 'error');
    }
  } finally {
    showConfirmDialog.value = false;
  }
};

const handleDelete = (id: number) => {
  showConfirmation(
    'Konfirmasi Hapus',
    'Apakah Anda yakin ingin menghapus data transaksi ini secara permanen?',
    () => deleteItem(id)
  );
};

// Fungsi untuk handle konfirmasi
const handleConfirm = () => {
  if (confirmAction.value) {
    confirmAction.value();
  }
  showConfirmDialog.value = false;
};

const handleCancelConfirm = () => {
  showConfirmDialog.value = false;
};

// Fungsi placeholder untuk cetak (belum diimplementasi)
const openFormCetakDataJamaah = (item: any) => {
  console.log('Cetak data untuk:', item);
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
      <PrimaryButton @click="isFormOpen = true">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Transaksi Visa
      </PrimaryButton>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label for="search" class="text-sm font-medium text-gray-700">Search</label>
        <input
          type="text"
          id="search"
          class="w-full sm:w-72 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          v-model="search"
          @input="fetchData"
          placeholder="Cari berdasarkan Invoice..."
        />
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-xs text-gray-700">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[10%] px-6 py-4 font-bold text-center">Nomor Invoice</th>
            <th class="w-[20%] px-6 py-4 font-bold text-center">Info Pembayar</th>
            <th class="w-[30%] px-6 py-4 font-bold text-center">Info Visa</th>
            <th class="w-[15%] px-6 py-4 font-bold text-center">Total</th>
            <th class="w-[15%] px-6 py-4 font-bold text-center">Tanggal</th>
            <th class="w-[10%] px-6 py-4 font-bold text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <tr v-if="isLoading">
            <td colspan="6" class="px-6 py-6 text-center">
              <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="TransaksiVisa.length === 0">
            <td colspan="6" class="px-6 py-6 text-center text-gray-500">
              {{ search ? 'Data tidak ditemukan' : 'Belum ada data transaksi visa' }}
            </td>
          </tr>
          <tr v-for="item in TransaksiVisa" :key="item.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 text-center">{{ item.invoice }}</td>
            <td class="px-6 py-4 text-center">
              {{ item.payer }}<br />
              <span class="text-xs text-gray-500">{{ item.payer_identity }}</span>
            </td>
            <td class="px-6 py-4">
              <h1 class="font-bold">{{ item.jenis_visa }}</h1>
              <div class="text-xs leading-5 space-y-1">
                <div>Nama: {{ item.name }}</div>
                <div>No ID: {{ item.identity_number }}</div>
                <div>TTL: {{ item.birth_place }} - {{ item.birth_date }}</div>
                <div>Passport: {{ item.passport_number }}</div>
                <div>Expired: {{ item.valid_until }}</div>
                <div>Harga: Rp {{ item.price.toLocaleString() }}</div>
              </div>
            </td>
            <td class="px-6 py-4 text-center">Rp. {{ item.price.toLocaleString() }}</td>
            <td class="px-6 py-2 text-xs text-center">{{ new Date(item.createdAt).toLocaleDateString('id-ID') }}</td>
            <td class="px-6 py-4 flex items-center justify-center gap-2">
              <LightButton title="Cetak Data Jamaah" @click="openFormCetakDataJamaah(item)">
                <CetakIcon class="h-4 w-4 text-gray-600" />
              </LightButton>

              <DangerButton title="Delete" @click="handleDelete(item.id)">
                <DeleteIcon class="w-5 h-5" />
              </DangerButton>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold ">
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

    <!-- Notification Component -->
    <Notification 
      v-if="showNotification" 
      :show-notification="showNotification"
      :notification-message="notificationMessage" 
      :notification-type="notificationType"
      @close="showNotification = false" 
    />

    <!-- Confirmation Component -->
    <Confirmation 
      v-if="showConfirmDialog" 
      :show-confirm-dialog="showConfirmDialog"
      :confirm-title="confirmTitle" 
      :confirm-message="confirmMessage" 
      @close="handleCancelConfirm"
    >
      <button
        type="button"
        class="w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleConfirm"
      >
        Hapus
      </button>
      <button
        type="button"
        class="mt-3 w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="handleCancelConfirm"
      >
        Batal
      </button>
    </Confirmation>

    <!-- Form Add Component -->
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
        @close="isFormOpen = false; fetchData()"
        @save-success="handleSaveSuccess" 
      />
    </transition>
  </div>
</template>