<script setup lang="ts">

// Import icon
import EditIcon from '@/components/User/Modules/ManifestPaket/icon/EditIcon.vue'
import DownloadIcon from '@/components/User/Modules/ManifestPaket/icon/DownloadIcon.vue'

// import element
import EditButton from '@/components/User/Modules/ManifestPaket/particle/EditButton.vue'
import Notification from '@/components/User/Modules/ManifestPaket/particle/Notification.vue'

// import widget
import FormEditManifest from '@/components/User/Modules/ManifestPaket/widget/FormEditManifest.vue'
import Pagination from '@/components/Pagination/Pagination.vue'

import { ref, onMounted, computed } from 'vue'
import { daftarManifestPaket, downloadAbsensi } from '@/service/manifest_paket'


const props = defineProps<{
  paketId: number
}>()

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

interface ManifestPaket {
    id: number;
    jamaah_id: number;
    fullname: string;
    identity_number: string;
    birth_date: string;
    umur: number;
    whatsapp_number: string;
    status_kelengkapan: string;
    daftar_item_belum_lengkap: string[];
}

const dataManifestPaket = ref<ManifestPaket[]>([])
const transpaketId = ref<number>(0)
const isFormEditMasnifestOpen = ref<boolean>(false)
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const showNotification = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const confirmMessage = ref<string>('');
const confirmTitle = ref<string>('');
const confirmAction = ref<(() => void) | null>(null);
const totalColumns = ref(6);

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;

  if (timeoutId.value) clearTimeout(timeoutId.value);

  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

const openFormEditManifest = (id: number) => {
  transpaketId.value = id;
  isFormEditMasnifestOpen.value = true;
}

const fetchData = async () => {
  try {
    isLoading.value = true
    const response = await daftarManifestPaket({
      paketId: props.paketId,
      search: search.value,
      perpage: itemsPerPage,
      pageNumber: currentPage.value
    });
    dataManifestPaket.value = response.data;
    console.log(dataManifestPaket)
    totalPages.value = Math.ceil(response.total / itemsPerPage);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false
  }
};

const DownloadAbsensi = async () => {
  try {
    isLoading.value = true
    await downloadAbsensi(props.paketId);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false
  }
};

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="p-4 bg-white min-h-screen">
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
    </div>
      <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <button
        @click="DownloadAbsensi()"
        class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2" >
        <DownloadIcon />
        Download Manifest
      </button>
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
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[25%] px-6 py-4 font-medium text-gray-900 text-center">Jamaah</th>
            <th class="w-[15%] px-6 py-4 font-medium text-gray-900 text-center">Status</th>
            <th class="w-[15%] px-6 py-4 font-medium text-gray-900 text-center">Umur</th>
            <th class="w-[15%] px-6 py-4 font-medium text-gray-900 text-center">Nomor Whatsapp</th>
            <th class="w-[25%] px-6 py-4 font-medium text-gray-900 text-center">Daftar Item Yang Belum Lengkap</th>
            <th class="w-[5%] px-6 py-4 font-medium text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="dataManifestPaket && dataManifestPaket.length > 0">
            <tr v-for="dataManifest in dataManifestPaket" :key="dataManifest.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-center">
                <p>{{ dataManifest.fullname }}</p>
                <p>({{ dataManifest.identity_number }})</p>
              </td>
              <td class="px-6 py-4 text-center">
                <p>{{ dataManifest.status_kelengkapan }}</p>
              </td>
              <td class="px-6 py-4 text-center">
                <p>{{ dataManifest.birth_date }}</p>
                <p class="font-bold">({{ dataManifest.umur }} Tahun)</p>
              </td>
              <td class="px-6 py-4 text-center">
                <p>{{ dataManifest.whatsapp_number }}</p>
              </td>
              <td class="px-6 py-4" :class="{'text-center': dataManifest.daftar_item_belum_lengkap.length === 0, 'text-left': dataManifest.daftar_item_belum_lengkap.length > 0}">
                <template v-if="dataManifest.daftar_item_belum_lengkap.length === 0">
                  <p>Semua Item Lengkap</p>
                </template>
                <template v-else>
                  <ul>
                    <li v-for="(item, index) in dataManifest.daftar_item_belum_lengkap" :key="index" class="list-disc list-inside pl-3 text-sm">{{ item }}</li>
                  </ul>
                </template>
              </td>
              <td class="px-6 py-4 items-center justify-center flex gap-2">
                <EditButton col-span-1 title="Cetak Data Jamaah" @click="openFormEditManifest(dataManifest.id)">
                  <EditIcon></EditIcon>
                </EditButton>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td :colspan=totalColumns class="px-6 py-4 text-center text-base text-gray-600">Daftar Manifest tidak ditemukan.</td>
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

  <!-- Form Edit Manifest -->
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <FormEditManifest
      v-if="isFormEditMasnifestOpen"
      :isFormEditMasnifestOpen="isFormEditMasnifestOpen"
      :transpaketId="transpaketId"
      @close="isFormEditMasnifestOpen= false; fetchData()"
      @status="(payload) => displayNotification(payload.err_msg || 'Manifest gagal diupdate', payload.error ? 'error' : 'success')"
      />
  </transition>

    <!-- Notification -->
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>
