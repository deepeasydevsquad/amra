<script setup lang="ts">
// Import Icon
import DeleteIcon from '@/components/User/Modules/Supplier/Icon/DeleteIcon.vue'
import EditIcon from '@/components/User/Modules/Supplier/Icon/EditIcon.vue'

// import element
import DangerButton from '@/components/User/Modules/Supplier/Particle/DangerButton.vue'
import LightButton from "@/components/Button/LightButton.vue"
import Notification from '@/components/User/Modules/Supplier/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/Supplier/Particle/Confirmation.vue'

import Pagination from '@/components/Pagination/Pagination.vue'
import PrimaryButton from "@/components/Button/PrimaryButton.vue"

// Import service API
// import { daftarSupplier, daftarBank, addSupplier, editSupplier, deleteSupplier } from '@/service/supplier'; // Import function POST
import { paramCabang  } from '@/service/param_cabang';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

interface filterCabang {
  id: number;
  name: string;
}

const itemsPerPage = 100; // Jumlah supplier per halaman
const currentPage = ref(1);
const search = ref("");
const totalPages = ref(0);
const selectedOptionCabang = ref(0);
const optionFilterCabang = ref<filterCabang[]>([]);

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

interface Supplier {
  id: number;
  name: string;
  address: string;
  bank: string;
  bank_id: string;
  nomor_rekening: string;
}

interface EditSupplier {
  id: number;
  name: string;
  address: string;
  bank_id: string;
  nomor_rekening: string;
}

interface Bank {
  id: number;
  name: string;
}

interface Errors {
  name: string;
  address: string;
  bank: string;
  nomor_rekening: string;
}

const timeoutId = ref<number | null>(null);
const dataSupplier = ref<Supplier[]>([]);
const dataBank = ref<Bank[]>([]);
const isModalOpen = ref<boolean>(false);
const showNotification = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const confirmMessage = ref<string>('');
const confirmTitle = ref<string>('');
const confirmAction = ref<(() => void) | null>(null);
const totalColumns = ref(6);
const totalRow = ref(0);

const selectedSupplier = ref<Partial<EditSupplier>>({
  name: '',
  address: '',
  bank_id: '',
  nomor_rekening: ''
});

const errors = ref<Errors>({
  name: '',
  address: '',
  bank: '',
  nomor_rekening: ''
});

const fetchFilterData = async() => {
  const response = await paramCabang();
  optionFilterCabang.value = response.data;
  selectedOptionCabang.value = response.data[0].id;
  await fetchData();
}

const fetchData = async () => {
    try {
        // // Fetch data secara paralel untuk efisiensi
        // const [supplierResponse, bankResponse] = await Promise.all([
        //     daftarSupplier({
        //         search: search.value,
        //         perpage: itemsPerPage,
        //         pageNumber: currentPage.value,
        //     }),
        //     daftarBank({
        //         search: search.value,
        //         perpage: itemsPerPage,
        //         pageNumber: currentPage.value,
        //     }),
        // ]);

        // if (supplierResponse?.error) {
        //     displayNotification(supplierResponse.error_msg || "Gagal mengambil data supplier", "error");
        //     return;
        // }

        // dataBank.value = bankResponse?.data || [];
        // dataSupplier.value = supplierResponse?.data || [];
        // totalPages.value = supplierResponse?.total ? Math.ceil(supplierResponse.total / itemsPerPage) : 0;

    } catch (error) {
        // Notifikasi jika ada kesalahan sistem atau jaringan
        displayNotification("Terjadi kesalahan saat mengambil data, coba lagi nanti.", "error");
        console.error("Fetch Data Error:", error);
    }
};

const openModal = (supplier?: Supplier) => {
  selectedSupplier.value = supplier ? { ...{ id: supplier.id, name: supplier.name, address: supplier.address, bank_id: supplier.bank_id, nomor_rekening: supplier.nomor_rekening } } : { name: '', address: '', bank_id: '0',  nomor_rekening: '' };


  console.log('Informasi Edit Supplier');
  console.log(selectedSupplier.value);
  console.log('Informasi Edit Supplier');
  isModalOpen.value = true;
};

onMounted(async () => {
  await fetchFilterData(); // Pastikan data sudah diambil sebelum menghitung jumlah kolom
  // totalColumns.value = document.querySelectorAll("thead th").length;
});

// const validateForm = (): boolean => {
//   errors.value = { name: '', address: '', bank: '', nomor_rekening: '' };
//   let isValid = true;

//   if (!selectedSupplier.value.name?.trim()) {
//     errors.value.name = 'Nama tidak boleh kosong';
//     isValid = false;
//   }
//   if (!selectedSupplier.value.address?.trim()) {
//     errors.value.address = 'Alamat tidak boleh kosong';
//     isValid = false;
//   }
//   if (!selectedSupplier.value.bank_id?.toString().trim()) {
//     errors.value.bank = 'Bank tidak boleh kosong';
//     isValid = false;
//   }
//   if (!selectedSupplier.value.nomor_rekening) {
//     errors.value.nomor_rekening = 'Nomor rekening tidak boleh kosong';
//     isValid = false;
//   }
//   return isValid;
// };

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

// const saveData = async () => {
//   if (!validateForm()) return;

//   const isEdit = !!selectedSupplier.value.id;
//   const action = async () => {
//     try {
//       if (isEdit) {
//         const response = await editSupplier(selectedSupplier.value.id, selectedSupplier.value );
//         showConfirmDialog.value = false;
//         displayNotification(response.error_msg);
//       } else {
//         const response = await addSupplier(selectedSupplier.value);
//         showConfirmDialog.value = false;
//         displayNotification(response.error_msg);
//       }
//       isModalOpen.value = false;
//       fetchData();
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         displayNotification(error.response?.data?.error_msg || 'Terjadi kesalahan saat menyimpan data.', 'error');
//       } else {
//         displayNotification('Terjadi kesalahan yang tidak terduga.', 'error');
//       }
//       showConfirmDialog.value = false;
//     }
//   };

//   isEdit ? showConfirmation('Konfirmasi Perubahan', 'Apakah Anda yakin ingin mengubah data ini?', action) : action();
// };

// const deleteData = async (id: number) => {
//   showConfirmation(
//     'Konfirmasi Hapus',
//     'Apakah Anda yakin ingin menghapus data ini?',
//     async () => {
//       try {
//         const response = await deleteSupplier(id);
//         showConfirmDialog.value = false;
//         displayNotification(response.error_msg);
//         fetchData();
//       } catch (error) {
//         console.error('Error deleting data:', error);
//         displayNotification('Terjadi kesalahan saat menghapus data.', 'error');
//       }
//     }
//   );
// };

</script>

<template>
  <div class="container mx-auto px-4 mt-10">
    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-6">
      <PrimaryButton @click="openModal()">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Transaksi Keluar Masuk
      </PrimaryButton>
      <div class="flex items-center">
        <input v-model="search" type="text" placeholder="Cari Nomor Invoice..."
        class="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-s-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
        <select  v-model="selectedOptionCabang" style="width: 300px;" @change="fetchData()" class="border-t border-b border-e bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option v-for="optionC in optionFilterCabang" :key="optionC.id" :value="optionC.id">
              {{ optionC.name }}
            </option>
          </select>
      </div>
    </div>
    <!-- Table data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-100">
          <tr>
            <th class="w-[10%] px-6 py-3 font-medium text-gray-900 text-center">Nomor Invoice</th>
            <th class="w-[20%] px-6 py-3 font-medium text-gray-900 text-center">Dibayar/Diterima Dari</th>
            <th class="w-[30%] px-6 py-3 font-medium text-gray-900 text-center">Akun Terlibat</th>
            <th class="w-[15%] px-6 py-3 font-medium text-gray-900 text-center">Status Kwitansi</th>
            <th class="w-[15%] px-6 py-3 font-medium text-gray-900 text-center">Tanggal Transaksi</th>
            <th class="w-[10%] px-6 py-3 font-medium text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="dataSupplier && dataSupplier.length > 0">
            <tr v-for="supplier in dataSupplier" :key="supplier.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-center">{{ supplier.name }}</td>
              <td class="px-6 py-4 text-center">{{ supplier.address }}</td>
              <td class="px-6 py-4 text-center">{{ supplier.bank }}</td>
              <td class="px-6 py-4 text-center">{{ supplier.nomor_rekening }}</td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                  <LightButton @click="openModal(supplier)">
                    <EditIcon></EditIcon>
                  </LightButton>
                  <DangerButton @click="deleteData(supplier.id)">
                    <DeleteIcon></DeleteIcon>
                  </DangerButton>
                </div>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-600">Daftar Transaksi Keluar Masuk Tidak Ditemukan.</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <Pagination :current-page="currentPage" :total-pages="totalPages" :pages="pages" :total-columns="totalColumns" @prev-page="prevPage" @next-page="nextPage" @page-now="pageNow" :totalRow="totalRow" />
        </tfoot>
      </table>
    </div>
    <!-- Modal Form -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="isModalOpen = false"></div>
          <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
          <div class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-2xl flex justify-center font-bold leading-6 text-gray-900 mb-4">
                {{ selectedSupplier.id ? "Edit Data Supplier" : "Tambah Supplier Baru" }}
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Supplier</label>
                  <input
                    v-model="selectedSupplier.name"
                    type="text"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal"
                    placeholder="Nama Supplier"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Supplier</label>
                  <textarea
                    v-model="selectedSupplier.address"
                    rows="3"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal"
                    placeholder="Deskripsi Supplier"
                  ></textarea>
                  <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                  <select
                    v-model="selectedSupplier.bank_id"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal"
                  >
                    <option value="0">Pilih Bank</option>
                    <option v-for="bank in dataBank" :key="bank.id" :value="bank.id">{{ bank.name }}</option>
                  </select>
                  <p v-if="errors.bank" class="mt-1 text-sm text-red-600">{{ errors.bank }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
                  <input
                    v-model="selectedSupplier.nomor_rekening"
                    type="text"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 font-normal"
                    placeholder="Nomor Rekening Supplier"
                  />
                  <p v-if="errors.nomor_rekening" class="mt-1 text-sm text-red-600">{{ errors.nomor_rekening }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                @click="saveData"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-[#333a48] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ selectedSupplier.id ? "Simpan Perubahan" : "Tambah" }}
              </button>
              <button
                @click="isModalOpen = false"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Dialog -->
    <Confirmation  :showConfirmDialog="showConfirmDialog"  :confirmTitle="confirmTitle" :confirmMessage="confirmMessage" >
      <button @click="confirmAction && confirmAction()"
        class="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Ya
      </button>
      <button
        @click="showConfirmDialog = false"
        class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Tidak
      </button>
    </Confirmation>

    <!-- Notification Popup -->
    <Notification  :showNotification="showNotification"  :notificationType="notificationType" :notificationMessage="notificationMessage" @close="showNotification = false"  ></Notification>
  </div>
</template>
