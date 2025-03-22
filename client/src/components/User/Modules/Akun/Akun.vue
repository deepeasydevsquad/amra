<script setup lang="ts">

import PrimaryButton from "./Particle/PrimaryButton.vue"
import DangerButton from "./Particle/DangerButton.vue"
import SuccessButton from "./Particle/SuccessButton.vue"
import ModalAddUpdateAkun from "./Particle/ModalAddUpdateAkun.vue"
import Confirmation from "../../../Modal/Confirmation.vue"
import Notification from "../../../Modal/Notification.vue"

// client/src/components/User/Modules/Supplier/Particle/Confirmation.vue


import { getFilterAkun, getData, deleteAkun } from "../../../../service/akun"; // Import function POST
import { ref, onMounted, computed, watchEffect } from 'vue';
import { useCurrencyInput } from 'vue-currency-input';

interface secondaryAkun {
  id: number;
  kode: string;
  name: string;
}

interface primaryAkun {
  id: number;
  nomor: string;
  name: string;
  type: 'header' | "child",
  tipe_akun : 'bawaan' | "tambahan",
  saldo_awal : string,
  saldo_akhir: string,
  detail : secondaryAkun
}

const daftarAkun = ref<primaryAkun[]>([]);
const totalColumns = ref(3); // Default 3 kolom
const optionFilterAkun = ref([{ id: 0, name: 'Pilih Semua Akun' }]);
const optionFilterCabang = ref([{ id: 0, name: 'Pilih Semua Cabang' }]);
const selectedOptionAkun = ref(0);
const selectedOptionCabang = ref(0);
const showConfirmDialog = ref<boolean>(false);
const showNotification = ref<boolean>(false);
const confirmMessage = ref<string>('');
const confirmTitle = ref<string>('');
const confirmAction = ref<(() => void) | null>(null);
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');

const fetchFilterData = async() => {
  const response = await getFilterAkun();
  optionFilterAkun.value = response.data.akun;
  optionFilterCabang.value = response.data.cabang;
  await fetch();
}

const fetch = async() => {
  const response = await getData({akun: selectedOptionAkun.value, cabang: selectedOptionCabang.value});
  daftarAkun.value = response.data;
}

const selectedAkun = ref<number>();

interface addUpdateAkunInterface {
  primary_id: number;
  prefix: string,
  nomor: string;
  nama: string;
  saldo: string;
}

const dataAddUpdateAkun = ref<Partial<addUpdateAkunInterface>>({
  primary_id : 0,
  prefix : '',
  nomor: '',
  nama : '',
  saldo : ''
});

// ADD AKUN FUNCTION //
const showAddModal = ref<boolean>(false);
const addAkunBtn = async (id : number, nomor : string) => {
  dataAddUpdateAkun.value.prefix = nomor.toString().charAt(0);
  dataAddUpdateAkun.value.primary_id = id;
  showAddModal.value = true;
}


const deleteAkunBtn = async ( id :number ) => {

  const delete_action = async () => {
    try {
      const response = await deleteAkun(id);
      displayNotification(response.error_msg);
        showConfirmDialog.value = false;
        await fetch();
    } catch (error) {
        showConfirmDialog.value = false;
    }
  };

  showConfirmation('Konfirmasi Delete', 'Apakah Anda yakin ingin menghapus data akun ini?', delete_action );
}

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;

  // if (timeoutId.value) clearTimeout(timeoutId.value);

  // timeoutId.value = window.setTimeout(() => {
  //   showNotification.value = false;
  // }, 3000);
};

const showConfirmation = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title;
  confirmMessage.value = message;
  confirmAction.value = action;
  showConfirmDialog.value = true;
};

const updateStatusShow = (newStatus: boolean) => {
  showAddModal.value = newStatus;
  fetch();
};

onMounted(async () => {
  await fetchFilterData(); // Pastikan data sudah diambil sebelum menghitung jumlah kolom
  totalColumns.value = document.querySelectorAll("thead th").length;
});

</script>

<template>
  <div class="container mx-auto p-4">

    <!-- Tambah data dan Search -->
    <div class="flex justify-between mb-4">
      <div class="inline-flex rounded-md shadow-xs" role="group">
        <div class="inline-flex rounded-md shadow-xs" role="group">
          <button type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
            <font-awesome-icon icon="fa-solid fa-book" class="mr-2" />
            Tutup Buku
          </button>
          <button type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-e  border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
            <font-awesome-icon icon="fa-solid fa-book" class="mr-2" />
            Kembali Ke Buku Sebelumnya
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2">Filter</label>
        <div class="inline-flex rounded-md shadow-xs" role="group">
          <select  v-model="selectedOptionAkun" style="width: 300px;"  @change="fetch()" class="bg-gray-50 border-t border-b border-s border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option v-for="optionA in optionFilterAkun" :key="optionA.id" :value="optionA.id">
                {{ optionA.name }}
              </option>
          </select>
          <select  v-model="selectedOptionCabang" style="width: 300px;" @change="fetch()" class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-e-lg border-t border-b border-e focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-center" colspan="2">Nomor</th>
            <th class="w-[35%] px-6 py-4 font-bold text-gray-900 text-center">Nama Akun</th>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-center">Type</th>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-center">Saldo Awal</th>
            <th class="w-[15%] px-6 py-4 font-bold text-gray-900 text-center">Saldo Akhir</th>
            <th class="w-[10%] px-6 py-4 font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <template v-if="daftarAkun && daftarAkun.length > 0">
            <tr v-for="akun in daftarAkun" :key="akun.nomor" class="hover:bg-gray-50">
              <td v-if="akun.type === 'header'" class="px-6 py-4 text-left font-bold bg-gray-200" colspan="2">{{ akun.nomor }}</td>
              <template v-else>
                <td class="w-[2%] px-6 py-4 text-center"><font-awesome-icon icon="arrow-right" /></td>
                <td class="px-6 py-4 text-left">{{ akun.nomor }}</td>
              </template>
              <td class="px-6 py-4 text-left" :class="akun.type === 'header' ? 'font-bold uppercase bg-gray-200' : '' ">
                {{ akun.name }}</td>
              <td class="px-6 py-4 text-center" :class="akun.type === 'header' ? 'font-bold uppercase bg-gray-200' : '' ">{{ akun.tipe_akun }}</td>
              <td class="px-6 py-4 text-center" :class="akun.type === 'header' ? 'font-bold bg-gray-200' : '' ">{{ akun.saldo_awal }}</td>
              <td class="px-6 py-4 text-center" :class="akun.type === 'header' ? 'font-bold bg-gray-200' : '' ">{{ akun.saldo_akhir }}</td>
              <td class="px-6 py-4 text-center" :class="akun.type === 'header' ? 'font-bold uppercase bg-gray-200' : '' ">
                <div class="flex justify-center gap-2">
                  <PrimaryButton v-if=" akun.type === 'header'" @click="addAkunBtn(akun.id, akun.nomor)">
                    <font-awesome-icon icon="fa-solid fa-plus" class="mr-0" />
                  </PrimaryButton>
                  <template v-else>
                    <SuccessButton v-if="akun.tipe_akun === 'bawaan' " >
                      <font-awesome-icon icon="fa-solid fa-money-bill" class="mr-0" />
                    </SuccessButton>
                    <template v-else>
                      <PrimaryButton >
                        <font-awesome-icon icon="fa-solid fa-pencil" class="mr-0" />
                      </PrimaryButton>
                      <DangerButton @click="deleteAkunBtn(akun.id)" >
                        <font-awesome-icon icon="fa-solid fa-times" class="mr-0" />
                      </DangerButton>
                    </template>
                  </template>
                </div>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="6" class="px-6 py-4 text-center text-base text-gray-600">Daftar Akun tidak ditemukan.</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <tr><td class="px-4 py-4 text-center border h-[50px]" :colspan="7"></td></tr>
        </tfoot>
      </table>
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

    <!-- Modal Tambah Akun Baru -->
    <ModalAddUpdateAkun  :showStatus="showAddModal" @update-statusShow="updateStatusShow" :data="dataAddUpdateAkun" :selectedAkun="selectedAkun" @close="showAddModal = false"  />

    <Notification  :showNotification="showNotification"  :notificationType="notificationType" :notificationMessage="notificationMessage" @close="showNotification = false"  ></Notification>
  </div>
</template>
