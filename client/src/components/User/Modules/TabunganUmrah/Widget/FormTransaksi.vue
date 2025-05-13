<script setup lang="ts">
// Import Icon
import DeleteIcon from '@/components/User/Modules/DaftarAsuransi/Icon/DeleteIcon.vue'
import EditIcon from '@/components/User/Modules/DaftarAsuransi/Icon/EditIcon.vue'

// import element
import DangerButton from '@/components/User/Modules/DaftarAsuransi/Particle/DangerButton.vue'
import EditButton from '@/components/User/Modules/DaftarAsuransi/Particle/EditButton.vue'
import Notification from '@/components/User/Modules/DaftarAsuransi/Particle/Notification.vue'
import Confirmation from '@/components/User/Modules/DaftarAsuransi/Particle/Confirmation.vue'

import NavSubmenu from './NavSubmenu.vue';

// Import service API
import { daftarTransaksi } from '@/service/daftar_detail_transaksi'; // Import function POST
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const itemsPerPage = 100; // Jumlah asuransi per halaman
const currentPage = ref(1);
const search = ref("");
const totalPages = ref(0);
const current = ref("transaksi");

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


const fetchData = async () => {
  try {
    const response = await daftarAsuransi(currentPage.value, itemsPerPage, search.value);
    dataAsuransi.value = response.data.data;
    totalPages.value = Math.ceil(response.data.total / itemsPerPage);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


// Define state untuk menyimpan menu yang aktif
onMounted(() => {
  // Set default menu yang aktif
  })


</script>

<template>
  <div>
    <div class="flex items-center text-sm font-medium text-gray-700">
      <NavSubmenu :current="current" @close="$emit('close')" />
    </div>
      <!-- Tambah data dan Search -->
      <!-- <div class="flex justify-between mb-4">
      <button
        @click="openModal()"
        class="bg-[#455494] text-white px-4 py-2 rounded-lg hover:bg-[#3a477d] transition-colors duration-200 ease-in-out flex items-center gap-2" >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Tambah Asuransi
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
    </div> -->

    <!-- Table data -->
    <!-- <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-[90%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Nama Asuransi</th>
            <th class="w-[10%] px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="dataAsuransi && dataAsuransi.length > 0">
            <tr v-for="asuransi in dataAsuransi" :key="asuransi.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-center">{{ asuransi.name }}</td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                  <EditButton @click="openModal(asuransi)">
                    <EditIcon></EditIcon>
                  </EditButton>
                  <DangerButton @click="deleteData(asuransi.id)">
                    <DeleteIcon></DeleteIcon>
                  </DangerButton>
                </div>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="2" class="px-6 py-4 text-center text-base text-gray-600">Daftar asuransi tidak ditemukan.</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <tr>
            <td class="px-4 py-4 text-center border min-h-[200px]" :colspan="totalColumns">
              <nav class="flex mt-0">
                <ul class="inline-flex items-center -space-x-px"> -->
                  <!-- Tombol Previous -->
                  <!-- <li>
                    <button
                      @click="prevPage"
                      :disabled="currentPage === 1"
                      class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg
                        hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  </li> -->
                  <!-- Nomor Halaman -->
                  <!-- <li v-for="page in pages" :key="page">
                    <button
                      @click="pageNow(page)"
                      class="px-3 py-2 leading-tight border"
                      :class="currentPage === page
                        ? 'text-white bg-[#3a477d] border-[#3a477d]'
                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'"
                    >
                      {{ page }}
                    </button>
                  </li> -->

                  <!-- Tombol Next -->
                  <!-- <li>
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
    </div> -->
  </div>


</template>
