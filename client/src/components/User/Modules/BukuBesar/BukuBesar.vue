<script setup lang="ts">
  import { paramCabang  } from '@/service/param_cabang'; // Import function POST
  import IconDownload from '@/components/Icons/IconDownload.vue'
  import { ref, onMounted, computed } from 'vue';

  const itemsPerPage = 100; // Jumlah airlines per halaman
  const currentPage = ref(1);
  const search = ref("");
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

  interface filterCabang {
    id: number;
    name: string;
  }

  const totalColumns = ref(3); // Default 3 kolom
  const optionFilterCabang = ref<filterCabang[]>([]);
  const selectedOptionCabang = ref(0);

  const fetchFilterData = async() => {
    const response = await paramCabang();
    optionFilterCabang.value = response.data;
    selectedOptionCabang.value = response.data[0].id;
    await fetchData();
  }

  const fetchData = async() => {
    // const response = await daftarInvestorAPI({search: search.value, perpage: itemsPerPage, pageNumber: currentPage.value, cabang:selectedOptionCabang.value});
    // totalPages.value = Math.ceil(response.total / itemsPerPage)
    // dataInvestor.value = response.data;
  }

  interface Investor {
    id: number;
    name: string;
    cabang_id:number;
    identity_number: string;
    mobile_phone: string;
    address: string;
    invesment: number;
    stock: number;
  }

  const dataBukuBesar = ref<Investor[]>([]);

  onMounted(async () => {
    await fetchFilterData();
    totalColumns.value = 5
  });
</script>
<template>
  <div class="container mx-auto p-4">
    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <button
        class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2" >
        <IconDownload />
        Download Buku Besar
      </button>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Filter</label>
        <div class="inline-flex rounded-md shadow-xs" role="group">
          <input type="text" id="search" class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-s-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            v-model="search" @change="fetchData()" placeholder="Cari data..." />
          <select  v-model="selectedOptionCabang" style="width: 300px;" @change="fetchData()" class="border-t border-b border-e bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option v-for="optionC in optionFilterCabang" :key="optionC.id" :value="optionC.id">
                {{ optionC.name }}
              </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table data -->
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Tanggal Transaksi</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Ref</th>
            <th class="w-[25%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Keterangan</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Debet</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Kredit</th>
            <th class="w-[15%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Saldo</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <!-- <template v-if="dataInvestor && dataBukuBesar.length > 0">
            <tr v-for="investor in dataInvestor" :key="investor.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-center">{{ investor.name }}<br> {{ investor.identity_number }}</td>
              <td class="px-6 py-4 text-center">{{ investor.mobile_phone }}<br> {{ investor.address }}</td>
              <td class="px-6 py-4 text-center">{{ investor.invesment }}<br> {{ investor.stock }}% Saham</td>
              <td class="px-6 py-4 text-center">{{ investor.cabang }}</td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                  <LightButton @click="editInvestor(investor.id)" class="p-2 "><EditIcon /></LightButton>
                  <DangerButton @click="deleteInvestor(investor.id)">
                    <DeleteIcon></DeleteIcon>
                  </DangerButton>
                </div>
              </td>
            </tr>
          </template>
          <tr v-else> -->
            <td colspan="6" class="px-6 py-4 text-center text-base text-gray-600">Data Buku Besar tidak ditemukan.</td>
          <!-- </tr> -->
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
    <!-- <FormAddUpdate :isModalOpen="isModalOpen" :formData="formData" @close="isModalOpen = false; removeFormData() ; fetchData()"></FormAddUpdate>
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
    </Confirmation> -->
  </div>
  <!-- Notification Popup -->
  <!-- <Notification  :showNotification="showNotification"  :notificationType="notificationType" :notificationMessage="notificationMessage" @close="showNotification = false"  ></Notification> -->
</template>
