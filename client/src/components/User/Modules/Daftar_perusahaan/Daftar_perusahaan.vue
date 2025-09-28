<script setup lang="ts">
import PrimaryButton from '@/components/Button/PrimaryButton.vue';
import { ref, computed, onMounted } from 'vue';
import { list } from '@/service/daftar_perusahaan'; // Import function POST
import Pagination from '@/components/Pagination/Pagination.vue';

interface Company {
  id: number;
  code: string;
  company_name: string;
  email: string;
  type: string;
  verify_status: string;
  verify_time: string;
  whatsapp_company_number: string;
  start_subscribtion: string;
  end_subscribtion: string;
  saldo: number;
  address: string;
}

const data = ref<Company[]>([]);

const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const showNotification = ref<boolean>(false);
const timeoutId = ref<number | null>(null);

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  if (timeoutId.value) clearTimeout(timeoutId.value);
  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

const itemsPerPage = 100; // Jumlah airlines per halaman
const currentPage = ref(1);
const search = ref('');
const totalPages = ref(0);
const total = ref<number>(0);
const totalColumns = ref(7); // Default 3 kolom
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

const pageNow = (page: number) => {
  currentPage.value = page;
  fetchData();
};

// Generate array angka halaman
const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1);
});

const fetchData = async () => {
  try {
    const response = await list({
      search: search.value,
      perpage: itemsPerPage,
      pageNumber: currentPage.value,
    });

    totalPages.value = Math.ceil(response.total / itemsPerPage);
    data.value = response.data;
    total.value = response.total;
  } catch (error) {
    displayNotification('Terjadi kesalahan saat mengambil data.', 'error');
  }
};

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <PrimaryButton @click="openModal()">
        <font-awesome-icon icon="fa-solid fa-plus"></font-awesome-icon>
        Tambah Perusahaan
      </PrimaryButton>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="search"
          @change="fetchData()"
          placeholder="Kode / Nama Perusahaan"
        />
      </div>
    </div>

    <!-- Table data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md mb-5">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[13%] px-6 py-4 font-medium font-bold text-gray-900 text-center">
              Info Perusahaan
            </th>
            <th class="w-[17%] px-6 py-4 font-medium font-bold text-gray-900 text-center">
              Alamat
            </th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">
              Whatsapp
            </th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Email</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">
              Berlangganan
            </th>
            <th class="w-[10%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Saldo</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="data && data.length > 0"></tr>
          <tr v-else>
            <td :colspan="totalColumns" class="px-6 py-4 text-center text-base text-gray-600">
              Daftar Perusahaan Tidak Ditemukan
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :pages="pages"
            :total-columns="totalColumns"
            :total-row="total"
            @prev-page="prevPage"
            @next-page="nextPage"
            @page-now="pageNow"
          />
        </tfoot>
      </table>
    </div>
  </div>
</template>
