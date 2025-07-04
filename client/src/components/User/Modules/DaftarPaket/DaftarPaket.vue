<script setup lang="ts">
// Import Icon
import DeleteIcon from '@/components/User/Modules/DaftarPaket/Icon/DeleteIcon.vue'
import EditIcon from '@/components/User/Modules/DaftarPaket/Icon/EditIcon.vue'
import DetailIcon from '@/components/User/Modules/DaftarPaket/Icon/DetailIcon.vue'
import Pagination from '@/components/Pagination/Pagination.vue'

// import element
import Notification from '@/components/User/Modules/DaftarPaket/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/DaftarPaket/Particle/Confirmation.vue'

// import widget
import FormAdd from '@/components/User/Modules/DaftarPaket/Widget/FormAdd.vue'
import FormEdit from '@/components/User/Modules/DaftarPaket/Widget/FormEdit.vue'

// import component
import DetailPaket from '@/components/User/Modules/DetailPaket/DetailPaket.vue'

import LightButton from "@/components/Button/LightButton.vue"
import DangerButton from "@/components/Button/DangerButton.vue"

// import Pagination from '@/components/Pagination/Pagination.vue'
// import LightButton from "@/components/Button/LightButton.vue"
// import DangerButton from "@/components/Button/DangerButton.vue"
import PrimaryButton from "@/components/Button/PrimaryButton.vue"

// import API
import { daftarPaket, deletePaket } from '@/service/daftar_paket'
import { ref, onMounted, computed } from 'vue';

const itemsPerPage = 100; // Jumlah paket_la per halaman
const currentPage = ref(1);
const totalPages = ref(0);
const search = ref('');
const filter = ref('');

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

interface Paket {
  id: number;
  jenis_kegiatan: string;
  kode: string;
  photo: string;
  slug: string;
  name: string;
  description: string;
  departure_date: string;
  return_date: string;
  departure_from: number;
  duration_trip: number;
  mahram_fee: number;
  quota_jamaah: number;
  city_visited: string[];
  airlines: string[];
  hotel: string[];
  facilities: string[];
  show_homepage: boolean;
  airport_destination: number;
  airport_departure: number;
  departure_time: string;
  arrival_time: string;
  tutup_paket: boolean;
  provider_visa_id: number;
  provider_name: string | null;
  asuransi_id: number;
  asuransi_name: string | null;
  no_polis: string;
  tgl_input_polis: string;
  tgl_awal_polis: string;
  tgl_akhir_polis: string;
  prices: {
    id: number;
    paket_tipe: string;
    price: number;
  }[];
  status: string;
}

const timeoutId = ref<number | null>(null);
const dataPaket = ref<Paket[]>([]);
const isFormOpen = ref<boolean>(false);
const isFormOpenEdit = ref<boolean>(false);
const isPageDetailPaketOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const showNotification = ref<boolean>(false);
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const confirmMessage = ref<string>('');
const confirmTitle = ref<string>('');
const confirmAction = ref<(() => void) | null>(null);
const totalColumns = ref(5); // Default 3 kolom
const paket = ref<number>(0);

const fetchData = async () => {
  try {
    isLoading.value = true
    const response = await daftarPaket({
        search: search.value,
        filter: filter.value,
        perpage: itemsPerPage,
        pageNumber: currentPage.value,
    });

    if (response.error) {
        displayNotification(response.error_msg, "error");
        return;
    }

    totalPages.value = Math.ceil(response.total / itemsPerPage);
    dataPaket.value = response.data || []; // Ensure it assigns an array

    isLoading.value = false;
  } catch (error) {
      console.error('Error fetching data:', error);
      displayNotification('Gagal mengambil data.', 'error');
  }
};

onMounted(async () => {
  await fetchData(); // Pastikan data sudah diambil sebelum menghitung jumlah kolom
  totalColumns.value = document.querySelectorAll("thead th").length;
});

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
}

const openFormEdit = (paketId: number) => {
  isFormOpenEdit.value = true;
  paket.value = paketId;
}

const openDetailPaket = (paketId: number) => {
  isPageDetailPaketOpen.value = true;
  paket.value = paketId;
}

const deleteData = async (id: number) => {
  showConfirmation(
    'Konfirmasi Hapus',
    'Apakah Anda yakin ingin menghapus data ini?',
    async () => {
      try {
        const response = await deletePaket(id);
        if (response.error) {
          displayNotification(response.error_msg, 'error');
          return;
        }
        showConfirmDialog.value = false;
        displayNotification(response.error_msg || "Operasi berhasil!", "success");
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
        displayNotification('Terjadi kesalahan saat menghapus data.', 'error');
      }
    }
  );
};

const shortText = (teks:string, maxKarakter: number) => {
  if (!teks) return '';
  return teks.length > maxKarakter ? teks.slice(0, maxKarakter) + '...' : teks;
}
</script>

<template>
    <div v-if="isLoading" class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
    </div>
    <div v-else-if="isFormOpen">
      <FormAdd :isFormOpen="isFormOpen" @close="isFormOpen = false; fetchData()" />
    </div>
    <div v-else-if="isFormOpenEdit">
      <FormEdit :isFormOpen="isFormOpenEdit" :paketId="paket" @close="isFormOpenEdit = false; fetchData()" />
    </div>
    <div v-else-if="isPageDetailPaketOpen">
      <DetailPaket :isPageDetailPaketOpen="isPageDetailPaketOpen" :paketId="paket" @closeDetailPaket="isPageDetailPaketOpen = false; fetchData()" />
    </div>
    <div v-else-if="dataPaket" class="container mx-auto px-4 mt-10">
      <div class="flex justify-between items-center mb-6">
        <PrimaryButton @click="openForm()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          Tambah Paket
        </PrimaryButton>

        <div class="flex items-center">
          <label for="filter" class="block text-sm font-medium text-gray-700 mr-2">Filter</label>
          <select id="filter"
            class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            v-model="filter" @change="fetchData()">
            <option value="" selected>Lihat Semua</option>
            <option value="sudah_berangkat">Sudah Berangkat</option>
            <option value="belum_berangkat">Belum Berangkat</option>
          </select>
          <div class="flex items-center ml-4">
            <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
            <input
              type="text"
              id="search"
              class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
              v-model="search"
              @change="fetchData()"
              placeholder="Nama Paket/Kode Paket"
            />
          </div>
        </div>
      </div>
      <!-- Table data -->
      <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
        <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead class="bg-gray-50">
            <tr>
              <th class="w-[20%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Nama Paket</th>
              <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Harga</th>
              <th class="w-[20%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Deskripsi</th>
              <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Tgl. Berangkat</th>
              <th class="w-[10%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Tgl. Kembali</th>
              <th class="w-[10%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Total Jamaah</th>
              <th class="w-[10%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 border-t border-gray-100">
            <template v-if="dataPaket && dataPaket.length > 0">
              <tr v-for="paket in dataPaket" :key="paket.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-center">
                  <strong>{{ paket.kode }}</strong> -
                  <strong v-if="paket.jenis_kegiatan === 'umrah'">UMRAH</strong>
                  <strong v-else-if="paket.jenis_kegiatan === 'haji'">HAJI</strong>
                  <strong v-else-if="paket.jenis_kegiatan === 'haji_umrah'">HAJI DAN UMRAH</strong>
                  <br>{{ paket.name }}
                </td>
                <td class="px-6 py-4">
                  <ul class="list-disc list-inside text-sm">
                    <li v-for="(price, index) in paket.prices" :key="index">
                      {{ price.paket_tipe }}: Rp {{ price.price.toLocaleString() }}
                    </li>
                  </ul>
                </td>
                <td class="px-6 py-4">{{ shortText( paket.description, 200 ) }}</td>
                <td class="px-6 py-4 text-center">
                  {{ paket.departure_date }}
                  <br>
                  <br>
                  <span
                    :class="{
                      'text-red-500': paket.status === 'belum_berangkat',
                      'text-green-500': paket.status === 'sudah_berangkat'
                    }"
                  >
                    <strong>{{ paket.status === 'belum_berangkat' ? 'BELUM BERANGKAT' : 'SUDAH BERANGKAT' }}</strong>
                  </span>
                </td>
                <td class="px-6 py-4 text-left">{{ paket.return_date }}</td>
                <td class="px-6 py-4 text-center">{{ paket.quota_jamaah }} Orang</td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center gap-2">
                    <LightButton  @click="openDetailPaket(paket.id)">
                      <DetailIcon></DetailIcon>
                    </LightButton>
                    <LightButton @click="openFormEdit(paket.id)">
                      <EditIcon></EditIcon>
                    </LightButton>
                    <DangerButton @click="deleteData(paket.id)">
                      <DeleteIcon></DeleteIcon>
                    </DangerButton>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="7" class="px-6 py-4 text-center text-base text-gray-600">
                Daftar Paket tidak ditemukan.
              </td>
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

