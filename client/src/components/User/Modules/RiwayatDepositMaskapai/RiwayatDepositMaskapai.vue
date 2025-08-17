<script setup lang="ts">
  // Import Icon
  import DeleteIcon from '@/components/User/Modules/Airlines/Icon/DeleteIcon.vue'
  import EditIcon from '@/components/User/Modules/Airlines/Icon/EditIcon.vue'
  // import element
  import Form from '@/components/User/Modules/Airlines/Widget/Form.vue'
  import DangerButton from '@/components/User/Modules/Airlines/Particle/DangerButton.vue'
  import Notification from '@/components/User/Modules/Airlines/Particle/Notification.vue'
  import Confirmation from '@/components/User/Modules/Airlines/Particle/Confirmation.vue'
  import LightButton from "@/components/Button/LightButton.vue"
  import PrimaryButton from '@/components/Button/PrimaryButton.vue'
  import Pagination from '@/components/Pagination/Pagination.vue'

  import { ref, onMounted, computed } from 'vue';
  import { riwayat_deposit_maskapai } from '@/service/riwayat_deposit_maskapai'; // Import function POST
import FormAddDeposit from './Widget/FormAddDeposit.vue'
  //


  interface MainInterface {
    id: number;
    invoice: string;
    nama_maskapai: string;
    nominal_deposit: string;
    tanggal_deposit: string;
  }

  const data = ref<MainInterface[]>([]);
  const search = ref("");
  const currentPage = ref(1);
  const total = ref<number>(0);
  const totalPages = ref(0);
  const totalColumns = ref(4); // Default 3 kolom
  const itemsPerPage = 100; // Jumlah airlines per halaman
  const notificationMessage = ref<string>('');
  const notificationType = ref<'success' | 'error'>('success');
  const showNotification = ref<boolean>(false);
  const timeoutId = ref<number | null>(null);
  const showForm = ref(false);

  const fetchData = async () => {
    try {
      const response = await riwayat_deposit_maskapai({
        search: search.value,
        perpage: itemsPerPage,
        pageNumber: currentPage.value
      });

      totalPages.value = Math.ceil(response.total / itemsPerPage);
      data.value = response.data;
      total.value = response.total;
    } catch (error) {
      displayNotification('Terjadi kesalahan saat mengambil data.', 'error');
    }
  }

  const deleteData = async (id: number) => {
    // try {
    //   const response = await deleteAirlines(id);
    //   if (response.success) {
    //     displayNotification('Data berhasil dihapus.', 'success');
    //     fetchData();
    //   } else {
    //     displayNotification('Gagal menghapus data.', 'error');
    //   }
    // } catch (error) {
    //   displayNotification('Terjadi kesalahan saat menghapus data.', 'error');
    // }
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

  const pages = computed(() => {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
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


  const addDepositModal = () => {
    showForm.value = true;
  };


  const closeAddForm = () => {
    showForm.value = false
    fetchData()
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


  onMounted(async () => {
    await fetchData();
  });
</script>
<template>
  <div class="container mx-auto p-4">
    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <PrimaryButton @click="addDepositModal()" >
        <font-awesome-icon icon="fa-solid fa-plus"></font-awesome-icon>
        Tambah Deposit Maskapai
      </PrimaryButton>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
        <input type="text" id="search" class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="search" @change="fetchData()" placeholder="Cari data..." />
      </div>
    </div>

    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[30%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Invoice</th>
            <th class="w-[30%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Nama Maskapai</th>
            <th class="w-[30%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Nominal Deposit</th>
            <th class="w-[10%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="data && data.length > 0">
            <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-center">{{ item.invoice }}</td>
              <td class="px-6 py-4 text-center">{{ item.nama_maskapai }}</td>
              <td class="px-6 py-4 text-center">{{ formatRupiah(item.nominal_deposit) }}</td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                  <DangerButton @click="deleteData(item.id)">
                    <DeleteIcon></DeleteIcon>
                  </DangerButton>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="4" class="px-6 py-4 text-center">Riwayat deposit maskapai tidak ditemukan.</td>
            </tr>
          </template>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <Pagination :current-page="currentPage" :total-pages="totalPages" :pages="pages" :total-columns="totalColumns" :total-row="total" @prev-page="prevPage" @next-page="nextPage" @page-now="pageNow" />
        </tfoot>
      </table>
    </div>
    <!-- Notification Popup -->
    <Notification  :showNotification="showNotification"  :notificationType="notificationType" :notificationMessage="notificationMessage" @close="showNotification = false"  ></Notification>
    <!-- Form Add Deposit -->
    <FormAddDeposit :showForm="showForm" @cancel="closeAddForm" />
  </div>
</template>
