<script setup lang="ts">
// Import Icon
import DeleteIcon from "./Icon/DeleteIcon.vue"
import EditIcon from "./Icon/EditIcon.vue"
import CetakIcon from "./Icon/CetakInvoiceIcon.vue"

// import element
import DangerButton from "./Particle/DangerButton.vue"
import EditButton from "./Particle/EditButton.vue"
import LightButton from "./Particle/LightButton.vue"
import Notification from "./Particle/Notification.vue"
import Confirmation from "./Particle/Confirmation.vue"
import Form from "./Particle/Form.vue"

// import api from "@/services/api"; // Import service API
import { daftarPaketLa, addPaketLa, editPaketLa, deletePaketLa } from "../../../../service/daftar_paket_la"
import { daftarKostumerPaketLA } from "../../../../service/daftar_kostumer_paket_la"
import { ref, onMounted, computed, watchEffect } from 'vue';
import axios from 'axios';
import { data } from "autoprefixer"

const itemsPerPage = 100; // Jumlah paket_la per halaman
const currentPage = ref(1);
const search = ref("");
const pageNumber = ref(0);
const totalPages = ref(0);

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

interface PaketLa {
  id: number;
  kostumer_paket_la_id: number;
  register_number: string;
  client_name: string;
  client_hp_number: string;
  client_address: string;
  status: string;
  discount: number;
  total_price: number;
  total_jamaah: number;
  departure_date: string;
  arrival_date: string;
}

interface KostumerPaketLa {
  id: number;
  name: string;
  mobile_number: string;
  address: string;
}

interface Errors {
  client_name: string;
  client_hp_number: string;
  client_address: string;
  discount: string;
  total_jamaah: string;
  departure_date: string;
  arrival_date: string;
}

const timeoutId = ref<number | null>(null);
const dataPaketLa = ref<PaketLa[]>([]);
const dataKostumer = ref<KostumerPaketLa[]>([]);
const isFormOpen = ref<boolean>(false);
const showNotification = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const confirmMessage = ref<string>('');
const confirmTitle = ref<string>('');
const confirmAction = ref<(() => void) | null>(null);
const totalColumns = ref(5); // Default 3 kolom

const selectedPaketLa = ref<Partial<PaketLa>>({
  kostumer_paket_la_id: 0,
  register_number: '',
  client_name: '',
  client_hp_number: '',
  client_address: '',
  status: '',
  discount: 0,
  total_price: 0,
  total_jamaah: 0,
  departure_date: '',
  arrival_date: '',
});

const errors = ref<Errors>({
  client_name: '',
  client_hp_number: '',
  client_address: '',
  discount: '',
  total_jamaah: '',
  departure_date: '',
  arrival_date: '',
});

const fetchData = async () => {
  try {
      const response = await daftarPaketLa({
          search: search.value,
          perpage: itemsPerPage,
          pageNumber: currentPage.value,
      });

      const responseKostumer = await daftarKostumerPaketLA({
          search: search.value,
          perpage: itemsPerPage,
          pageNumber: currentPage.value,
      });

      dataKostumer.value = responseKostumer.data;

      if (response.error) {
          displayNotification(response.error_msg, "error");
          return;
      }

      totalPages.value = Math.ceil(response.total / itemsPerPage);
      dataPaketLa.value = response.data || []; // Ensure it assigns an array
  } catch (error) {
      console.error('Error fetching data:', error);
      displayNotification('Gagal mengambil data.', 'error');
  }
};

const openForm = (paket_la?: PaketLa) => {
  selectedPaketLa.value = paket_la
    ? { ...paket_la }
    : { client_name: '', client_hp_number: '', client_address: '', discount: 0, total_jamaah: 0, departure_date: '', arrival_date: '' };

  isFormOpen.value = true;
};

onMounted(async () => {
  await fetchData(); // Pastikan data sudah diambil sebelum menghitung jumlah kolom
  totalColumns.value = document.querySelectorAll("thead th").length;
});

const validateForm = (): boolean => {
  errors.value = { kostumer_paket_la_id: '', total_jamaah: '', departure_date: '', arrival_date: ''};
  let isValid = true;

  if (!selectedPaketLa.value.kostumer_paket_la_id) {
    errors.value.kostumer_paket_la_id = ' Klien tidak boleh kosong.';
    isValid = false;
  }

  if (!selectedPaketLa.value.total_jamaah) {
    errors.value.total_jamaah = 'Jumlah jamaah tidak boleh kosong.';
    isValid = false;
  }

  if (!selectedPaketLa.value.departure_date) {
    errors.value.departure_date = 'Tanggal keberangkatan tidak boleh kosong.';
    isValid = false;
  }

  if (!selectedPaketLa.value.arrival_date) {
    errors.value.arrival_date = 'Tanggal kedatangan tidak boleh kosong.';
    isValid = false;
  }

  return isValid;
};

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

const saveData = async () => {
  if (!validateForm()) return;

  const isEdit = !!selectedPaketLa.value.id;
  const action = async () => {
    try {
      if (isEdit) {
        const response = await editPaketLa(selectedPaketLa.value.id, selectedPaketLa.value );
        showConfirmDialog.value = false;
        displayNotification(response.error_msg);
      } else {
        const response = await addPaketLa(selectedPaketLa.value);
        showConfirmDialog.value = false;
        displayNotification(response.error_msg);
      }
      isFormOpen.value = false;
      fetchData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        displayNotification(error.response?.data?.error_msg || 'Terjadi kesalahan saat menyimpan data.', 'error');
      } else {
        displayNotification('Terjadi kesalahan yang tidak terduga.', 'error');
      }
      showConfirmDialog.value = false;
    }
  };

  isEdit ? showConfirmation('Konfirmasi Perubahan', 'Apakah Anda yakin ingin mengubah data ini?', action) : action();
};

const deleteData = async (id: number) => {
  showConfirmation(
    'Konfirmasi Hapus',
    'Apakah Anda yakin ingin menghapus data ini?',
    async () => {
      try {
        const response = await deletePaketLa(id);
        showConfirmDialog.value = false;
        displayNotification(response.error_msg);
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
        displayNotification('Terjadi kesalahan saat menghapus data.', 'error');
      }
    }
  );
};
</script>

<template>
  <Form
      v-if="isFormOpen"
      :PaketLa="selectedPaketLa"
      :errors="errors"
      :customers="dataKostumer"
      v-model:selectedPaketLa="selectedPaketLa"
      @save="saveData"
      @cancel="isFormOpen = false"
    />

  <!-- <div v-if="isFormOpen" class="mx-auto p-6 bg-white shadow-md rounded-md text-gray-900">
    <h2 class="text-2xl font-bold text-center mb-6">
      {{ selectedPaketLa?.id ? "Form Edit Paket La" : "Form Tambah Paket La Baru" }}
    </h2>
      <div class="grid grid-cols-2 gap-4 justify-center">

      <div>
        <label class="block text-sm font-medium text-gray-700">Daftar Kostumer</label>
        <select v-model="selectedPaketLa.client_name" class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-blue-500">
          <option disabled value="">Pilih kostumer...</option>
          <option v-for="dataKostumer in dataKostumer" :key="dataKostumer.name" :value="dataKostumer.name">
            {{ dataKostumer.name }}
          </option>
        </select>
        <p v-if="errors.client_name" class="text-sm text-red-600">{{ errors.client_name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Diskon (%)</label>
        <input v-model.number="selectedPaketLa.discount" type="number" min="0" max="100"
          class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-blue-500"
          placeholder="Masukkan diskon (0-100%)">
        <p v-if="errors.discount" class="text-sm text-red-600">{{ errors.discount }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Tanggal Keberangkatan</label>
        <input v-model="selectedPaketLa.departure_date" type="date"
          class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-blue-500">
        <p v-if="errors.departure_date" class="text-sm text-red-600">{{ errors.departure_date }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Jumlah Jamaah</label>
        <input v-model.number="selectedPaketLa.total_jamaah" type="number" min="1"
          class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-blue-500"
          placeholder="Masukkan jumlah jamaah">
        <p v-if="errors.total_jamaah" class="text-sm text-red-600">{{ errors.total_jamaah }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Tanggal Kepulangan</label>
        <input v-model="selectedPaketLa.arrival_date" type="date"
          class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-blue-500">
        <p v-if="errors.arrival_date" class="text-sm text-red-600">{{ errors.arrival_date }}</p>
      </div>

    </div>

    <div class="flex justify-end space-x-3">
      <button type="button" @click="isFormOpen = false"
        class="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400">Batal</button>
      <button type="submit" @click="saveData"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        {{ selectedPaketLa?.id ? "Simpan Perubahan" : "Tambah" }}
      </button>
    </div>
  </div> -->


  <div v-else class="container mx-auto p-4">
    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <button
        @click="openForm()"
        class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2" >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Tambah Transaksi Paket LA
      </button>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="search"
          @change="fetchData()"
          placeholder="Cari data..."
        />
      </div>
    </div>

    <!-- Table data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr class="bg-gray-100">
            <th class="w-[12%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Nomor Register</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Info Klien</th>
            <th class="w-[42%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Info Item Transaksi</th>
            <th class="w-[18%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Info Harga</th>
            <th class="w-[13%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
      <template v-if="dataPaketLa.length > 0">
        <tr v-for="paket in dataPaketLa" :key="paket.id" class="bg-gray-100">
          <td class="p-3 border border-gray-300 align-top text-center">
            {{ paket.register_number }}
          </td>
          <td class="p-3 border border-gray-300 align-top">
            <ul>
              <li><b>Nama Klien:</b> {{ paket.client_name }}</li>
              <li><b>Nomor HP:</b> {{ paket.client_hp_number }}</li>
              <li><b>Alamat:</b> {{ paket.client_address }}</li>
            </ul>
          </td>
          <td class="p-3 border border-gray-300 align-top">
            <!-- <div class="mb-4 p-2 bg-white border border-gray-300"> -->
              <!-- <p><b>INVOICE:</b> Coming Soon</p>
              <p><b>TOTAL:</b> Coming Soon</p> -->
              <table class="w-full mt-2 border text-center text-xs mb-3">
                <tbody>
                  <tr>
                    <td class="w-[19%] px-6 text-center border font-bold bg-gray-200" >INVOICE</td>
                    <td class="w-[1%] px-3 border border-left-0" >:</td>
                    <td class="w-[25%] px-6 border text-left font-bold" >SO31285040</td>
                    <td class="w-[20%] px-6 text-center border font-bold bg-gray-200">PRINT BTN</td>
                    <td class="w-[1%] px-3 border" >:</td>
                    <td class="w-[34%] px-6 border text-left" style="text-transform:uppercase;">
                        <button type="button" class="h-[35px] mx-[0.1rem] px-4 my-1 py-1 flex justify-center items-center rounded-lg text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" title="Cetak Kwitansi Detail Item Paket LA" onclick="cetak_kwitansi_detail_item_paket_la('174')">
                            <i class="fas fa-print" style="font-size: 11px;"></i> Cetak Invoice
                        </button>
                    </td>
                  </tr>
                  <tr>
                    <td class="w-[19%] px-6 py-5 text-center border font-bold" style="background-color: #e7e7e7;">TOTAL</td>
                    <td class="w-[1%] px-3 border border-left-0" >:</td>
                    <td class="px-6 border text-left font-bold" colspan="4">RP 12.000.000,-</td>
                  </tr>
                  <!-- <tr>
                    <td class="text-left border border-right-0 align-middle" style="width:15%;background-color: #e7e7e7;">TOTAL</td>
                    <td class="border border-left-0 border-right-0 border-top-1 px-2 align-middle" style="width:1%;">:</td>
                    <td colspan="4" class="border text-left border-left-0 border-top-1 px-0 align-middle" style="width:34%;">Rp 4,000,000</td>
                  </tr> -->
                  <!-- <tr>
                  </tr> -->
                </tbody>
              </table>
              <table class="w-full mt-2 border text-center text-xs">
                <thead>
                  <tr class="bg-gray-200">
                    <th class="p-2 border w-[25%]">Deskripsi</th>
                    <th class="p-2 border w-[15%]">Check-in</th>
                    <th class="p-2 border w-[15%]">Check-out</th>
                    <th class="p-2 border w-[10%]">Day</th>
                    <th class="p-2 border w-[10%]">Pax</th>
                    <th class="p-2 border w-[20%]">Price</th>
                    <th class="p-2 border w-[15%]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr  class="text-center">
                    <td class="p-2 border">Coming Soon</td>
                    <td class="p-2 border">{{ paket.departure_date }}</td>
                    <td class="p-2 border">{{ paket.arrival_date }}</td>
                    <td class="p-2 border">Coming Soon</td>
                    <td class="p-2 border">{{ paket.total_jamaah }}</td>
                    <td class="p-2 border">Coming Soon</td>
                    <td class="p-2 border">
                      <button class="px-1.5 py-1.5 bg-red-500 text-white font-bold rounded hover:bg-red-600">
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- <button class="mt-2 px-3 py-1 bg-gray-300 rounded flex items-center gap-2 font-medium hover:bg-gray-400 transition ease-in-out">
                <CetakIcon />
                Cetak Invoice
              </button> -->
            <!-- </div> -->
            <!-- <div v-for="invoice in paket.invoices" :key="invoice.id" class="mb-4 p-2 bg-white border border-gray-300">
              <p><b>INVOICE:</b> {{ invoice.invoice_number }}</p>
              <p><b>TOTAL:</b> Rp {{ invoice.total.toLocaleString() }}</p>
              <table class="w-full mt-2 border">
                <thead>
                  <tr class="bg-gray-200">
                    <th class="p-2 border">Deskripsi</th>
                    <th class="p-2 border">Check-in</th>
                    <th class="p-2 border">Check-out</th>
                    <th class="p-2 border">Day</th>
                    <th class="p-2 border">Pax</th>
                    <th class="p-2 border">Price</th>
                    <th class="p-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in invoice.items" :key="item.id" class="text-center">
                    <td class="p-2 border">{{ item.description }}</td>
                    <td class="p-2 border">{{ item.checkin }}</td>
                    <td class="p-2 border">{{ item.checkout }}</td>
                    <td class="p-2 border">{{ item.day }}</td>
                    <td class="p-2 border">{{ item.pax }}</td>
                    <td class="p-2 border">Rp {{ item.price.toLocaleString() }}</td>
                    <td class="p-2 border">
                      <button @click="deleteItem(item.id)" class="px-3 py-1 bg-red-500 text-white rounded">X</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button class="mt-2 px-3 py-1 bg-gray-300 rounded">🖨 Cetak Invoice</button>
            </div> -->
          </td>
          <td class="p-3 border border-gray-300 align-top">
            <p><b>Total Harga:</b> Coming Soon</p>
            <p><b>Diskon:</b> Coming Soon</p>
            <p><b>Sudah Dibayar:</b> Coming Soon</p>
            <p><b>Sisa:</b> Coming Soon</p>
          </td>
          <td class="p-3 border border-gray-300 align-top">
            <div class="grid grid-cols-3 gap-2 justify-between">
              <LightButton>
                <font-awesome-icon icon="fa-solid fa-box" />
              </LightButton>
              <LightButton>
                <font-awesome-icon icon="fa-solid fa-money-bill-alt" />
              </LightButton>
              <LightButton>
                <font-awesome-icon icon="fa-solid fa-undo-alt" />
              </LightButton>
              <LightButton>
                <font-awesome-icon icon="fa-solid fa-list-alt" />
              </LightButton>
              <EditButton @click="openForm(paket)" class="p-2 rounded">
                <EditIcon />
              </EditButton>
              <DangerButton @click="deleteData(paket.id)" class="p-2 rounded">
                <DeleteIcon />
              </DangerButton>
            </div>
          </td>
        </tr>
      </template>
      <tr v-else>
        <td colspan="5" class="p-4 text-center text-gray-600">Tidak ada data paket la.</td>
      </tr>
    </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="px-4 py-4 text-center border min-h-[200px]" :colspan="totalColumns">
              <nav class="flex mt-0">
                <ul class="inline-flex items-center -space-x-px">
                  <!-- Tombol Previous -->
                  <li>
                    <button
                      @click="prevPage"
                      :disabled="currentPage === 1"
                      class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg
                        hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  </li>
                  <!-- Nomor Halaman -->
                  <li v-for="page in pages" :key="page">
                    <button
                      @click="pageNow(page)"
                      class="px-3 py-2 leading-tight border"
                      :class="currentPage === page
                        ? 'text-white bg-[#3a477d] border-[#3a477d]'
                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'"
                    >
                      {{ page }}
                    </button>
                  </li>

                  <!-- Tombol Next -->
                  <li>
                    <button
                      @click="nextPage"
                      :disabled="currentPage === totalPages"
                      class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg
                        hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

  </div>
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
</template>
