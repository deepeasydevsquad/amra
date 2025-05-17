<script setup lang="ts">
// Import Icon
import CetakIcon from '@/components/User/Modules/TabunganUmrah/Icon/CetakIcon.vue'

// import element
import LightButton from '@/components/Button/LightButton.vue'
import DangerButton from "@/components/Button/DangerButton.vue"
import Notification from '@/components/User/Modules/TabunganUmrah/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/TabunganUmrah/Particle/Confirmation.vue'

// import widget
import FormAdd from '@/components/User/Modules/TabunganUmrah/Widget/FormAdd.vue'
import FormUpdate from '@/components/User/Modules/TabunganUmrah/Widget/FormUpdate.vue'

// import API
import { daftar_tabungan_umrah, deleteTabunganUmrah, cekKwitansiTabunganUmrah } from '@/service/tabungan_umrah'
import { ref, onMounted, computed } from 'vue';

const itemsPerPage = 100; // Jumlah paket_la per halaman
const currentPage = ref(1);
const search = ref('');
const filter = ref('belum_beli_paket'); // Default filter
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

interface TabunganUmrah {
  id: number;
  member: {
    fullname: string;
    identity_number: string;
    birth_place: string;
    birth_date: string;
  };
  target_paket_name: string;
  target_paket_id: number,
  total_tabungan: number;
  status: string;
  fee_agen_id: number;
  agen: {
    fullname: string;
    level: string;
  };
  batal_berangkat: string;
  transaksi_paket_id: number;
  sisa_pembelian: number;
  invoice_sisa_deposit: string;
  riwayat_tabungan: {
    id: number;
    invoice: string;
    nominal_tabungan: number;
    transaksi: string;
    penerima: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const timeoutId = ref<number | null>(null);
const dataTabunganUmrah = ref<TabunganUmrah[]>([]);
const selectTabunganUmrah = ref<TabunganUmrah | null>(null);
const isFormOpen = ref<boolean>(false);
const isFormUpdateOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);
const showNotification = ref<boolean>(false);
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const confirmMessage = ref<string>('');
const confirmTitle = ref<string>('');
const confirmAction = ref<(() => void) | null>(null);
const totalColumns = ref(3); // Default 3 kolom

const fetchData = async () => {
  try {
    isLoading.value = true
    const response = await daftar_tabungan_umrah({
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
    dataTabunganUmrah.value = response.data || []; // Ensure it assigns an array

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

const openFormAdd = () => {
  isFormOpen.value = true;
}

const openFormUpdate = (tabungan: TabunganUmrah) => {
  selectTabunganUmrah.value = tabungan;
  isFormUpdateOpen.value = true;
}

const deleteData = async (id: number) => {
  showConfirmation(
    'Konfirmasi Hapus',
    'Apakah Anda yakin ingin menghapus data ini?',
    async () => {
      try {
        await deleteTabunganUmrah(id);
        showConfirmDialog.value = false;
        displayNotification("Operasi berhasil!", "success");
        fetchData();
      } catch (error) {
        console.error('Error deleting data:', error);
        displayNotification(error?.response?.data?.error_msg, 'error');
      }
    }
  );
};

const cetakKwitansi = async (invoice: string) => {
  try {
    console.log(invoice)
    const adaInvoice = await cekKwitansiTabunganUmrah(invoice);
    console.log(adaInvoice)
    if (adaInvoice === null) {
      displayNotification('Nomor invoice tidak tersedia', 'error')
      return
    }

    const url = `/kwitansi-tabungan-umrah/${invoice}`
    window.open(url, '_blank', 'noopener,noreferrer,width=800,height=600,scrollbars=yes')
  } catch (error) {
    console.error('Error printing invoice:', error)
    displayNotification('Terjadi kesalahan saat membuka invoice.', 'error')
  }
}
</script>

<template>
  <div class="p-4 bg-white min-h-screen">
    <div v-if="isLoading" class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
    </div>
    <div v-else-if="dataTabunganUmrah" class="container mx-auto">
      <div class="flex justify-between mb-4">
        <button
          @click="openFormAdd()"
          class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2" >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Tabungan Umrah
        </button>

        <div class="flex items-center">
          <label for="filter" class="block text-sm font-medium text-gray-700 mr-2">Filter</label>
          <select
            id="filter"
            class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            v-model="filter"
            @change="fetchData()"
          >
            <option value="belum_beli_paket" selected>Belum Beli Paket</option>
            <option value="sudah_beli_paket">Sudah Beli Paket</option>
            <option value="batal_berangkat">Batal Berangkat</option>
          </select>

          <div class="flex items-center ml-4">
            <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Search</label>
            <input
              type="text"
              id="search"
              class="block w-90 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
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
              <th class="w-[25%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Info Jamaah</th>
              <th class="w-[70%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Info Deposit</th>
              <th class="w-[5%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 border-t border-gray-100">
            <template v-if="dataTabunganUmrah && dataTabunganUmrah.length > 0">
              <tr v-for="tabungan in dataTabunganUmrah" :key="tabungan.id" class="hover:bg-gray-100">
                <td class="px-6 align-top">
                  <table class="w-full">
                    <tr v-for="(label, value) in {
                        'Nama Jamaah': tabungan.member.fullname,
                        'Nomor Identitas': tabungan.member.identity_number,
                        'Tempat / Tgl Lahir': `${tabungan.member.birth_place} / ${tabungan.member.birth_date}`,
                        'Nama Agen': tabungan.agen ? `${tabungan.agen.fullname} (Level : ${tabungan.agen.level})` : '-',
                        'Nama Target Paket': tabungan.target_paket_name || 'Target Paket Tidak Ditemukan'
                        }" :key="label" class="border-gray-200 hover:bg-gray-200">
                      <td class="py-1.5">{{ value }}</td>
                      <td class="pl-8 pr-2">:</td>
                      <td class="text-right space-y-2 text-sm py-1">{{ label }}</td>
                    </tr>
                  </table>
                </td>
                <td class="px-6 py-3 align-top">
                  <div class="text-sm text-gray-800 space-y-2">
                    <div class="flex items-start ">
                      <span class="w-40 font-semibold">Total Tabungan</span>
                      <span class="px-2">:</span>
                      <span class="font-bold">Rp {{ tabungan.total_tabungan.toLocaleString() }}</span>
                    </div>
                  </div>
                  <div class="mt-4 border-t pt-2">
                    <div class="rounded-t bg-gray-200 px-2 py-2 font-semibold text-center">
                      Riwayat Tabungan Umrah
                    </div>
                    <template v-if="tabungan.riwayat_tabungan.length">
                      <table class="w-full mb-4 text-xs text-center text-gray-700 border">
                        <thead class="bg-gray-50 border-b">
                          <tr>
                            <th class="p-2 border w-[7%] text-sm">#</th>
                            <th class="p-2 border w-[13%] text-sm">Invoice</th>
                            <th class="p-2 border w-[23%] text-sm">Biaya</th>
                            <th class="p-2 border w-[26%] text-sm">Tanggal Transaksi</th>
                            <th class="p-2 border w-[25%] text-sm">Penerima</th>
                            <th class="p-2 border w-[5%] text-sm">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(riwayat, index) in tabungan.riwayat_tabungan" :key="index" class="border-t hover:bg-gray-200 text-sm">
                            <td class="p-2 border">{{ index + 1 }}</td>
                            <td class="p-2 border">{{ riwayat.invoice }}</td>
                            <td class="p-2 border">Rp {{ riwayat.nominal_tabungan.toLocaleString() }},-</td>
                            <td class="p-2 border">{{ riwayat.transaksi }}</td>
                            <td class="p-2 border">{{ riwayat.penerima }}</td>
                            <td class="p-2 border">
                              <button class="rounded bg-gray-200 p-2 hover:bg-gray-300" @click.prevent="cetakKwitansi(riwayat.invoice)">
                                <CetakIcon class="h-6 w-6 text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </template>
                    <template v-else>
                      <p class="text-gray-500 text-xs italic mt-2 text-center mb-2">Daftar Riwayat Tabungan Umrah Tidak Ditemukan</p>
                    </template>
                    <div class="rounded-t bg-gray-200 px-2 py-2 font-semibold text-center">
                      Riwayat Handover Fasilitas
                    </div>
                    <!-- <template v-if="tabungan.handover.length">
                      <table class="w-full mb-4 text-xs text-left text-gray-700 border">
                        <thead class="bg-gray-50 border-b">
                          <tr>
                            <th class="p-2 border w-[15%] text-center">Invoice</th>
                            <th class="p-2 border w-[75%] text-center">Fasilitas</th>
                            <th class="p-2 border w-[5%] text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(handover, index) in tabungan.handover" :key="index" class="border-t hover:bg-gray-200">
                            <td class="p-2 border text-center">{{ handover.invoice }}</td>
                            <td class="p-2 border">{{ handover.fasilitas }}</td>
                            <td class="p-2 border">
                              <a href="#" @click.prevent="printHandoverFasilitas(tabungan.id, handover.id)">
                              <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2-4h6a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2h2" />
                                </svg>
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </template>
                    <template v-else>
                      <p class="text-gray-500 text-xs italic mt-2 text-center">Daftar Handover Fasilitas Tidak Ditemukan</p>
                    </template> -->
                    <div class="py-4 text-center font-bold">
                        <span>Coming soon</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center grid grid-cols-2 gap-2">
                  <div class="grid ">
                    <LightButton col-span-1 title="Cetak Data Jamaah" @click.prevent="cetakKwitansi(tabungan.invoice_sisa_deposit)">
                      <CetakIcon class="h-6 w-6 text-gray-600" />
                    </LightButton>
                    <LightButton col-span-1 title="Update Target Paket" @click="openFormUpdate(tabungan)" >
                      <CetakIcon class="h-6 w-6 text-gray-600" />
                    </LightButton>
                    <LightButton col-span-1 title="Refund Tabungan" >
                      <CetakIcon class="h-6 w-6 text-gray-600" />
                    </LightButton>
                    <LightButton col-span-1 title="Menabung" >
                      <CetakIcon class="h-6 w-6 text-gray-600" />
                    </LightButton>
                    <LightButton col-span-1 title="Handover Fasilitas" >
                      <CetakIcon class="h-6 w-6 text-gray-600" />
                    </LightButton>
                    <DangerButton title="Hapus Tabungan" @click="deleteData(tabungan.id)">
                      <font-awesome-icon icon="fa-solid fa-times" />
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
  </div>


  <!-- Form Add -->
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
      />
  </transition>

  <!-- Form Update -->
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <FormUpdate
      v-if="isFormUpdateOpen"
      :isFormUpdateOpen="isFormUpdateOpen"
      :dataTabungan="selectTabunganUmrah"
      @close="isFormUpdateOpen = false; fetchData()"
      @success="displayNotification('Target Paket Tabungan Umrah berhasil diupdate', 'success')"
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

